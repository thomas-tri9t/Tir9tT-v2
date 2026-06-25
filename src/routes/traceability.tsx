import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Grid3X3, Shield, FlaskConical, Bug, FileText } from "lucide-react";
import { ContextHeader } from "@/components/workspace-shell";
import { requirements, defects } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/traceability")({
  head: () => ({ meta: [{ title: "Traceability — RequireQA" }] }),
  component: TraceabilityPage,
});

function TraceabilityPage() {
  const [view, setView] = useState<"graph" | "matrix">("graph");

  return (
    <div className="min-h-screen">
      <ContextHeader
        eyebrow="Traceability"
        title="End-to-end coverage"
        meta="Visualize how requirements, tests, defects, and compliance frameworks connect."
        actions={
          <div className="flex items-center gap-1 rounded-lg border p-0.5">
            <button
              onClick={() => setView("graph")}
              className={cn("h-7 px-3 rounded-md text-xs font-medium inline-flex items-center gap-1.5", view === "graph" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
            >
              <Network className="h-3.5 w-3.5" /> Graph
            </button>
            <button
              onClick={() => setView("matrix")}
              className={cn("h-7 px-3 rounded-md text-xs font-medium inline-flex items-center gap-1.5", view === "matrix" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
            >
              <Grid3X3 className="h-3.5 w-3.5" /> Matrix
            </button>
          </div>
        }
      />

      <div className="px-8 py-6">
        <AnimatePresence mode="wait">
          <motion.div key={view}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {view === "graph" ? <Graph /> : <Matrix />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Graph() {
  const W = 1200, H = 640;
  // 4 columns: Requirements, Tests, Defects, Compliance
  const cols = [
    { label: "Requirements", icon: FileText, items: requirements.slice(0, 6), x: 150 },
    { label: "Tests", icon: FlaskConical, items: requirements.flatMap(r => r.testCases.map(t => ({ id: t, name: t }))).slice(0, 6), x: 450 },
    { label: "Defects", icon: Bug, items: defects.slice(0, 4), x: 750 },
    { label: "Compliance", icon: Shield, items: [
      { id: "FDA", name: "FDA 21 CFR" }, { id: "ISO13485", name: "ISO 13485" },
      { id: "IEC62304", name: "IEC 62304" }, { id: "ISO14971", name: "ISO 14971" },
    ], x: 1050 },
  ];

  const nodePos = (colIdx: number, itemIdx: number, total: number) => {
    const x = cols[colIdx].x;
    const y = 100 + (itemIdx + 0.5) * ((H - 140) / total);
    return { x, y };
  };

  const links: { from: [number, number]; to: [number, number] }[] = [];
  requirements.slice(0, 6).forEach((r, i) => {
    r.testCases.slice(0, 2).forEach((tc) => {
      const tIdx = cols[1].items.findIndex(t => t.id === tc);
      if (tIdx >= 0) links.push({ from: [0, i], to: [1, tIdx] });
    });
    r.compliance.forEach((c) => {
      const cIdx = cols[3].items.findIndex((x: any) => c.includes(x.name) || x.id === c.replace(/\s/g, "").slice(0, 8));
      if (cIdx >= 0) links.push({ from: [0, i], to: [3, cIdx] });
    });
  });
  defects.slice(0, 4).forEach((_d, i) => {
    links.push({ from: [1, i % cols[1].items.length], to: [2, i] });
  });

  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[640px]">
        {/* Column headers */}
        {cols.map((c, idx) => (
          <g key={c.label}>
            <rect x={c.x - 90} y={30} width={180} height={36} rx={10} fill="hsl(var(--muted))" />
            <text x={c.x} y={53} textAnchor="middle" className="fill-foreground text-xs font-semibold uppercase tracking-wider">
              {c.label}
            </text>
          </g>
        ))}

        {/* Links */}
        {links.map((l, idx) => {
          const a = nodePos(l.from[0], l.from[1], cols[l.from[0]].items.length);
          const b = nodePos(l.to[0], l.to[1], cols[l.to[0]].items.length);
          const midX = (a.x + b.x) / 2;
          return (
            <path
              key={idx}
              d={`M ${a.x + 80} ${a.y} C ${midX} ${a.y}, ${midX} ${b.y}, ${b.x - 80} ${b.y}`}
              stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" fill="none"
            />
          );
        })}

        {/* Nodes */}
        {cols.map((c, colIdx) =>
          c.items.map((item, i) => {
            const { x, y } = nodePos(colIdx, i, c.items.length);
            const label = (item as any).name ?? (item as any).title ?? item.id;
            return (
              <g key={`${colIdx}-${item.id}`} className="cursor-pointer">
                <rect x={x - 80} y={y - 18} width={160} height={36} rx={10}
                  fill="hsl(var(--card))" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1.5"
                  className="hover:fill-primary/10 transition-colors" />
                <text x={x - 70} y={y + 4} className="fill-foreground text-[10px] font-mono">{item.id.slice(0, 10)}</text>
                <text x={x + 70} y={y + 4} textAnchor="end" className="fill-muted-foreground text-[10px]">
                  {String(label).slice(0, 12)}{String(label).length > 12 ? "…" : ""}
                </text>
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
}

function Matrix() {
  const compliance = ["FDA 21 CFR Part 820", "ISO 13485", "IEC 62304", "ISO 14971"];
  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold uppercase tracking-wider text-[10px]">Requirement</th>
              <th className="text-left px-4 py-3 font-semibold uppercase tracking-wider text-[10px]">Tests</th>
              <th className="text-left px-4 py-3 font-semibold uppercase tracking-wider text-[10px]">Defects</th>
              {compliance.map(c => (
                <th key={c} className="px-3 py-3 font-semibold uppercase tracking-wider text-[10px]">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {requirements.map(r => (
              <tr key={r.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="font-mono text-[10px] text-muted-foreground">{r.id}</div>
                  <div className="font-medium text-sm">{r.name}</div>
                </td>
                <td className="px-4 py-3 text-sm">{r.testCases.join(", ") || "—"}</td>
                <td className="px-4 py-3 text-sm">—</td>
                {compliance.map(c => (
                  <td key={c} className="text-center px-3 py-3">
                    {r.compliance.includes(c)
                      ? <span className="inline-block h-2 w-2 rounded-full bg-success" />
                      : <span className="inline-block h-2 w-2 rounded-full bg-muted" />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
