import { createFileRoute } from "@tanstack/react-router";
import { Search, Plus } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/app-layout";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { defects } from "@/lib/mock-data";

export const Route = createFileRoute("/defects")({
  head: () => ({ meta: [{ title: "Defects — RequireQA" }] }),
  component: DefectsPage,
});

function DefectsPage() {
  const [q, setQ] = useState("");
  const list = defects.filter((d) => d.title.toLowerCase().includes(q.toLowerCase()) || d.id.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="px-6 py-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Defects"
        description="Track, triage, and resolve issues found during execution."
        actions={<Button><Plus className="h-4 w-4 mr-1" /> New Defect</Button>}
      />
      <div className="relative max-w-md mb-4">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search defects..." className="pl-9" />
      </div>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-[11px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-2.5">ID</th>
              <th className="text-left px-4 py-2.5">Title</th>
              <th className="text-left px-4 py-2.5">Project</th>
              <th className="text-left px-4 py-2.5">Severity</th>
              <th className="text-left px-4 py-2.5">Status</th>
              <th className="text-left px-4 py-2.5">Owner</th>
              <th className="text-left px-4 py-2.5">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {list.map((d) => (
              <tr key={d.id} className="hover:bg-accent/40">
                <td className="px-4 py-2.5 font-mono text-xs text-primary">{d.id}</td>
                <td className="px-4 py-2.5 font-medium">{d.title}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{d.project}</td>
                <td className="px-4 py-2.5"><StatusBadge value={d.severity} /></td>
                <td className="px-4 py-2.5"><StatusBadge value={d.status} /></td>
                <td className="px-4 py-2.5 text-xs">{d.owner}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{d.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
