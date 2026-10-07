import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { buildPrompt } from "@/lib/prompts";

const Body = z.object({
  tool: z.enum(["email", "summary", "planner"]),
  input: z.record(z.string(), z.string().max(20000)),
});

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = Body.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "Invalid request." }, { status: 400 });
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return Response.json({ error: "AI is not configured." }, { status: 500 });
        const { system, user } = buildPrompt(parsed.data.tool, parsed.data.input);
        try {
          const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
            method: "POST",
            signal: request.signal,
            headers: {
              "Content-Type": "application/json",
              "Lovable-API-Key": apiKey,
              "X-Lovable-AIG-SDK": "fetch",
            },
            body: JSON.stringify({
              model: "openai/gpt-6-astra",
              input: [
                { role: "system", content: system },
                { role: "user", content: user },
              ],
              stream: true,
              store: false,
              reasoning: { effort: "low", summary: "auto" },
              include: ["reasoning.encrypted_content"],
            }),
          });
          if (!res.ok || !res.body) {
            const text = await res.text().catch(() => "");
            let message = "The AI service returned an error.";
            if (res.status === 429) message = "Too many requests right now. Please wait a moment and try again.";
            else if (res.status === 402) message = "AI credits have run out for this workspace.";
            else {
              try {
                message = JSON.parse(text)?.error?.message ?? JSON.parse(text)?.message ?? message;
              } catch {}
            }
            return Response.json({ error: message }, { status: res.status });
          }
          return new Response(res.body, {
            headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
          });
        } catch (e) {
          if (request.signal.aborted) return new Response(null, { status: 499 });
          throw e;
        }
      },
    },
  },
});
