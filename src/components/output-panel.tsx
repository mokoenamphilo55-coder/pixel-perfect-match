import { useState } from "react";
import { Copy, Pencil, RotateCcw, Trash2, Square, Loader2, Eye, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "./markdown";

type Props = {
  output: string;
  setOutput: (v: string) => void;
  loading: boolean;
  error: string | null;
  onRegenerate: () => void;
  onStop: () => void;
  onClear: () => void;
  emptyText: string;
};

export function OutputPanel(p: Props) {
  const [editing, setEditing] = useState(false);
  const has = p.output.length > 0;
  return (
    <section className="flex min-h-[420px] flex-col rounded-xl border bg-card shadow-card" aria-live="polite">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
        <h2 className="text-lg font-semibold">Result</h2>
        <div className="flex flex-wrap gap-1">
          {p.loading ? (
            <Button size="sm" variant="ghost" onClick={p.onStop}><Square /> Stop</Button>
          ) : (
            <>
              <Button size="sm" variant="ghost" disabled={!has} onClick={() => { navigator.clipboard.writeText(p.output); toast.success("Copied to clipboard"); }}><Copy /> Copy</Button>
              <Button size="sm" variant="ghost" disabled={!has} onClick={() => setEditing((e) => !e)}>{editing ? <><Eye /> Preview</> : <><Pencil /> Edit</>}</Button>
              <Button size="sm" variant="ghost" disabled={!has && !p.error} onClick={p.onRegenerate}><RotateCcw /> Regenerate</Button>
              <Button size="sm" variant="ghost" disabled={!has && !p.error} onClick={() => { setEditing(false); p.onClear(); }}><Trash2 /> Clear</Button>
            </>
          )}
        </div>
      </header>
      <div className="flex-1 p-5">
        {p.error && (
          <div role="alert" className="mb-4 flex gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" /> {p.error}
          </div>
        )}
        {p.loading && !has && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Thinking it through…</div>
        )}
        {!p.loading && !has && !p.error && <p className="text-sm text-muted-foreground">{p.emptyText}</p>}
        {has && (editing ? (
          <Textarea className="min-h-[360px] font-mono text-sm" value={p.output} onChange={(e) => p.setOutput(e.target.value)} />
        ) : (
          <Markdown text={p.output} />
        ))}
      </div>
      <footer className="border-t px-4 py-2 text-xs text-muted-foreground">AI-generated — review before you rely on or send it.</footer>
    </section>
  );
}
