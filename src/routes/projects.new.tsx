import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Plus, X, Search, Upload } from "lucide-react";
import { PageHeader } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { users } from "@/lib/mock-data";

export const Route = createFileRoute("/projects/new")({
  head: () => ({ meta: [{ title: "New Project — RequireQA" }] }),
  component: NewProject,
});

const compliances = [
  "FDA 21 CFR Part 820",
  "ISO 13485",
  "IEC 62304",
  "ISO 14971",
];

function NewProject() {
  const [team, setTeam] = useState<string[]>([users[0].id]);
  const [comp, setComp] = useState<string[]>([]);
  const [q, setQ] = useState("");

  const toggle = <T,>(arr: T[], v: T, set: (v: T[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="px-6 py-6 max-w-5xl mx-auto">
      <Link to="/projects" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3">
        <ArrowLeft className="h-3 w-3" /> Back to projects
      </Link>
      <PageHeader title="Create Project" description="Configure project information, team, compliance, and PRD." />

      <Tabs defaultValue="info">
        <TabsList className="mb-4">
          <TabsTrigger value="info">Project Info</TabsTrigger>
          <TabsTrigger value="team">Team & Permissions</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="prd">PRD Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card className="p-6 space-y-4">
            <div>
              <Label>Project Name *</Label>
              <Input className="mt-1" placeholder="e.g. Network Appliance v5" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea className="mt-1" rows={4} placeholder="What is this project about?" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>PRD Type</Label>
                <Select>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upstream">Upstream</SelectItem>
                    <SelectItem value="downstream">Downstream</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Relation</Label>
                <Select>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Upstream or downstream" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="up">Upstream</SelectItem>
                    <SelectItem value="down">Downstream</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-3 border-b">
                <h3 className="text-sm font-semibold mb-2">Available Users</h3>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or department..." className="pl-7 h-8" />
                </div>
              </div>
              <ul className="max-h-[420px] overflow-y-auto divide-y">
                {users.filter((u) => u.name.toLowerCase().includes(q.toLowerCase())).map((u) => (
                  <li key={u.id} className="px-4 py-2.5 flex items-center justify-between hover:bg-accent/40">
                    <div>
                      <div className="text-sm font-medium">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.department} • {u.role}</div>
                    </div>
                    <Button size="sm" variant={team.includes(u.id) ? "secondary" : "outline"} onClick={() => toggle(team, u.id, setTeam)}>
                      {team.includes(u.id) ? "Added" : <><Plus className="h-3 w-3 mr-1" />Add</>}
                    </Button>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-3 border-b">
                <h3 className="text-sm font-semibold">Selected Members & Permissions</h3>
              </div>
              <ul className="divide-y">
                {team.length === 0 && <li className="px-4 py-6 text-sm text-muted-foreground">No members selected.</li>}
                {team.map((id) => {
                  const u = users.find((x) => x.id === id)!;
                  return (
                    <li key={id} className="px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">{u.name}</div>
                        <button onClick={() => toggle(team, id, setTeam)} className="text-muted-foreground hover:text-destructive">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <label className="flex items-center gap-1.5"><Checkbox defaultChecked /> Read</label>
                        <label className="flex items-center gap-1.5"><Checkbox /> Write</label>
                        <label className="flex items-center gap-1.5"><Checkbox /> Admin</label>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workspace">
          <Card className="p-6 space-y-4">
            <div>
              <Label>Compliance Standards</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {compliances.map((c) => (
                  <label key={c} className="flex items-center gap-2 border rounded px-3 py-2 cursor-pointer hover:bg-accent/40">
                    <Checkbox checked={comp.includes(c)} onCheckedChange={() => toggle(comp, c, setComp)} />
                    <span className="text-sm">{c}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label>Supporting Documents</Label>
              <div className="mt-2 border-2 border-dashed rounded-lg p-8 text-center text-sm text-muted-foreground">
                <Upload className="h-6 w-6 mx-auto mb-2" />
                Drop files here, or click to browse
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="prd">
          <Card className="p-6">
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <h3 className="font-semibold mb-1">Upload PRD Document</h3>
              <p className="text-sm text-muted-foreground mb-4">PDF, DOCX, or Markdown up to 50MB.</p>
              <Button>Choose File</Button>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span>Upload status</span><span className="text-muted-foreground">Awaiting file</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Processing status</span><span className="text-muted-foreground">—</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Estimated completion</span><span className="text-muted-foreground">—</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" asChild><Link to="/projects">Cancel</Link></Button>
        <Button>Create Project</Button>
      </div>
    </div>
  );
}
