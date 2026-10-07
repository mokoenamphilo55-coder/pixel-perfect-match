import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/app-sidebar";
import { Field, InputCard } from "@/components/field";
import { OutputPanel } from "@/components/output-panel";
import { Disclaimer } from "@/components/disclaimer";
import { useAi } from "@/lib/use-ai";
import { readSettings } from "@/lib/settings";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Research Assistant" },
      { name: "description", content: "Generate professional emails in a formal, friendly or persuasive tone." },
      { property: "og:title", content: "Smart Email Generator" },
      { property: "og:description", content: "Generate professional emails in a formal, friendly or persuasive tone." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const ai = useAi("email");
  const [f, setF] = useState({ recipient: "", purpose: "", details: "", tone: "Formal", sender: "" });
  const [err, setErr] = useState("");
  useEffect(() => {
    const s = readSettings();
    setF((p) => ({ ...p, tone: s.tone, sender: s.name }));
  }, []);
  const set = (k: keyof typeof f) => (v: string) => setF((p) => ({ ...p, [k]: v }));
  const submit = () => {
    if (!f.purpose.trim()) return setErr("Please describe what the email is about.");
    setErr("");
    ai.run(f, f.purpose.slice(0, 60));
  };

  return (
    <>
      <PageHeader title="Smart Email Generator" sub="Describe what you need to say — we'll write it properly." />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="space-y-4">
          <InputCard onSubmit={submit}>
            <Field id="tone" label="Tone">
              <Select value={f.tone} onValueChange={set("tone")}>
                <SelectTrigger id="tone"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Formal", "Friendly", "Persuasive"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field id="recipient" label="Recipient"><Input id="recipient" placeholder="e.g. Dr. Nkosi, project supervisor" value={f.recipient} onChange={(e) => set("recipient")(e.target.value)} /></Field>
            <Field id="purpose" label="Purpose *"><Input id="purpose" aria-invalid={!!err} placeholder="e.g. Request a deadline extension" value={f.purpose} onChange={(e) => set("purpose")(e.target.value)} /></Field>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <Field id="details" label="Key points" hint="Bullet points are fine."><Textarea id="details" rows={6} placeholder="- Need one more week&#10;- Data collection delayed" value={f.details} onChange={(e) => set("details")(e.target.value)} /></Field>
            <Field id="sender" label="Your name"><Input id="sender" value={f.sender} onChange={(e) => set("sender")(e.target.value)} /></Field>
            <Button type="submit" className="w-full" disabled={ai.loading}>{ai.loading ? <Loader2 className="animate-spin" /> : <Sparkles />} Generate email</Button>
          </InputCard>
          <Disclaimer />
        </div>
        <OutputPanel {...ai} onRegenerate={submit} onStop={ai.stop} onClear={ai.clear} emptyText="Your email will appear here." />
      </div>
    </>
  );
}
