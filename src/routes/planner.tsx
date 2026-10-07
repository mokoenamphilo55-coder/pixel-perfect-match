import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Plus, Sparkles, X } from "lucide-react";
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

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Research Assistant" },
      { name: "description", content: "Prioritize your tasks and get a daily or weekly schedule." },
      { property: "og:title", content: "AI Task Planner" },
      { property: "og:description", content: "Prioritize your tasks and get a daily or weekly schedule." },
    ],
  }),
  component: PlannerPage,
});

type Task = { name: string; priority: string; due: string };

function PlannerPage() {
  const ai = useAi("planner");
  const [tasks, setTasks] = useState<Task[]>([{ name: "", priority: "High", due: "" }]);
  const [range, setRange] = useState("Daily");
  const [hours, setHours] = useState("09:00-17:00");
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState("");
  useEffect(() => setHours(readSettings().hours), []);
  const upd = (i: number, k: keyof Task, v: string) => setTasks((t) => t.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  const submit = () => {
    const valid = tasks.filter((t) => t.name.trim());
    if (!valid.length) return setErr("Add at least one task.");
    setErr("");
    const list = valid.map((t) => `- ${t.name} (priority: ${t.priority}${t.due ? `, due: ${t.due}` : ""})`).join("\n");
    ai.run({ tasks: list, range, hours, notes }, `${range} plan · ${valid.length} task${valid.length > 1 ? "s" : ""}`);
  };

  return (
    <>
      <PageHeader title="AI Task Planner" sub="List what's on your plate. Get a prioritized, realistic schedule." />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="space-y-4">
          <InputCard onSubmit={submit}>
            <div className="grid grid-cols-2 gap-3">
              <Field id="range" label="Plan type">
                <Select value={range} onValueChange={setRange}>
                  <SelectTrigger id="range"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Daily">Daily</SelectItem><SelectItem value="Weekly">Weekly</SelectItem></SelectContent>
                </Select>
              </Field>
              <Field id="hours" label="Working hours"><Input id="hours" value={hours} onChange={(e) => setHours(e.target.value)} /></Field>
            </div>
            <fieldset className="space-y-2">
              <legend className="mb-1.5 text-sm font-medium">Tasks *</legend>
              {tasks.map((t, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto] gap-2 rounded-lg border bg-muted/40 p-2 sm:grid-cols-[1fr_110px_130px_auto]">
                  <Input aria-label={`Task ${i + 1}`} placeholder="e.g. Literature review chapter 2" value={t.name} onChange={(e) => upd(i, "name", e.target.value)} className="col-span-1" />
                  <Button type="button" variant="ghost" size="icon" aria-label="Remove task" className="sm:order-last" disabled={tasks.length === 1} onClick={() => setTasks((x) => x.filter((_, j) => j !== i))}><X /></Button>
                  <Select value={t.priority} onValueChange={(v) => upd(i, "priority", v)}>
                    <SelectTrigger aria-label="Priority"><SelectValue /></SelectTrigger>
                    <SelectContent>{["High", "Medium", "Low"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input type="date" aria-label="Due date" value={t.due} onChange={(e) => upd(i, "due", e.target.value)} />
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setTasks((x) => [...x, { name: "", priority: "Medium", due: "" }])}><Plus /> Add task</Button>
            </fieldset>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <Field id="pnotes" label="Anything else?"><Textarea id="pnotes" rows={3} placeholder="e.g. Gym at 6pm, I focus best in the morning" value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
            <Button type="submit" className="w-full" disabled={ai.loading}>{ai.loading ? <Loader2 className="animate-spin" /> : <Sparkles />} Build my schedule</Button>
          </InputCard>
          <Disclaimer />
        </div>
        <OutputPanel {...ai} onRegenerate={submit} onStop={ai.stop} onClear={ai.clear} emptyText="Your prioritized task list and timetable will appear here." />
      </div>
    </>
  );
}
