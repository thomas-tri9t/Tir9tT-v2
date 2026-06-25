import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { roles } from "@/lib/mock-data";

export const Route = createFileRoute("/settings/roles")({
  head: () => ({ meta: [{ title: "Roles — Settings" }] }),
  component: RoleMgmt,
});

function RoleMgmt() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Role Management</h2>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> New Role</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold">{r.name}</h3>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{r.description}</p>
            <div className="flex gap-4 text-xs">
              <span><b>{r.users}</b> users</span>
              <span><b>{r.permissions}</b> permissions</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
