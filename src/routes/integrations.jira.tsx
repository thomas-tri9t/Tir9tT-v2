import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/integrations/jira")({
  head: () => ({ meta: [{ title: "Jira — RequireQA" }] }),
  component: JiraIntegration,
});

function JiraIntegration() {
  return (
    <div className="px-6 py-6 max-w-3xl mx-auto">
      <Link to="/integrations" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3"><ArrowLeft className="h-3 w-3" /> Integrations</Link>
      <PageHeader title="Jira Integration" description="Atlassian Jira — issue tracking and defect sync." />
      <Card className="p-6 space-y-4">
        <div><Label>Site URL</Label><Input className="mt-1" placeholder="https://yourorg.atlassian.net" defaultValue="https://redside.atlassian.net" /></div>
        <div><Label>Email</Label><Input className="mt-1" placeholder="user@company.com" /></div>
        <div><Label>API Token</Label><Input className="mt-1" type="password" placeholder="••••••••••••" /></div>
        <div><Label>Default Project Key</Label><Input className="mt-1" placeholder="BAJ" /></div>
        <div className="flex items-center justify-between border rounded p-3"><div><div className="text-sm font-medium">Two-way sync</div><div className="text-xs text-muted-foreground">Push and pull updates automatically.</div></div><Switch defaultChecked /></div>
        <div className="flex justify-end gap-2 pt-2"><Button variant="outline">Test Connection</Button><Button>Save</Button></div>
      </Card>
    </div>
  );
}
