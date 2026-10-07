import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/app-sidebar";
import { Field, InputCard } from "@/components/field";
import { OutputPanel } from "@/components/output-panel";
import { Disclaimer } from "@/components/disclaimer";
import { useAi } from "@/lib/use-ai";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Research Assistant" },
      { name: "description", content: "Summarize meeting notes into decisions, action items and deadlines." },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      { property: "og:description", content: "Summarize meeting notes into decisions, action items and deadlines." },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const ai = useAi("summary");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState("");
  const submit = () => {
    if (notes.trim().length < 30) return setErr("Paste a bit more of your notes (at least a few sentences).");
    setErr("");
    ai.run({ title, notes }, title || notes.slice(0, 60));
  };
  return (
    <>
      <PageHeader title="Meeting Notes Summarizer" sub="Paste raw notes or a transcript. Get the essentials." />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="space-y-4">
          <InputCard onSubmit={submit}>
            <Field id="title" label="Meeting title"><Input id="title" placeholder="e.g. Weekly research sync" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
            <Field id="notes" label="Notes *" hint={`${notes.length.toLocaleString()} / 20,000 characters`}>
              <Textarea id="notes" rows={14} maxLength={20000} aria-invalid={!!err} placeholder="Paste your meeting notes here…" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Field>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <Button type="submit" className="w-full" disabled={ai.loading}>{ai.loading ? <Loader2 className="animate-spin" /> : <Sparkles />} Summarize</Button>
          </InputCard>
          <Disclaimer />
        </div>
        <OutputPanel {...ai} onRegenerate={submit} onStop={ai.stop} onClear={ai.clear} emptyText="Summary, decisions, action items and deadlines will appear here." />
      </div>
    </>
  );
}
