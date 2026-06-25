import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Paperclip, ExternalLink, Plus } from "lucide-react";
import { PageHeader } from "@/components/app-layout";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { requirements, defects } from "@/lib/mock-data";

export const Route = createFileRoute("/requirements/$reqId")({
  head: () => ({ meta: [{ title: "Requirement — RequireQA" }] }),
  component: ReqDetail,
});

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm mt-0.5">{value}</div>
    </div>
  );
}

function ReqDetail() {
  const { reqId } = useParams({ from: "/requirements/$reqId" });
  const req = requirements.find((r) => r.id === reqId) ?? requirements[0];
  const parent = req.parent ? requirements.find((r) => r.id === req.parent) : null;
  const children = requirements.filter((r) => r.parent === req.id);

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto">
      <Link to="/projects" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3">
        <ArrowLeft className="h-3 w-3" /> Back
      </Link>
      <PageHeader
        title={`${req.id} — ${req.name}`}
        description={req.levelName}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge value={req.status} />
            <StatusBadge value={req.priority} />
            <Button variant="outline" size="sm">Edit</Button>
            <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1" />Map Requirement</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold mb-3 text-sm">Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Project ID" value="PRJ-006" />
              <Field label="Requirement ID" value={<span className="font-mono">{req.id}</span>} />
              <Field label="Owner" value="Aaron Perillat" />
              <Field label="Assigned" value="Jason Benson" />
              <Field label="Group" value={req.group} />
              <Field label="Priority" value={<StatusBadge value={req.priority} />} />
              <Field label="Status" value={<StatusBadge value={req.status} />} />
              <Field label="Created" value="2026-05-12 by Aaron" />
              <Field label="Last Modified" value="2026-06-20 by Kristi" />
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Description</div>
              <p className="text-sm">Verify the {req.name.toLowerCase()} meets all functional, non-functional, and compliance requirements for the system.</p>
            </div>
            <div className="mt-3">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Original PRD Text</div>
              <blockquote className="text-sm italic border-l-2 pl-3 text-muted-foreground">
                "The system shall provide secure {req.name.toLowerCase()} via approved methods, with audit logging and failure recovery."
              </blockquote>
            </div>
          </Card>

          <Tabs defaultValue="test-cases">
            <TabsList>
              <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
              <TabsTrigger value="traceability">Traceability</TabsTrigger>
              <TabsTrigger value="defects">Defects</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="links">External Links</TabsTrigger>
            </TabsList>

            <TabsContent value="test-cases">
              <Card className="p-0 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-[11px] uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="text-left px-4 py-2">ID</th>
                      <th className="text-left px-4 py-2">Title</th>
                      <th className="text-left px-4 py-2">Priority</th>
                      <th className="text-left px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {req.testCases.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">No test cases linked.</td></tr>}
                    {req.testCases.map((tc) => (
                      <tr key={tc}>
                        <td className="px-4 py-2 font-mono text-xs text-primary">{tc}</td>
                        <td className="px-4 py-2">Verify {req.name.toLowerCase()}</td>
                        <td className="px-4 py-2"><StatusBadge value="Medium" /></td>
                        <td className="px-4 py-2"><StatusBadge value="Passed" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </TabsContent>

            <TabsContent value="traceability">
              <Card className="p-5 space-y-3">
                <div>
                  <h4 className="text-xs uppercase font-semibold text-muted-foreground mb-2">Parent</h4>
                  {parent ? (
                    <Link to="/requirements/$reqId" params={{ reqId: parent.id }} className="text-sm text-primary hover:underline">
                      {parent.id} — {parent.name}
                    </Link>
                  ) : <span className="text-sm text-muted-foreground">No parent</span>}
                </div>
                <div>
                  <h4 className="text-xs uppercase font-semibold text-muted-foreground mb-2">Children ({children.length})</h4>
                  <ul className="space-y-1">
                    {children.map((c) => (
                      <li key={c.id}><Link to="/requirements/$reqId" params={{ reqId: c.id }} className="text-sm text-primary hover:underline">{c.id} — {c.name}</Link></li>
                    ))}
                    {children.length === 0 && <li className="text-sm text-muted-foreground">No children</li>}
                  </ul>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="defects">
              <Card className="p-0 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-[11px] uppercase tracking-wide text-muted-foreground">
                    <tr><th className="text-left px-4 py-2">ID</th><th className="text-left px-4 py-2">Title</th><th className="text-left px-4 py-2">Severity</th><th className="text-left px-4 py-2">Status</th><th className="text-left px-4 py-2">Owner</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {defects.slice(0, 3).map((d) => (
                      <tr key={d.id}>
                        <td className="px-4 py-2 font-mono text-xs text-primary">{d.id}</td>
                        <td className="px-4 py-2">{d.title}</td>
                        <td className="px-4 py-2"><StatusBadge value={d.severity} /></td>
                        <td className="px-4 py-2"><StatusBadge value={d.status} /></td>
                        <td className="px-4 py-2">{d.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </TabsContent>

            <TabsContent value="compliance">
              <Card className="p-5">
                <ul className="space-y-2">
                  {["FDA 21 CFR Part 820", "ISO 13485", "IEC 62304", "ISO 14971"].map((c) => (
                    <li key={c} className="flex items-center justify-between text-sm border-b pb-2">
                      <span>{c}</span>
                      <StatusBadge value={req.compliance.includes(c) ? "Approved" : "Draft"} />
                    </li>
                  ))}
                </ul>
              </Card>
            </TabsContent>

            <TabsContent value="attachments">
              <Card className="p-5">
                <ul className="divide-y">
                  {["design-spec.pdf", "test-protocol.docx", "diagram.png"].map((f) => (
                    <li key={f} className="flex items-center justify-between py-2 text-sm">
                      <div className="flex items-center gap-2"><Paperclip className="h-4 w-4 text-muted-foreground" /> {f}</div>
                      <Button size="sm" variant="ghost">Download</Button>
                    </li>
                  ))}
                </ul>
              </Card>
            </TabsContent>

            <TabsContent value="links">
              <Card className="p-5">
                <ul className="space-y-2">
                  {[
                    { label: "Jira Ticket BAJ-141", url: "#" },
                    { label: "Polarion Item", url: "#" },
                    { label: "Design Document", url: "#" },
                  ].map((l) => (
                    <li key={l.label} className="flex items-center justify-between text-sm border-b pb-2">
                      <a className="text-primary hover:underline inline-flex items-center gap-1"><ExternalLink className="h-3.5 w-3.5" /> {l.label}</a>
                    </li>
                  ))}
                </ul>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-3">Test Execution</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Run time</span><span>00:04:21</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Last execution</span><span>2026-06-22</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><StatusBadge value="Passed" /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Executions</span><span>14</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Pass rate</span><span className="text-success font-semibold">92%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Fail rate</span><span className="text-destructive font-semibold">8%</span></div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-3">Compliance Mapping</h3>
            <ul className="space-y-1.5 text-sm">
              {req.compliance.map((c) => <li key={c} className="flex items-center justify-between"><span>{c}</span><StatusBadge value="Approved" /></li>)}
              {req.compliance.length === 0 && <li className="text-muted-foreground text-sm">None mapped</li>}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
