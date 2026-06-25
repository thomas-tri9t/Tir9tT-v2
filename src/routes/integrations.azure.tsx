import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/integrations/azure")({
  head: () => ({ meta: [{ title: "Azure DevOps — RequireQA" }] }),
  component: AzureIntegration,
});

function AzureIntegration() {
  return (
    <div className="px-6 py-6 max-w-3xl mx-auto">
      <Link to="/integrations" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3"><ArrowLeft className="h-3 w-3" /> Integrations</Link>
      <PageHeader title="Azure DevOps" description="Microsoft Azure DevOps — work item and pipeline sync." />
      <Card className="p-6 space-y-4">
        <div><Label>Organization URL</Label><Input className="mt-1" placeholder="https://dev.azure.com/yourorg" /></div>
        <div><Label>Project</Label><Input className="mt-1" /></div>
        <div><Label>Personal Access Token</Label><Input className="mt-1" type="password" /></div>
        <div className="flex items-center justify-between border rounded p-3"><div><div className="text-sm font-medium">Sync pipelines</div><div className="text-xs text-muted-foreground">Pull build and release results.</div></div><Switch /></div>
        <div className="flex justify-end gap-2 pt-2"><Button variant="outline">Test Connection</Button><Button>Connect</Button></div>
      </Card>
    </div>
  );
}
