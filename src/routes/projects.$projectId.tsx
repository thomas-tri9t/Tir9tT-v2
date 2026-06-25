import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown, ChevronRight, Settings2, Upload } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/app-layout";
import { ActivityFeed } from "@/components/activity-feed";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { projects, requirements } from "@/lib/mock-data";

export const Route = createFileRoute("/projects/$projectId")({
  head: () => ({ meta: [{ title: "Project — RequireQA" }] }),
  component: ProjectDetail,
});

const levelNames = ["System Requirement", "Software Requirement", "Functional Requirement", "Component Requirement", "Test Cases", "Defects"];

function ProjectDetail() {
  const { projectId } = useParams({ from: "/projects/$projectId" });
  const project = projects.find((p) => p.id === projectId) ?? projects[0];
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ "REQ-001": true, "REQ-005": true });

  const tree = requirements.filter((r) => !r.parent);
  const childrenOf = (id: string) => requirements.filter((r) => r.parent === id);

  const renderRow = (req: typeof requirements[number], depth = 0): React.ReactNode => {
    const children = childrenOf(req.id);
    const isOpen = expanded[req.id];
    return (
      <div key={req.id}>
        <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1.5fr_1.5fr_1fr] gap-2 px-3 py-2 border-b hover:bg-accent/40 text-sm items-center">
          <div className="flex items-center gap-1" style={{ paddingLeft: depth * 16 }}>
            {children.length > 0 ? (
              <button onClick={() => setExpanded({ ...expanded, [req.id]: !isOpen })}>
                {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </button>
            ) : <span className="w-3.5" />}
            <Link to="/requirements/$reqId" params={{ reqId: req.id }} className="font-mono text-xs text-primary hover:underline">
              {req.id}
            </Link>
          </div>
          <div className="font-medium">{req.name}</div>
          <div className="text-xs text-muted-foreground">{req.group}</div>
          <StatusBadge value={req.priority} />
          <div className="text-xs">{req.testCases.join(", ") || "---"}</div>
          <div className="text-xs">{req.compliance.join(", ") || "---"}</div>
          <StatusBadge value={req.status} />
        </div>
        {isOpen && children.map((c) => renderRow(c, depth + 1))}
      </div>
    );
  };

  return (
    <div className="px-6 py-6 max-w-[1600px] mx-auto">
      <Link to="/projects" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3">
        <ArrowLeft className="h-3 w-3" /> Back to projects
      </Link>
      <PageHeader
        title={project.name}
        description={project.description}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge value={project.status} />
            <StatusBadge value={project.health} />
            <Button variant="outline" size="sm"><Settings2 className="h-4 w-4 mr-1" /> Configure</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Progress</div><div className="text-2xl font-semibold mt-1">{project.progress}%</div><Progress value={project.progress} className="h-1.5 mt-2" /></Card>
        <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Owner</div><div className="text-base font-medium mt-1">{project.owner}</div></Card>
        <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Updated</div><div className="text-base font-medium mt-1">{project.updatedAt}</div></Card>
        <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Requirements</div><div className="text-2xl font-semibold mt-1">{requirements.length}</div></Card>
      </div>

      <Tabs defaultValue="requirements">
        <TabsList>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="prd">PRD & Documents</TabsTrigger>
          <TabsTrigger value="hitl">Human-in-the-Loop</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements">
          <Card className="overflow-hidden p-0">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Extracted Requirements</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Dynamic hierarchy: {levelNames.join(" → ")}
                </p>
              </div>
              <Button size="sm" variant="outline">Map Requirement</Button>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[1100px]">
                <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1.5fr_1.5fr_1fr] gap-2 px-3 py-2 border-b bg-muted/50 text-[11px] uppercase tracking-wide font-semibold text-muted-foreground sticky top-0">
                  <div>Requirement ID</div>
                  <div>Name</div>
                  <div>Group</div>
                  <div>Priority</div>
                  <div>Test Case IDs</div>
                  <div>Compliance</div>
                  <div>Status</div>
                </div>
                {tree.map((r) => renderRow(r))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="prd">
          <Card className="p-6">
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <h3 className="font-semibold mb-1">Upload PRD or supporting document</h3>
              <p className="text-sm text-muted-foreground mb-4">PDF, DOCX, Markdown</p>
              <Button>Choose File</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="hitl">
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold">AI Contextual Questions</h3>
            <p className="text-sm text-muted-foreground">The AI has analyzed your PRD and has 4 clarifying questions:</p>
            {[
              "What user roles should have access to biometric login?",
              "Are there regulatory requirements beyond FDA 21 CFR Part 820?",
              "What is the acceptable failure rate for fingerprint capture?",
              "Should sensor calibration be automatic or manual?",
            ].map((q, i) => (
              <div key={i} className="border rounded p-3">
                <p className="text-sm font-medium mb-2">{i + 1}. {q}</p>
                <textarea className="w-full text-sm border rounded p-2 min-h-16" placeholder="Your answer..." />
              </div>
            ))}
            <div className="flex justify-end"><Button>Submit Answers</Button></div>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="p-0 overflow-hidden"><ActivityFeed /></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
