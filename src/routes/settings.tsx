import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/app-sidebar";
import { Field, InputCard } from "@/components/field";
import { defaults, readSettings, saveSettings } from "@/lib/settings";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Research Assistant" },
      { name: "description", content: "Set your name, default email tone and working hours." },
      { property: "og:title", content: "Settings — AI Research Assistant" },
      { property: "og:description", content: "Set your name, default email tone and working hours." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [s, setS] = useState(defaults);
  useEffect(() => setS(readSettings()), []);
  return (
    <>
      <PageHeader title="Settings" sub="Defaults saved on this device." />
      <div className="max-w-xl">
        <InputCard onSubmit={() => { saveSettings(s); toast.success("Settings saved"); }}>
          <Field id="name" label="Your name" hint="Used to sign generated emails."><Input id="name" value={s.name} onChange={(e) => setS({ ...s, name: e.target.value })} /></Field>
          <Field id="dtone" label="Default email tone">
            <Select value={s.tone} onValueChange={(v) => setS({ ...s, tone: v })}>
              <SelectTrigger id="dtone"><SelectValue /></SelectTrigger>
              <SelectContent>{["Formal", "Friendly", "Persuasive"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field id="dhours" label="Default working hours"><Input id="dhours" value={s.hours} onChange={(e) => setS({ ...s, hours: e.target.value })} /></Field>
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => { localStorage.removeItem("ara-activity"); toast.success("Recent activity cleared"); }}>Clear recent activity</Button>
          </div>
        </InputCard>
      </div>
    </>
  );
}
