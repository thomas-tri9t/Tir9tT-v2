import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/integrations/polarion")({
  head: () => ({ meta: [{ title: "Polarion — RequireQA" }] }),
  component: PolarionIntegration,
});

function PolarionIntegration() {
  return (
    <div className="px-6 py-6 max-w-3xl mx-auto">
      <Link to="/integrations" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3"><ArrowLeft className="h-3 w-3" /> Integrations</Link>
      <PageHeader title="Polarion Integration" description="Siemens Polarion ALM — requirement and test sync." />
      <Card className="p-6 space-y-4">
        <div><Label>Server URL</Label><Input className="mt-1" defaultValue="https://polarion.redside.com" /></div>
        <div><Label>Username</Label><Input className="mt-1" /></div>
        <div><Label>Password / Token</Label><Input className="mt-1" type="password" /></div>
        <div><Label>Project ID</Label><Input className="mt-1" placeholder="clear3hearingaid" /></div>
        <div className="flex items-center justify-between border rounded p-3"><div><div className="text-sm font-medium">Sync requirements</div><div className="text-xs text-muted-foreground">Mirror Polarion work items.</div></div><Switch defaultChecked /></div>
        <div className="flex justify-end gap-2 pt-2"><Button variant="outline">Test Connection</Button><Button>Save</Button></div>
      </Card>
    </div>
  );
}
