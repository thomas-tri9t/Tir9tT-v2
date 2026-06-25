import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-layout";
import { ActivityFeed } from "@/components/activity-feed";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/activities")({
  head: () => ({ meta: [{ title: "Activity — RequireQA" }] }),
  component: () => (
    <div className="px-6 py-6 max-w-4xl mx-auto">
      <PageHeader title="All Activity" description="Edits, approvals, rejections, syncs, and comments across all projects." />
      <Card className="overflow-hidden p-0">
        <ActivityFeed />
      </Card>
    </div>
  ),
});
