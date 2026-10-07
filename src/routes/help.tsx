import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Eye, Scale, Lock } from "lucide-react";
import { PageHeader } from "@/components/app-sidebar";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Responsible AI & Help — AI Research Assistant" },
      { name: "description", content: "How to use the AI Research Assistant responsibly, plus quick tips." },
      { property: "og:title", content: "Responsible AI & Help" },
      { property: "og:description", content: "How to use the AI Research Assistant responsibly, plus quick tips." },
    ],
  }),
  component: HelpPage,
});

const points = [
  { icon: AlertTriangle, t: "AI can be wrong", d: "Generated text may contain errors, missing details or invented facts." },
  { icon: Eye, t: "Always review", d: "Check emails, summaries and schedules before sending or relying on them." },
  { icon: Scale, t: "Use your judgment", d: "This tool supports you — it does not replace professional, academic or legal judgment." },
  { icon: Lock, t: "Protect privacy", d: "Avoid entering personal, financial or confidential information unless necessary." },
];

function HelpPage() {
  return (
    <>
      <PageHeader title="Responsible AI & Help" sub="Get the most out of the assistant — safely." />
      <div className="grid gap-4 sm:grid-cols-2">
        {points.map((p) => (
          <div key={p.t} className="rounded-xl border bg-card p-5 shadow-card">
            <p.icon className="size-6 text-primary" />
            <h2 className="mt-3 text-xl font-semibold">{p.t}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{p.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-xl border bg-card p-6 shadow-card">
        <h2 className="text-2xl font-semibold">Quick tips</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm marker:text-primary">
          <li><strong>Emails:</strong> give the purpose and 2–4 key points; pick a tone to match the recipient.</li>
          <li><strong>Meetings:</strong> paste notes as-is — names and dates help the AI find owners and deadlines.</li>
          <li><strong>Planner:</strong> add priorities and due dates; mention fixed commitments in “Anything else?”.</li>
          <li>Use <strong>Edit</strong> to tweak results, <strong>Regenerate</strong> for a fresh take, and <strong>Copy</strong> to paste anywhere.</li>
        </ul>
      </div>
    </>
  );
}
