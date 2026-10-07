import type { ReactNode } from "react";

function inline(s: string): ReactNode[] {
  return s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
  );
}

/** Small, safe Markdown renderer for headings, lists, checkboxes, tables and paragraphs. */
export function Markdown({ text }: { text: string }) {
  const lines: string[] = text.split("\n");
  const at = (n: number) => lines[n] ?? "";
  const out: ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const l = at(i);
    if (/^\s*\|/.test(l)) {
      const rows: string[][] = [];
      while (i < lines.length && /^\s*\|/.test(at(i))) {
        if (!/^\s*\|[\s:|-]+\|\s*$/.test(at(i)))
          rows.push(at(i).trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
        i++;
      }
      const [head, ...body] = rows;
      out.push(
        <div key={i} className="my-3 overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted"><tr>{head?.map((c, j) => <th key={j} className="px-3 py-2 text-left font-semibold">{inline(c)}</th>)}</tr></thead>
            <tbody>{body.map((r, k) => <tr key={k} className="border-t">{r.map((c, j) => <td key={j} className="px-3 py-2 align-top">{inline(c)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
      continue;
    }
    if (/^\s*[-*] /.test(l) || /^\s*\d+\. /.test(l)) {
      const items: string[] = [];
      const ordered = /^\s*\d+\. /.test(l);
      while (i < lines.length && (/^\s*[-*] /.test(at(i)) || /^\s*\d+\. /.test(at(i)))) {
        items.push(at(i).replace(/^\s*([-*]|\d+\.) /, ""));
        i++;
      }
      const Tag = ordered ? "ol" : "ul";
      out.push(
        <Tag key={i} className={`my-2 space-y-1.5 pl-5 ${ordered ? "list-decimal" : "list-disc"} marker:text-primary`}>
          {items.map((it, k) => {
            const m = it.match(/^\[( |x)\] (.*)/i);
            return m ? (
              <li key={k} className="-ml-5 list-none"><label className="flex gap-2"><input type="checkbox" defaultChecked={m[1] !== " "} className="mt-1 accent-primary" />{inline(m[2] ?? "")}</label></li>
            ) : <li key={k}>{inline(it)}</li>;
          })}
        </Tag>,
      );
      continue;
    }
    const h = l.match(/^(#{1,4}) (.*)/);
    if (h) out.push(<h3 key={i} className="mt-5 mb-1 text-xl font-semibold first:mt-0">{inline(h[2] ?? "")}</h3>);
    else if (l.trim()) out.push(<p key={i} className="my-2 leading-relaxed">{inline(l)}</p>);
    i++;
  }
  return <div className="text-[15px]">{out}</div>;
}
