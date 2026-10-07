import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export function Disclaimer() {
  return (
    <div className="flex gap-3 rounded-xl border border-highlight/40 bg-highlight/10 p-4 text-sm">
      <ShieldCheck className="mt-0.5 size-5 shrink-0 text-highlight-foreground" />
      <p>
        <strong>Responsible AI:</strong> results may contain errors. Review important information, use your own judgment,
        and avoid entering personal or confidential details unnecessarily.{" "}
        <Link to="/help" className="font-medium underline underline-offset-2">Learn more</Link>
      </p>
    </div>
  );
}
