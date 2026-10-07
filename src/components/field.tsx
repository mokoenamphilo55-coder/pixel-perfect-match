import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

export function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function InputCard({ children, onSubmit }: { children: ReactNode; onSubmit: () => void }) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      className="space-y-4 rounded-xl border bg-card p-5 shadow-card"
    >
      {children}
    </form>
  );
}
