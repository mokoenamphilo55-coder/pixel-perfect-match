import { useCallback, useRef, useState } from "react";
import type { Tool } from "./prompts";

export type Activity = { id: string; tool: Tool; title: string; at: number };
const KEY = "ara-activity";

export function readActivity(): Activity[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function logActivity(tool: Tool, title: string) {
  const list = [{ id: String(Date.now()), tool, title, at: Date.now() }, ...readActivity()].slice(0, 12);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function useAi(tool: Tool) {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abort = useRef<AbortController | null>(null);

  const run = useCallback(
    async (input: Record<string, string>, title: string) => {
      abort.current?.abort();
      const ctrl = new AbortController();
      abort.current = ctrl;
      setLoading(true);
      setError(null);
      setOutput("");
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tool, input }),
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || "Something went wrong. Please try again.");
        }
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let buf = "";
        let text = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (!data || data === "[DONE]") continue;
            try {
              const ev = JSON.parse(data);
              if (ev.type === "response.output_text.delta") {
                text += ev.delta;
                setOutput(text);
              } else if (ev.type === "error" || ev.type === "response.failed") {
                throw new Error(ev.error?.message || ev.response?.error?.message || "The AI could not finish.");
              }
            } catch (e) {
              if (e instanceof SyntaxError) continue;
              throw e;
            }
          }
        }
        if (!text.trim()) throw new Error("The AI returned an empty response. Try adding more detail.");
        logActivity(tool, title);
      } catch (e) {
        if ((e as Error).name !== "AbortError") setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [tool],
  );

  const stop = () => abort.current?.abort();
  const clear = () => {
    stop();
    setOutput("");
    setError(null);
  };
  return { output, setOutput, loading, error, run, stop, clear };
}
