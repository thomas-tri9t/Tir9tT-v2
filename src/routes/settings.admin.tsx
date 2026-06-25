import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/settings/admin")({
  head: () => ({ meta: [{ title: "Admin — Settings" }] }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Admin</h2>
      <div className="space-y-4">
        <Card className="p-5">
          <h3 className="font-semibold mb-3 text-sm">Organization</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Organization Name</Label><Input className="mt-1" defaultValue="Redside Consulting" /></div>
            <div><Label>Domain</Label><Input className="mt-1" defaultValue="redside.com" /></div>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-3 text-sm">System</h3>
          <div className="space-y-3">
            {[
              { label: "Enable audit logging", desc: "Record all user actions for compliance." },
              { label: "Require electronic signatures", desc: "For approvals on regulated projects." },
              { label: "Enable AI-assisted requirement extraction", desc: "Use LLMs to parse PRDs." },
              { label: "Allow external user invites", desc: "Invite users outside the organization domain." },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between border rounded p-3">
                <div><div className="text-sm font-medium">{s.label}</div><div className="text-xs text-muted-foreground">{s.desc}</div></div>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-3 text-sm">Danger Zone</h3>
          <div className="flex items-center justify-between border border-destructive/30 rounded p-3">
            <div><div className="text-sm font-medium">Purge inactive projects</div><div className="text-xs text-muted-foreground">Permanently delete projects with no activity for 12+ months.</div></div>
            <Button variant="destructive" size="sm">Purge</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
