import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { users } from "@/lib/mock-data";

export const Route = createFileRoute("/settings/users")({
  head: () => ({ meta: [{ title: "Users — Settings" }] }),
  component: UserMgmt,
});

function UserMgmt() {
  const [q, setQ] = useState("");
  const list = users.filter((u) => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">User Management</h2>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Invite User</Button>
      </div>
      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users..." className="pl-9" />
      </div>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-[11px] uppercase tracking-wide text-muted-foreground">
            <tr><th className="text-left px-4 py-2.5">Name</th><th className="text-left px-4 py-2.5">Email</th><th className="text-left px-4 py-2.5">Department</th><th className="text-left px-4 py-2.5">Role</th><th className="text-left px-4 py-2.5">Status</th></tr>
          </thead>
          <tbody className="divide-y">
            {list.map((u) => (
              <tr key={u.id} className="hover:bg-accent/40">
                <td className="px-4 py-2.5 font-medium">{u.name}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{u.email}</td>
                <td className="px-4 py-2.5 text-xs">{u.department}</td>
                <td className="px-4 py-2.5 text-xs">{u.role}</td>
                <td className="px-4 py-2.5"><StatusBadge value={u.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
