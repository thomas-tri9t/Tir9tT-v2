import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronRight, ChevronDown, FileText, FlaskConical, Folder, FolderOpen,
  Upload, Search, Plus, X, FileType2, History, Link2, Shield, ArrowUpRight,
  Sparkles, Check, ListChecks, CheckCircle2, Pencil, Trash2, Eye,
  CircleDashed, BadgeCheck, ArrowLeft, Loader2, FileCheck2,
} from "lucide-react";
import { ContextHeader } from "@/components/workspace-shell";
import { StatusBadge } from "@/components/status-badge";
import { WorkspaceDetailPanel } from "@/components/workspace-detail-panel";
import { RequirementCompactView } from "@/components/requirement-compact-view";
import { TestCaseCompactView } from "@/components/test-case-compact-view";
import { projects, requirements, reqDocuments, reqCategories, type Requirement, type ReqDocument, type GeneratedTestCase } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/workspace/$projectId")({
  head: ({ params }) => ({ meta: [{ title: `Workspace — ${params.projectId}` }] }),
  loader: ({ params }) => {
    const project = projects.find((p) => p.id === params.projectId);
    if (!project) throw notFound();
    return { project };
  },
  component: WorkspacePage,
});

/* ─────────────────────────── Types ─────────────────────────── */

type TCStatus = "Draft" | "Approved";

type Selection =
  | { kind: "category"; category: string }
  | { kind: "document"; documentId: string }
  | { kind: "requirement"; reqId: string }
  | { kind: "tests-root" }
  | { kind: "tests-group"; group: TCStatus }
  | { kind: "testcase"; tcId: string }
  | { kind: "pdf"; documentId: string }
  | { kind: "generate" };

/* ─────────────────────────── Seed data ─────────────────────────── */

const seedTests: GeneratedTestCase[] = [
  {
    id: "GTC-001", title: "Verify successful biometric login",
    description: "Validate that an enrolled user authenticates via fingerprint within tolerance.",
    sourceReqIds: ["SR-001", "SR-002"], sourceDocId: "DOC-SRD-1",
    priority: "High", type: "Functional", createdAt: "2026-06-22", status: "Approved",
    steps: [
      { step: "Navigate to login screen on supported device.", expected: "Biometric prompt displayed." },
      { step: "Place enrolled finger on sensor.", expected: "Capture completes within 1.2s at 500dpi." },
      { step: "Verify authentication outcome.", expected: "User is logged in and routed to dashboard." },
    ],
  },
  {
    id: "GTC-002", title: "Reject transfer above daily limit",
    description: "Ensure transfer validation rejects amounts exceeding the configured daily limit.",
    sourceReqIds: ["FR-002"], sourceDocId: "DOC-FRS-1",
    priority: "High", type: "Negative", createdAt: "2026-06-23", status: "Draft",
    steps: [
      { step: "Initiate a transfer 1 unit above the daily limit.", expected: "Validation triggered." },
      { step: "Submit the transfer.", expected: "Transfer blocked with limit-exceeded error." },
    ],
  },
];

/* ─────────────────────────── Page ─────────────────────────── */

function WorkspacePage() {
  const { project } = Route.useLoaderData();
  const { projectId } = Route.useParams();
  const navigate = useNavigate();
  const [selection, setSelection] = useState<Selection>({ kind: "category", category: reqCategories[0] });
  const [panelOpen, setPanelOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set([...reqCategories, "tests-root", "tests-Draft", "tests-Approved"])
  );
  const [uploadOpen, setUploadOpen] = useState(false);
  const [testCases, setTestCases] = useState<GeneratedTestCase[]>(seedTests);

  // Generation workflow state (drives the dedicated generation page)
  const [genSeedReqIds, setGenSeedReqIds] = useState<string[]>([]);

  const toggle = (key: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const isPanelVisible = (s: Selection) => {
    return s.kind === "requirement" || s.kind === "testcase";
  };

  const openPanel = (s: Selection) => {
    setSelection(s);
    if (isPanelVisible(s)) {
      setPanelOpen(true);
    }
  };

  const closePanel = () => {
    setPanelOpen(false);
  };

  /* Initial requirement context for generation */
  const seedForCurrent = (): string[] => {
    if (selection.kind === "requirement") return [selection.reqId];
    if (selection.kind === "document") return requirements.filter(r => r.documentId === selection.documentId).map(r => r.id);
    if (selection.kind === "category") {
      const docs = reqDocuments.filter(d => d.category === selection.category).map(d => d.id);
      return requirements.filter(r => docs.includes(r.documentId ?? "")).map(r => r.id);
    }
    return requirements.map(r => r.id);
  };

  const openGenerate = (seed?: string[]) => {
    setGenSeedReqIds(seed ?? seedForCurrent());
    setSelection({ kind: "generate" });
  };

  const handleGenerated = (newCases: GeneratedTestCase[]) => {
    setTestCases(prev => [...newCases, ...prev]);
  };

  const updateTestCase = (id: string, patch: Partial<GeneratedTestCase>) => {
    setTestCases(prev => prev.map(t => (t.id === id ? { ...t, ...patch } : t)));
  };

  const drafts = testCases.filter(t => t.status === "Draft");
  const approved = testCases.filter(t => t.status === "Approved");

  return (
    <div className="min-h-screen flex flex-col">
      <ContextHeader
        eyebrow={<Link to="/workspace" className="hover:text-primary">Workspace</Link>}
        title={<span className="flex items-center gap-3">{project.name}<StatusBadge value={project.health} /></span>}
        meta={
          <span className="flex items-center gap-2 text-[12px]">
            <span className="font-mono text-[10px]">{project.id}</span>
            <span>·</span><span>{project.owner}</span>
            <span>·</span><span>{project.progress}% complete</span>
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search project files…"
                className="h-8 w-64 pl-8 pr-3 rounded-md border bg-card text-[12px] focus:outline-none focus:ring-2 focus:ring-primary/25"
              />
            </div>
            <button
              onClick={() => setUploadOpen(true)}
              className="h-8 px-3 rounded-md border bg-card text-[12px] font-medium inline-flex items-center gap-1.5 hover:bg-muted"
            >
              <Upload className="h-3.5 w-3.5" /> Upload
            </button>
          </div>
        }
      />

      <div className="flex-1 flex min-h-0">
        {/* ─── Unified Project Files Sidebar ─── */}
        <aside className="w-72 shrink-0 border-r bg-card flex flex-col">
          <div className="px-3 h-10 flex items-center justify-between border-b">
            <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-semibold">Project Files</div>
            <div className="flex items-center gap-0.5">
              <button onClick={() => setUploadOpen(true)} title="Upload document" className="h-6 w-6 grid place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground">
                <Plus className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => openGenerate()} title="Generate test cases" className="h-6 w-6 grid place-items-center rounded text-primary hover:bg-accent">
                <Sparkles className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-2 text-[13px]">
            {/* ── Requirements branch ── */}
            {reqCategories.map(cat => {
              const docs = reqDocuments.filter(d => d.category === cat);
              const isOpen = expanded.has(cat);
              const isSelected = selection.kind === "category" && selection.category === cat;
              return (
                <div key={cat}>
                  <TreeRow
                    depth={0}
                    selected={isSelected}
                    onClick={() => { toggle(cat); setSelection({ kind: "category", category: cat }); }}
                    icon={isOpen ? <FolderOpen className="h-3.5 w-3.5 text-primary" /> : <Folder className="h-3.5 w-3.5 text-muted-foreground" />}
                    chevron={isOpen ? "down" : "right"}
                    label={<span className="font-medium truncate">{cat}s</span>}
                    badge={docs.length}
                  />
                  {isOpen && docs.map(doc => {
                    const reqs = requirements.filter(r => r.documentId === doc.id);
                    const docOpen = expanded.has(doc.id);
                    const docSelected = selection.kind === "document" && selection.documentId === doc.id;
                    return (
                      <div key={doc.id}>
                        <TreeRow
                          depth={1}
                          selected={docSelected}
                          onClick={() => { toggle(doc.id); setSelection({ kind: "document", documentId: doc.id }); }}
                          icon={<FileType2 className="h-3.5 w-3.5 text-muted-foreground" />}
                          chevron={docOpen ? "down" : "right"}
                          label={<span className="truncate text-[12.5px]">{doc.name}</span>}
                          badge={reqs.length}
                        />
                        {docOpen && reqs
                          .filter(r => !query || r.id.toLowerCase().includes(query.toLowerCase()) || r.name.toLowerCase().includes(query.toLowerCase()))
                          .map(r => {
                            const sel = selection.kind === "requirement" && selection.reqId === r.id;
                            return (
                              <TreeRow
                                key={r.id}
                                depth={2}
                                selected={sel}
                                onClick={() => openPanel({ kind: "requirement", reqId: r.id })}
                                label={
                                  <span className="flex items-center gap-2 min-w-0">
                                    <span className="font-mono text-[10px] text-muted-foreground w-14 shrink-0">{r.id}</span>
                                    <span className="flex-1 truncate text-[12px]">{r.name}</span>
                                  </span>
                                }
                              />
                            );
                          })}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* divider */}
            <div className="my-2 mx-3 border-t border-border/70" />

            {/* ── Test Cases branch ── */}
            <TreeRow
              depth={0}
              selected={selection.kind === "tests-root"}
              onClick={() => { toggle("tests-root"); setSelection({ kind: "tests-root" }); }}
              icon={expanded.has("tests-root")
                ? <FolderOpen className="h-3.5 w-3.5 text-primary" />
                : <Folder className="h-3.5 w-3.5 text-muted-foreground" />}
              chevron={expanded.has("tests-root") ? "down" : "right"}
              label={<span className="font-medium truncate">Test Cases</span>}
              badge={testCases.length}
            />
            {expanded.has("tests-root") && (["Draft", "Approved"] as TCStatus[]).map(group => {
              const list = group === "Draft" ? drafts : approved;
              const key = `tests-${group}`;
              const open = expanded.has(key);
              const sel = selection.kind === "tests-group" && selection.group === group;
              return (
                <div key={group}>
                  <TreeRow
                    depth={1}
                    selected={sel}
                    onClick={() => { toggle(key); setSelection({ kind: "tests-group", group }); }}
                    icon={group === "Draft"
                      ? <CircleDashed className="h-3.5 w-3.5 text-muted-foreground" />
                      : <BadgeCheck className="h-3.5 w-3.5 text-primary" />}
                    chevron={open ? "down" : "right"}
                    label={<span className="truncate text-[12.5px]">{group}{group === "Draft" ? "s" : ""}</span>}
                    badge={list.length}
                  />
                  {open && list
                    .filter(tc => !query || tc.id.toLowerCase().includes(query.toLowerCase()) || tc.title.toLowerCase().includes(query.toLowerCase()))
                    .map(tc => {
                      const isSel = selection.kind === "testcase" && selection.tcId === tc.id;
                      return (
                        <TreeRow
                        key={tc.id}
                        depth={2}
                        selected={isSel}
                        onClick={() => openPanel({ kind: "testcase", tcId: tc.id })}
                        label={
                          <span className="flex items-center gap-2 min-w-0">
                            <FlaskConical className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span className="font-mono text-[10px] text-muted-foreground w-14 shrink-0">{tc.id}</span>
                            <span className="flex-1 truncate text-[12px]">{tc.title}</span>
                          </span>
                        }
                      />
                      );
                    })}
                </div>
              );
            })}
            {testCases.length === 0 && (
              <div className="px-3 py-2 text-[11px] text-muted-foreground">No test cases yet.</div>
            )}
          </div>
        </aside>

        {/* ─── Canvas ─── */}
        <section className={cn("flex-1 min-w-0 canvas-grid", panelOpen && "overflow-hidden")}>
          <div className="max-w-5xl mx-auto p-6">
            {!panelOpen && selection.kind === "category" && (
              <CategoryOverview
                category={selection.category}
                onSelectDoc={(id) => setSelection({ kind: "document", documentId: id })}
                onUpload={() => setUploadOpen(true)}
                onGenerate={() => openGenerate()}
              />
            )}
            {!panelOpen && selection.kind === "document" && (
              <DocumentOverview
                doc={reqDocuments.find(d => d.id === selection.documentId)!}
                onSelectReq={(id) => setSelection({ kind: "requirement", reqId: id })}
                onGenerate={() => openGenerate()}
                onViewFile={() => setSelection({ kind: "pdf", documentId: selection.documentId })}
              />
            )}
            {!panelOpen && selection.kind === "pdf" && (
              <PdfViewer
                doc={reqDocuments.find(d => d.id === selection.documentId)!}
                onBack={() => setSelection({ kind: "document", documentId: selection.documentId })}
              />
            )}
            {selection.kind === "requirement" && (
              <RequirementDetail
                req={requirements.find(r => r.id === selection.reqId)!}
                onGenerate={() => openGenerate([selection.reqId])}
                onOpenTest={(id) => setSelection({ kind: "testcase", tcId: id })}
                allTestCases={testCases}
              />
            )}
            {!panelOpen && selection.kind === "tests-root" && (
              <TestsOverview
                testCases={testCases}
                onSelect={(id) => setSelection({ kind: "testcase", tcId: id })}
                onGenerate={() => openGenerate()}
                filter="all"
              />
            )}
            {!panelOpen && selection.kind === "tests-group" && (
              <TestsOverview
                testCases={testCases}
                onSelect={(id) => setSelection({ kind: "testcase", tcId: id })}
                onGenerate={() => openGenerate()}
                filter={selection.group}
              />
            )}
            {selection.kind === "testcase" && (
              <TestCaseDetail
                tc={testCases.find(t => t.id === selection.tcId)!}
                onSelectReq={(id) => setSelection({ kind: "requirement", reqId: id })}
                onUpdate={(patch) => updateTestCase(selection.tcId, patch)}
              />
            )}
            {!panelOpen && selection.kind === "generate" && (
              <GenerationWorkspace
                seedReqIds={genSeedReqIds}
                existingCount={testCases.length}
                onClose={() => setSelection({ kind: "tests-root" })}
                onCompleted={(cases) => {
                  handleGenerated(cases);
                  setSelection({ kind: "tests-group", group: "Draft" });
                }}
                onOpenTest={(id) => setSelection({ kind: "testcase", tcId: id })}
              />
            )}
          </div>
        </section>
      </div>

      {/* Compact detail panels */}
      {selection.kind === "requirement" && (
        <WorkspaceDetailPanel
          isOpen={panelOpen}
          onClose={closePanel}
          onOpenFullView={() => {
            // Navigate to full requirement page
            navigate({ to: "/requirements/$reqId", params: { reqId: selection.reqId } });
          }}
          title={`Requirement ${selection.reqId}`}
          className="p-4"
        >
          <RequirementCompactView
            req={requirements.find(r => r.id === selection.reqId)!}
            onOpenTest={(id) => openPanel({ kind: "testcase", tcId: id })}
            onOpenFullView={() => {
              navigate({ to: "/requirements/$reqId", params: { reqId: selection.reqId } });
            }}
            allTestCases={testCases}
          />
        </WorkspaceDetailPanel>
      )}

      {selection.kind === "testcase" && (
        <WorkspaceDetailPanel
          isOpen={panelOpen}
          onClose={closePanel}
          onOpenFullView={() => {
            // Navigate to full test case detail page
            navigate({
              to: "/workspace/$projectId/testcases/$testcaseId",
              params: { projectId, testcaseId: selection.tcId },
            });
          }}
          title={`Test Case ${selection.tcId}`}
          className="p-4"
        >
          <TestCaseCompactView
            tc={testCases.find(t => t.id === selection.tcId)!}
            onSelectReq={(id) => openPanel({ kind: "requirement", reqId: id })}
            onOpenFullView={() => {
              navigate({
                to: "/workspace/$projectId/testcases/$testcaseId",
                params: { projectId, testcaseId: selection.tcId },
              });
            }}
          />
        </WorkspaceDetailPanel>
      )}

      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
    </div>
  );
}

/* ─────────────────────────── Tree row ─────────────────────────── */

function TreeRow({
  depth, selected, onClick, icon, chevron, label, badge,
}: {
  depth: number;
  selected?: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  chevron?: "down" | "right" | null;
  label: React.ReactNode;
  badge?: number;
}) {
  const padLeft = 10 + depth * 14;
  return (
    <button
      onClick={onClick}
      style={{ paddingLeft: padLeft }}
      className={cn(
        "w-full flex items-center gap-1.5 pr-2.5 py-1.5 text-left rounded-md mx-1",
        selected ? "bg-accent text-primary" : "hover:bg-muted text-foreground"
      )}
    >
      {chevron === "down" && <ChevronDown className="h-3 w-3 text-muted-foreground" />}
      {chevron === "right" && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
      {chevron === undefined && <span className="w-3" />}
      {icon}
      <span className="flex-1 min-w-0">{label}</span>
      {badge !== undefined && <span className="text-[10px] text-muted-foreground font-mono">{badge}</span>}
    </button>
  );
}

/* ─────────────────────────── Shared UI ─────────────────────────── */

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-border bg-card", className)}>{children}</div>;
}
function SoftCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-border bg-secondary/60", className)}>{children}</div>;
}
function PrimaryBtn({ onClick, children, disabled }: { onClick?: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      onClick={onClick} disabled={disabled}
      className="h-9 px-3.5 rounded-md bg-primary text-primary-foreground text-[12.5px] font-medium inline-flex items-center gap-1.5 hover:bg-primary/90 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >{children}</button>
  );
}
function SecondaryBtn({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="h-9 px-3.5 rounded-md border bg-card text-[12.5px] font-medium inline-flex items-center gap-1.5 hover:bg-muted"
    >{children}</button>
  );
}
function Metric({ label, value, tone }: { label: string; value: number; tone?: "success" | "warning" }) {
  return (
    <SoftCard className="p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
      <div className={cn("mt-1 text-[22px] font-semibold tracking-[-0.02em]", tone === "success" && "text-primary", tone === "warning" && "text-[hsl(38_92%_42%)]")}>{value}</div>
    </SoftCard>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">{label}</div>
      <div className="text-[13px]">{children}</div>
    </div>
  );
}

/* ─────────────────────────── Category Overview ─────────────────────────── */

function CategoryOverview({ category, onSelectDoc, onUpload, onGenerate }: {
  category: string; onSelectDoc: (id: string) => void; onUpload: () => void; onGenerate: () => void;
}) {
  const docs = reqDocuments.filter(d => d.category === category);
  const reqs = requirements.filter(r => docs.some(d => d.id === r.documentId));
  const approved = reqs.filter(r => r.status === "Approved").length;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-semibold mb-1">Category</div>
          <h1>{category}s</h1>
          <p className="text-muted-foreground text-[13px] mt-1">
            {docs.length} document{docs.length !== 1 && "s"} · {reqs.length} requirements · {approved} approved
          </p>
        </div>
        {reqs.length > 0 && (
          <PrimaryBtn onClick={onGenerate}><Sparkles className="h-3.5 w-3.5" /> Generate Test Cases</PrimaryBtn>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Metric label="Documents" value={docs.length} />
        <Metric label="Requirements" value={reqs.length} />
        <Metric label="Approved" value={approved} tone="success" />
        <Metric label="Under Review" value={reqs.filter(r => r.status === "Under Review").length} tone="warning" />
      </div>

      <Card>
        <div className="px-4 h-10 flex items-center justify-between border-b">
          <h2>Documents</h2>
          <button onClick={onUpload} className="h-7 px-2.5 rounded-md text-[12px] font-medium inline-flex items-center gap-1.5 text-primary hover:bg-accent">
            <Upload className="h-3.5 w-3.5" /> Upload
          </button>
        </div>
        {docs.length === 0 ? (
          <div className="p-10 text-center">
            <FileType2 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-[13px] text-muted-foreground">No documents in this category yet.</p>
            <button onClick={onUpload} className="mt-3 h-8 px-3 rounded-md bg-primary text-primary-foreground text-[12px] font-medium inline-flex items-center gap-1.5">
              <Upload className="h-3.5 w-3.5" /> Upload first document
            </button>
          </div>
        ) : docs.map(d => {
          const dReqs = requirements.filter(r => r.documentId === d.id);
          return (
            <button key={d.id} onClick={() => onSelectDoc(d.id)} className="w-full px-4 py-3 flex items-center gap-3 border-b last:border-b-0 hover:bg-muted/50 text-left">
              <FileType2 className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold truncate">{d.name}</div>
                <div className="text-[11px] text-muted-foreground">{d.pages} pages · uploaded by {d.uploadedBy} · {d.uploadedAt}</div>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">{dReqs.length} reqs</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          );
        })}
      </Card>
    </div>
  );
}

/* ─────────────────────────── Document Overview ─────────────────────────── */

function DocumentOverview({ doc, onSelectReq, onGenerate, onViewFile }: {
  doc: ReqDocument; onSelectReq: (id: string) => void; onGenerate: () => void; onViewFile: () => void;
}) {
  const reqs = requirements.filter(r => r.documentId === doc.id);
  const dist = {
    Approved: reqs.filter(r => r.status === "Approved").length,
    "Under Review": reqs.filter(r => r.status === "Under Review").length,
    Draft: reqs.filter(r => r.status === "Draft").length,
  };
  const linkedTests = reqs.flatMap(r => r.testCases).length;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-semibold mb-1">{doc.category}</div>
          <h1 className="flex items-center gap-2"><FileType2 className="h-5 w-5 text-primary" />{doc.name}</h1>
          <p className="text-muted-foreground text-[13px] mt-1">
            {doc.pages} pages · {(doc.sizeKb / 1024).toFixed(2)} MB · uploaded by {doc.uploadedBy} on {doc.uploadedAt}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SecondaryBtn onClick={onViewFile}><Eye className="h-3.5 w-3.5" /> View File</SecondaryBtn>
          <PrimaryBtn onClick={onGenerate}><Sparkles className="h-3.5 w-3.5" /> Generate Test Cases</PrimaryBtn>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Metric label="Requirements" value={reqs.length} />
        <Metric label="Approved" value={dist.Approved} tone="success" />
        <Metric label="Under Review" value={dist["Under Review"]} tone="warning" />
        <Metric label="Linked Tests" value={linkedTests} />
      </div>

      <Card>
        <div className="px-4 h-10 flex items-center border-b">
          <h2>Extracted Requirements</h2>
          <span className="ml-2 text-[11px] text-muted-foreground font-mono">{reqs.length}</span>
        </div>
        {reqs.map(r => (
          <button key={r.id} onClick={() => onSelectReq(r.id)} className="w-full px-4 py-2.5 flex items-center gap-3 border-b last:border-b-0 hover:bg-muted/50 text-left">
            <span className="font-mono text-[11px] text-muted-foreground w-16 shrink-0">{r.id}</span>
            <span className="flex-1 truncate text-[13px] font-medium">{r.name}</span>
            <StatusBadge value={r.priority} />
            <StatusBadge value={r.status} />
          </button>
        ))}
      </Card>
    </div>
  );
}

/* ─────────────────────────── PDF Viewer ─────────────────────────── */

function PdfViewer({ doc, onBack }: { doc: ReqDocument; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to document
        </button>
        <span className="text-[12px] text-muted-foreground">{doc.name} · {doc.pages} pages</span>
      </div>
      <Card className="overflow-hidden">
        <div className="px-4 h-10 flex items-center justify-between border-b bg-muted/40">
          <h2 className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> {doc.name}</h2>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <button className="h-6 px-2 rounded hover:bg-muted">Zoom −</button>
            <span className="font-mono">100%</span>
            <button className="h-6 px-2 rounded hover:bg-muted">Zoom +</button>
          </div>
        </div>
        <div className="bg-[hsl(220_14%_94%)] p-8 min-h-[640px] flex flex-col items-center gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-[min(700px,100%)] aspect-[1/1.3] bg-card shadow-sm border rounded-sm p-10 text-[12px] text-muted-foreground leading-relaxed">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">Page {i + 1} of {doc.pages}</div>
              <h3 className="text-foreground mb-2">{doc.name.replace(".pdf", "")} — Section {i + 1}</h3>
              <p>This is a representative preview of the source PDF. In production this surface renders the actual document using a PDF rendering pipeline, enabling inline highlighting, requirement-to-source linking, and citation navigation back to the extracted requirement list.</p>
              <p className="mt-2">The full content of <span className="font-mono text-foreground">{doc.name}</span> can be reviewed without leaving the workspace.</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────────── Requirement Detail ─────────────────────────── */

function RequirementDetail({ req, onGenerate, onOpenTest, allTestCases }: {
  req: Requirement; onGenerate: () => void; onOpenTest: (id: string) => void; allTestCases: GeneratedTestCase[];
}) {
  const tabs = ["Overview", "Relations", "Test Cases", "Coverage", "History"] as const;
  const [tab, setTab] = useState<typeof tabs[number]>("Overview");
  const doc = reqDocuments.find(d => d.id === req.documentId);
  const upstream = req.parent ? requirements.find(r => r.id === req.parent) : null;
  const downstream = requirements.filter(r => r.parent === req.id);
  const linkedGenerated = allTestCases.filter(tc => tc.sourceReqIds.includes(req.id));

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-semibold mb-1 flex items-center gap-2">
            <span className="font-mono">{req.id}</span><span>·</span><span>{req.levelName}</span>
            {doc && <><span>·</span><span>{doc.name}</span></>}
          </div>
          <h1>{req.name}</h1>
          <div className="mt-2 flex items-center gap-1.5">
            <StatusBadge value={req.status} />
            <StatusBadge value={req.priority} />
            <span className="text-[12px] text-muted-foreground ml-2">Owner: {req.owner ?? "—"}</span>
          </div>
        </div>
        <PrimaryBtn onClick={onGenerate}><Sparkles className="h-3.5 w-3.5" /> Generate Test Cases</PrimaryBtn>
      </div>

      <div className="border-b flex gap-1">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("relative h-9 px-3 text-[12px] font-medium",
              tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
            {t}
            {tab === t && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="grid grid-cols-3 gap-3">
          <SoftCard className="p-4 col-span-2 space-y-3">
            <Field label="Description"><p className="text-[13px] leading-relaxed">{req.description ?? "—"}</p></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Group">{req.group}</Field>
              <Field label="Level">{req.levelName}</Field>
              <Field label="Approval Status"><StatusBadge value={req.status} /></Field>
              <Field label="Priority"><StatusBadge value={req.priority} /></Field>
            </div>
          </SoftCard>
          <SoftCard className="p-4 space-y-3">
            <Field label="Source Document">{doc?.name ?? "—"}</Field>
            <Field label="Created">{req.createdAt ?? "—"}</Field>
            <Field label="Owner">{req.owner ?? "—"}</Field>
            <Field label="Compliance">
              <div className="flex flex-wrap gap-1 mt-1">
                {req.compliance.length === 0 && <span className="text-[12px] text-muted-foreground">None</span>}
                {req.compliance.map(c => <span key={c} className="text-[11px] px-1.5 py-0.5 rounded border bg-card">{c}</span>)}
              </div>
            </Field>
          </SoftCard>
        </div>
      )}

      {tab === "Relations" && (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="mb-2 flex items-center gap-1.5"><Link2 className="h-3.5 w-3.5 text-primary" />Upstream</h3>
            {upstream ? (
              <div className="flex items-center gap-2 text-[13px]">
                <span className="font-mono text-[11px] text-muted-foreground">{upstream.id}</span>
                <span className="font-medium">{upstream.name}</span>
                <StatusBadge value={upstream.status} />
              </div>
            ) : <span className="text-[12px] text-muted-foreground">No upstream requirement.</span>}
          </Card>
          <Card className="p-4">
            <h3 className="mb-2 flex items-center gap-1.5"><Link2 className="h-3.5 w-3.5 text-primary rotate-180" />Downstream</h3>
            {downstream.length === 0 ? <span className="text-[12px] text-muted-foreground">No downstream requirements.</span> :
              downstream.map(d => (
                <div key={d.id} className="flex items-center gap-2 text-[13px] py-1">
                  <span className="font-mono text-[11px] text-muted-foreground w-14">{d.id}</span>
                  <span className="flex-1">{d.name}</span>
                  <StatusBadge value={d.status} />
                </div>
              ))
            }
          </Card>
          <Card className="p-4">
            <h3 className="mb-2 flex items-center gap-1.5"><FlaskConical className="h-3.5 w-3.5 text-primary" />Linked Test Cases</h3>
            {linkedGenerated.length === 0 && req.testCases.length === 0
              ? <span className="text-[12px] text-muted-foreground">None</span>
              : (
                <>
                  {linkedGenerated.map(tc => (
                    <button key={tc.id} onClick={() => onOpenTest(tc.id)} className="w-full flex items-center gap-2 text-[13px] py-1 text-left hover:text-primary">
                      <span className="font-mono text-[11px] text-muted-foreground">{tc.id}</span>
                      <span className="flex-1 truncate">{tc.title}</span>
                      <StatusBadge value={tc.status} />
                    </button>
                  ))}
                  {req.testCases.map(tc => (
                    <div key={tc} className="flex items-center gap-2 text-[13px] py-1">
                      <span className="font-mono text-[11px] text-muted-foreground">{tc}</span>
                      <span className="flex-1">Test scenario for {req.name}</span>
                      <StatusBadge value="Passed" />
                    </div>
                  ))}
                </>
              )}
          </Card>
        </div>
      )}

      {tab === "Test Cases" && (
        <Card>
          {linkedGenerated.length === 0 && req.testCases.length === 0 ? (
            <div className="p-8 text-center">
              <FlaskConical className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-[13px] text-muted-foreground mb-3">No test cases yet for this requirement.</p>
              <PrimaryBtn onClick={onGenerate}><Sparkles className="h-3.5 w-3.5" /> Generate with AI</PrimaryBtn>
            </div>
          ) : (
            <>
              {linkedGenerated.map(tc => (
                <button key={tc.id} onClick={() => onOpenTest(tc.id)} className="w-full px-4 py-2.5 flex items-center gap-3 border-b last:border-b-0 hover:bg-muted/50 text-left">
                  <FlaskConical className="h-4 w-4 text-primary" />
                  <span className="font-mono text-[11px] text-muted-foreground w-20">{tc.id}</span>
                  <span className="flex-1 text-[13px] truncate">{tc.title}</span>
                  <StatusBadge value={tc.status} />
                </button>
              ))}
              {req.testCases.map(tc => (
                <div key={tc} className="px-4 py-2.5 flex items-center gap-3 border-b last:border-b-0">
                  <FlaskConical className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-[11px] text-muted-foreground w-20">{tc}</span>
                  <span className="flex-1 text-[13px]">Test for {req.name}</span>
                  <StatusBadge value="Passed" />
                </div>
              ))}
            </>
          )}
        </Card>
      )}

      {tab === "Coverage" && (
        <div className="grid grid-cols-2 gap-3">
          {["FDA 21 CFR Part 820", "ISO 13485", "IEC 62304", "ISO 14971"].map(f => {
            const mapped = req.compliance.includes(f);
            return (
              <SoftCard key={f} className={cn("p-3 flex items-center gap-2", mapped && "border-primary/30")}>
                <Shield className={cn("h-4 w-4", mapped ? "text-primary" : "text-muted-foreground")} />
                <span className="text-[13px] font-medium flex-1">{f}</span>
                <span className={cn("text-[10px] uppercase font-semibold tracking-wider", mapped ? "text-primary" : "text-muted-foreground")}>{mapped ? "Mapped" : "Not mapped"}</span>
              </SoftCard>
            );
          })}
        </div>
      )}

      {tab === "History" && (
        <Card className="overflow-hidden">
          <div className="px-3 py-2 bg-muted text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <History className="h-3 w-3" /> Version 3 → Version 4
          </div>
          <div className="grid grid-cols-2 divide-x text-[12px]">
            <div className="p-3">
              <div className="font-mono text-[10px] text-muted-foreground mb-1">v3</div>
              <p>The system <span className="bg-destructive/15 text-destructive line-through">shall allow</span> users to authenticate.</p>
            </div>
            <div className="p-3">
              <div className="font-mono text-[10px] text-muted-foreground mb-1">v4</div>
              <p>The system <span className="bg-primary/15 text-primary font-medium">must enable</span> users to authenticate.</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ─────────────────────────── Tests Overview ─────────────────────────── */

function TestsOverview({ testCases, onSelect, onGenerate, filter }: {
  testCases: GeneratedTestCase[]; onSelect: (id: string) => void; onGenerate: () => void; filter: "all" | TCStatus;
}) {
  const list = filter === "all" ? testCases : testCases.filter(t => t.status === filter);
  const title = filter === "all" ? "All Test Cases" : filter === "Draft" ? "Draft Test Cases" : "Approved Test Cases";

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-semibold mb-1">Test Cases</div>
          <h1>{title}</h1>
          <p className="text-muted-foreground text-[13px] mt-1">
            {list.length} test case{list.length !== 1 && "s"}
            {filter !== "all" && ` in ${filter.toLowerCase()} state`}.
          </p>
        </div>
        <PrimaryBtn onClick={onGenerate}><Sparkles className="h-3.5 w-3.5" /> Generate Test Cases</PrimaryBtn>
      </div>

      <Card>
        <div className="px-4 h-10 flex items-center border-b text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
          <span className="w-20">ID</span>
          <span className="flex-1">Title</span>
          <span className="w-24">Type</span>
          <span className="w-20">Priority</span>
          <span className="w-20">Status</span>
          <span className="w-24">Source</span>
        </div>
        {list.length === 0 ? (
          <div className="p-10 text-center">
            <FlaskConical className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-[13px] text-muted-foreground mb-3">No test cases here yet.</p>
            <PrimaryBtn onClick={onGenerate}><Sparkles className="h-3.5 w-3.5" /> Generate Test Cases</PrimaryBtn>
          </div>
        ) : list.map(tc => (
          <button key={tc.id} onClick={() => onSelect(tc.id)} className="w-full px-4 py-2.5 flex items-center gap-2 border-b last:border-b-0 hover:bg-muted/50 text-left text-[13px]">
            <span className="font-mono text-[11px] text-muted-foreground w-20 shrink-0">{tc.id}</span>
            <span className="flex-1 truncate font-medium">{tc.title}</span>
            <span className="w-24 text-[11px] text-muted-foreground">{tc.type}</span>
            <span className="w-20"><StatusBadge value={tc.priority} /></span>
            <span className="w-20"><StatusBadge value={tc.status} /></span>
            <span className="w-24 font-mono text-[11px] text-muted-foreground truncate">{tc.sourceReqIds[0]}{tc.sourceReqIds.length > 1 && ` +${tc.sourceReqIds.length - 1}`}</span>
          </button>
        ))}
      </Card>
    </div>
  );
}

/* ─────────────────────────── Test Case Detail (editable) ─────────────────────────── */

function TestCaseDetail({ tc, onSelectReq, onUpdate }: {
  tc: GeneratedTestCase; onSelectReq: (id: string) => void; onUpdate: (patch: Partial<GeneratedTestCase>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<GeneratedTestCase>(tc);
  const [reqSearch, setReqSearch] = useState("");
  const [showReqPicker, setShowReqPicker] = useState(false);

  // Reset draft when test case changes (different selection)
  useEffect(() => { setDraft(tc); setEditing(false); }, [tc.id]);

  const doc = draft.sourceDocId ? reqDocuments.find(d => d.id === draft.sourceDocId) : null;

  const save = () => { onUpdate(draft); setEditing(false); };
  const cancel = () => { setDraft(tc); setEditing(false); };

  const updateStep = (i: number, key: "step" | "expected", value: string) => {
    setDraft(d => ({ ...d, steps: d.steps.map((s, idx) => idx === i ? { ...s, [key]: value } : s) }));
  };
  const addStep = () => setDraft(d => ({ ...d, steps: [...d.steps, { step: "", expected: "" }] }));
  const removeStep = (i: number) => setDraft(d => ({ ...d, steps: d.steps.filter((_, idx) => idx !== i) }));

  const addReq = (id: string) => {
    if (draft.sourceReqIds.includes(id)) return;
    setDraft(d => ({ ...d, sourceReqIds: [...d.sourceReqIds, id] }));
  };
  const removeReq = (id: string) => setDraft(d => ({ ...d, sourceReqIds: d.sourceReqIds.filter(x => x !== id) }));

  const reqPickerResults = requirements.filter(r =>
    !draft.sourceReqIds.includes(r.id) &&
    (!reqSearch || r.id.toLowerCase().includes(reqSearch.toLowerCase()) || r.name.toLowerCase().includes(reqSearch.toLowerCase()))
  ).slice(0, 8);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-semibold mb-1 flex items-center gap-2 flex-wrap">
            <span className="font-mono">{draft.id}</span>
            <span>·</span><span>{draft.type} Test</span>
            {doc && <><span>·</span><span>{doc.name}</span></>}
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-primary"><Sparkles className="h-3 w-3" /> AI-Generated</span>
          </div>
          {editing ? (
            <input
              value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
              className="w-full text-[20px] font-semibold tracking-[-0.015em] leading-tight bg-transparent border-b border-primary/30 focus:outline-none focus:border-primary py-0.5"
            />
          ) : <h1>{draft.title}</h1>}
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            <StatusBadge value={draft.priority} />
            <StatusBadge value={draft.status} />
            <span className="text-[12px] text-muted-foreground ml-2">Created {draft.createdAt}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {editing ? (
            <>
              <SecondaryBtn onClick={cancel}><X className="h-3.5 w-3.5" /> Cancel</SecondaryBtn>
              <PrimaryBtn onClick={save}><Check className="h-3.5 w-3.5" /> Save changes</PrimaryBtn>
            </>
          ) : (
            <>
              <SecondaryBtn onClick={() => setEditing(true)}><Pencil className="h-3.5 w-3.5" /> Edit</SecondaryBtn>
              {tc.status === "Draft" && (
                <PrimaryBtn onClick={() => onUpdate({ status: "Approved" })}>
                  <BadgeCheck className="h-3.5 w-3.5" /> Approve
                </PrimaryBtn>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <SoftCard className="p-4 col-span-2 space-y-3">
          <Field label="Description">
            {editing ? (
              <textarea
                value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
                rows={3}
                className="w-full bg-card border rounded-md p-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/25"
              />
            ) : <p className="text-[13px] leading-relaxed">{draft.description}</p>}
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Type">
              {editing ? (
                <select value={draft.type} onChange={e => setDraft(d => ({ ...d, type: e.target.value as GeneratedTestCase["type"] }))}
                  className="w-full h-8 border rounded-md bg-card text-[13px] px-2">
                  {(["Functional", "Integration", "Negative", "Boundary"] as const).map(t => <option key={t}>{t}</option>)}
                </select>
              ) : draft.type}
            </Field>
            <Field label="Priority">
              {editing ? (
                <select value={draft.priority} onChange={e => setDraft(d => ({ ...d, priority: e.target.value as GeneratedTestCase["priority"] }))}
                  className="w-full h-8 border rounded-md bg-card text-[13px] px-2">
                  {(["High", "Medium", "Low"] as const).map(t => <option key={t}>{t}</option>)}
                </select>
              ) : <StatusBadge value={draft.priority} />}
            </Field>
            <Field label="Status">
              {editing ? (
                <select value={draft.status} onChange={e => setDraft(d => ({ ...d, status: e.target.value as TCStatus }))}
                  className="w-full h-8 border rounded-md bg-card text-[13px] px-2">
                  {(["Draft", "Approved"] as const).map(t => <option key={t}>{t}</option>)}
                </select>
              ) : <StatusBadge value={draft.status} />}
            </Field>
          </div>
        </SoftCard>

        <SoftCard className="p-4 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Linked Requirements</div>
              {editing && (
                <button onClick={() => setShowReqPicker(v => !v)} className="text-[11px] text-primary hover:underline inline-flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Add
                </button>
              )}
            </div>
            <div className="space-y-1">
              {draft.sourceReqIds.map(rid => {
                const r = requirements.find(x => x.id === rid);
                return (
                  <div key={rid} className="flex items-center gap-2 text-[12.5px] bg-card border rounded-md px-2 py-1">
                    <span className="font-mono text-[11px] text-muted-foreground">{rid}</span>
                    <button onClick={() => onSelectReq(rid)} className="flex-1 truncate text-left hover:text-primary">{r?.name ?? "—"}</button>
                    {editing && (
                      <button onClick={() => removeReq(rid)} className="text-muted-foreground hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                );
              })}
              {draft.sourceReqIds.length === 0 && <p className="text-[12px] text-muted-foreground">No requirements linked.</p>}
            </div>
            {editing && showReqPicker && (
              <div className="mt-2 border rounded-md bg-card">
                <div className="p-1.5 border-b">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <input
                      autoFocus value={reqSearch} onChange={e => setReqSearch(e.target.value)}
                      placeholder="Search requirements…"
                      className="w-full h-7 pl-7 pr-2 text-[12px] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {reqPickerResults.length === 0 ? (
                    <p className="px-3 py-2 text-[11px] text-muted-foreground">No matches</p>
                  ) : reqPickerResults.map(r => (
                    <button key={r.id} onClick={() => { addReq(r.id); setReqSearch(""); }} className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-muted text-left text-[12px]">
                      <span className="font-mono text-[10px] text-muted-foreground w-14">{r.id}</span>
                      <span className="flex-1 truncate">{r.name}</span>
                      <Plus className="h-3 w-3 text-primary" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SoftCard>
      </div>

      <Card>
        <div className="px-4 h-10 flex items-center border-b">
          <h2 className="flex items-center gap-1.5"><ListChecks className="h-4 w-4 text-primary" /> Test Steps</h2>
          <span className="ml-2 text-[11px] text-muted-foreground font-mono">{draft.steps.length}</span>
          {editing && (
            <button onClick={addStep} className="ml-auto h-7 px-2.5 rounded-md text-[12px] font-medium inline-flex items-center gap-1.5 text-primary hover:bg-accent">
              <Plus className="h-3.5 w-3.5" /> Add step
            </button>
          )}
        </div>
        <div className="divide-y">
          {draft.steps.map((s, i) => (
            <div key={i} className="px-4 py-3 grid grid-cols-[28px_1fr_1fr_24px] gap-3 text-[13px] items-start">
              <div className="font-mono text-[11px] text-muted-foreground pt-1">#{i + 1}</div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Action</div>
                {editing ? (
                  <textarea value={s.step} onChange={e => updateStep(i, "step", e.target.value)} rows={2}
                    className="w-full bg-card border rounded-md p-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/25" />
                ) : <div>{s.step}</div>}
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Expected Result</div>
                {editing ? (
                  <textarea value={s.expected} onChange={e => updateStep(i, "expected", e.target.value)} rows={2}
                    className="w-full bg-card border rounded-md p-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/25" />
                ) : <div>{s.expected}</div>}
              </div>
              {editing && (
                <button onClick={() => removeStep(i)} className="text-muted-foreground hover:text-destructive mt-1">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────────── Generation Workspace (dedicated page) ─────────────────────────── */

type GenPhase = "setup" | "running" | "review";

function GenerationWorkspace({ seedReqIds, existingCount, onClose, onCompleted, onOpenTest }: {
  seedReqIds: string[];
  existingCount: number;
  onClose: () => void;
  onCompleted: (cases: GeneratedTestCase[]) => void;
  onOpenTest: (id: string) => void;
}) {
  const [phase, setPhase] = useState<GenPhase>("setup");
  const [selected, setSelected] = useState<Set<string>>(new Set(seedReqIds));
  const [coverage, setCoverage] = useState<"standard" | "deep" | "negative">("standard");
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set(reqDocuments.map(d => d.id)));
  const [search, setSearch] = useState("");
  const [streamed, setStreamed] = useState<GeneratedTestCase[]>([]);
  const [progress, setProgress] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => { timersRef.current.forEach(clearTimeout); }, []);

  const toggleDoc = (id: string) => setExpandedDocs(p => {
    const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n;
  });
  const toggle = (id: string) => setSelected(p => {
    const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n;
  });
  const selectAll = () => setSelected(new Set(requirements.map(r => r.id)));
  const clearAll = () => setSelected(new Set());
  const toggleDocAll = (docId: string) => {
    const docReqs = requirements.filter(r => r.documentId === docId).map(r => r.id);
    const allIn = docReqs.every(id => selected.has(id));
    setSelected(p => {
      const n = new Set(p);
      docReqs.forEach(id => { allIn ? n.delete(id) : n.add(id); });
      return n;
    });
  };

  const startGeneration = () => {
    const ids = Array.from(selected);
    const limited = ids.slice(0, 6); // simulate per-req generation
    setPhase("running");
    setStreamed([]);
    setProgress(0);

    const total = limited.length;
    limited.forEach((rid, i) => {
      const t = setTimeout(() => {
        const req = requirements.find(r => r.id === rid)!;
        const nextNum = String(existingCount + i + 1).padStart(3, "0");
        const typeByCoverage = coverage === "negative" ? "Negative" : coverage === "deep" ? "Boundary" : "Functional";
        const tc: GeneratedTestCase = {
          id: `GTC-${nextNum}`,
          title: `Verify ${req.name.toLowerCase()}`,
          description: `AI-generated scenario validating ${req.name} against ${req.levelName.toLowerCase()} acceptance criteria.`,
          sourceReqIds: [rid],
          sourceDocId: req.documentId,
          priority: req.priority === "High" ? "High" : "Medium",
          type: typeByCoverage,
          createdAt: new Date().toISOString().slice(0, 10),
          status: "Draft",
          steps: [
            { step: `Set up preconditions for ${req.name}.`, expected: "Environment ready." },
            { step: `Execute the primary flow described in ${req.id}.`, expected: req.description ?? "Behaves as specified." },
            { step: "Verify outcome and persist evidence.", expected: "Outcome matches the requirement." },
          ],
        };
        setStreamed(prev => [...prev, tc]);
        setProgress(Math.round(((i + 1) / total) * 100));
        if (i === total - 1) {
          const done = setTimeout(() => setPhase("review"), 350);
          timersRef.current.push(done);
        }
      }, 700 + i * 850);
      timersRef.current.push(t);
    });
  };

  const acceptAll = () => { onCompleted(streamed); };
  const acceptOne = (id: string) => {
    const tc = streamed.find(t => t.id === id);
    if (!tc) return;
    onCompleted([tc]);
    setStreamed(prev => prev.filter(t => t.id !== id));
  };

  /* ── Setup phase ── */
  if (phase === "setup") {
    const docsFiltered = reqDocuments.map(doc => ({
      doc,
      reqs: requirements
        .filter(r => r.documentId === doc.id)
        .filter(r => !search || r.id.toLowerCase().includes(search.toLowerCase()) || r.name.toLowerCase().includes(search.toLowerCase())),
    })).filter(g => g.reqs.length > 0);

    return (
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <button onClick={onClose} className="inline-flex items-center gap-1.5 text-[11.5px] text-muted-foreground hover:text-foreground mb-1">
              <ArrowLeft className="h-3 w-3" /> Cancel
            </button>
            <h1 className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Generate Test Cases</h1>
            <p className="text-muted-foreground text-[13px] mt-1">
              AI will draft test cases from the selected requirements. Generated drafts stay in <span className="font-medium text-foreground">Draft</span> status until you approve them.
            </p>
          </div>
          <PrimaryBtn onClick={startGeneration} disabled={selected.size === 0}>
            <Sparkles className="h-3.5 w-3.5" /> Run generation ({selected.size})
          </PrimaryBtn>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Requirement picker */}
          <Card className="col-span-2 overflow-hidden">
            <div className="px-4 h-10 flex items-center gap-2 border-b">
              <h2>Source Requirements</h2>
              <span className="text-[11px] font-mono text-muted-foreground">{selected.size} selected</span>
              <div className="ml-auto flex items-center gap-1">
                <button onClick={selectAll} className="h-7 px-2 text-[11.5px] rounded hover:bg-muted text-primary font-medium">Select all</button>
                <button onClick={clearAll} className="h-7 px-2 text-[11.5px] rounded hover:bg-muted text-muted-foreground">Clear</button>
              </div>
            </div>
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search requirements…"
                  className="w-full h-8 pl-8 pr-3 rounded-md border bg-card text-[12px] focus:outline-none focus:ring-2 focus:ring-primary/25" />
              </div>
            </div>
            <div className="max-h-[420px] overflow-y-auto">
              {docsFiltered.map(({ doc, reqs }) => {
                const open = expandedDocs.has(doc.id);
                const docSelectedCount = reqs.filter(r => selected.has(r.id)).length;
                const allSelected = docSelectedCount === reqs.length && reqs.length > 0;
                return (
                  <div key={doc.id} className="border-b last:border-b-0">
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted/30">
                      <button onClick={() => toggleDoc(doc.id)} className="text-muted-foreground hover:text-foreground">
                        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      </button>
                      <FileType2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[12.5px] font-medium truncate">{doc.name}</div>
                        <div className="text-[10.5px] text-muted-foreground">{doc.category}</div>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">{docSelectedCount}/{reqs.length}</span>
                      <button onClick={() => toggleDocAll(doc.id)} className="h-6 px-2 text-[11px] rounded hover:bg-muted text-primary font-medium">
                        {allSelected ? "Unselect" : "Select all"}
                      </button>
                    </div>
                    {open && reqs.map(r => (
                      <label key={r.id} className="flex items-center gap-2 pl-10 pr-3 py-1.5 text-[12.5px] hover:bg-muted/40 cursor-pointer">
                        <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggle(r.id)} className="h-3.5 w-3.5 accent-primary" />
                        <span className="font-mono text-[10px] text-muted-foreground w-14 shrink-0">{r.id}</span>
                        <span className="flex-1 truncate">{r.name}</span>
                        <StatusBadge value={r.priority} />
                      </label>
                    ))}
                  </div>
                );
              })}
              {docsFiltered.length === 0 && (
                <p className="p-6 text-center text-[12px] text-muted-foreground">No requirements match.</p>
              )}
            </div>
          </Card>

          {/* Options */}
          <div className="space-y-3">
            <SoftCard className="p-4 space-y-3">
              <Field label="Generation Coverage">
                <div className="space-y-1.5 mt-1">
                  {([
                    { id: "standard", label: "Standard", desc: "Happy-path scenarios" },
                    { id: "deep", label: "Deep", desc: "Boundary & edge cases" },
                    { id: "negative", label: "Negative", desc: "Error & failure paths" },
                  ] as const).map(opt => (
                    <button key={opt.id} onClick={() => setCoverage(opt.id)}
                      className={cn("w-full rounded-md border p-2.5 text-left transition-colors",
                        coverage === opt.id ? "border-primary bg-accent/60" : "bg-card hover:bg-muted")}>
                      <div className="flex items-center gap-1.5 text-[12.5px] font-medium">
                        {coverage === opt.id && <Check className="h-3 w-3 text-primary" />}
                        {opt.label}
                      </div>
                      <div className="text-[10.5px] text-muted-foreground mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </Field>
            </SoftCard>

            <SoftCard className="p-4">
              <Field label="What happens next">
                <ol className="mt-1 space-y-1.5 text-[12px] text-muted-foreground list-decimal pl-4">
                  <li>AI streams draft test cases for each requirement.</li>
                  <li>You review, edit, and approve each draft.</li>
                  <li>Approved tests are added to the repository.</li>
                </ol>
              </Field>
            </SoftCard>
          </div>
        </div>
      </div>
    );
  }

  /* ── Running phase ── */
  if (phase === "running") {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="flex items-center gap-2"><Loader2 className="h-5 w-5 text-primary animate-spin" /> Generating test cases…</h1>
          <p className="text-muted-foreground text-[13px] mt-1">AI is drafting scenarios from {selected.size} requirement{selected.size !== 1 && "s"}. Results stream below as they complete.</p>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2 text-[12px]">
            <span className="font-medium">{streamed.length} of {Math.min(selected.size, 6)} drafted</span>
            <span className="font-mono text-muted-foreground">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </Card>

        <div className="space-y-2">
          {streamed.map(tc => <StreamedCard key={tc.id} tc={tc} />)}
          {/* Active skeleton */}
          {streamed.length < Math.min(selected.size, 6) && (
            <Card className="p-3 flex items-center gap-3 border-dashed">
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-1/3 bg-muted rounded animate-pulse" />
                <div className="h-2.5 w-2/3 bg-muted/60 rounded animate-pulse" />
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  /* ── Review phase ── */
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2"><FileCheck2 className="h-5 w-5 text-primary" /> Review generated test cases</h1>
          <p className="text-muted-foreground text-[13px] mt-1">
            {streamed.length} draft{streamed.length !== 1 && "s"} ready for review. Nothing has been added to the repository yet — approve each test individually, or accept all as drafts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SecondaryBtn onClick={onClose}><X className="h-3.5 w-3.5" /> Discard</SecondaryBtn>
          <PrimaryBtn onClick={acceptAll} disabled={streamed.length === 0}>
            <Check className="h-3.5 w-3.5" /> Accept all as drafts
          </PrimaryBtn>
        </div>
      </div>

      <div className="space-y-2">
        {streamed.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-[13px] text-muted-foreground">All drafts processed.</p>
          </Card>
        ) : streamed.map(tc => (
          <Card key={tc.id} className="p-4">
            <div className="flex items-start gap-3">
              <FlaskConical className="h-4 w-4 text-primary mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-muted-foreground">{tc.id}</span>
                  <span className="font-semibold text-[13.5px] truncate">{tc.title}</span>
                </div>
                <p className="text-[12.5px] text-muted-foreground mt-1 line-clamp-2">{tc.description}</p>
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <StatusBadge value={tc.priority} />
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground px-1.5 py-0.5 rounded border bg-secondary/60">{tc.type}</span>
                  <span className="text-[11px] text-muted-foreground">{tc.steps.length} steps · sources: {tc.sourceReqIds.join(", ")}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => { onCompleted([tc]); setStreamed(p => p.filter(t => t.id !== tc.id)); onOpenTest(tc.id); }}
                  className="h-7 px-2.5 rounded-md border bg-card text-[11.5px] font-medium hover:bg-muted inline-flex items-center gap-1">
                  <Pencil className="h-3 w-3" /> Review & edit
                </button>
                <button
                  onClick={() => acceptOne(tc.id)}
                  className="h-7 px-2.5 rounded-md bg-primary text-primary-foreground text-[11.5px] font-medium hover:bg-primary/90 inline-flex items-center gap-1">
                  <Check className="h-3 w-3" /> Accept draft
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StreamedCard({ tc }: { tc: GeneratedTestCase }) {
  return (
    <Card className="p-3 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-1 duration-300">
      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-muted-foreground">{tc.id}</span>
          <span className="font-medium text-[13px] truncate">{tc.title}</span>
        </div>
        <p className="text-[11.5px] text-muted-foreground mt-0.5">{tc.steps.length} steps · {tc.type} · sources {tc.sourceReqIds.join(", ")}</p>
      </div>
    </Card>
  );
}

/* ─────────────────────────── Upload Modal ─────────────────────────── */

function UploadModal({ onClose }: { onClose: () => void }) {
  const [category, setCategory] = useState<string>(reqCategories[0]);
  const [file, setFile] = useState<File | null>(null);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 backdrop-blur-sm" onClick={onClose}>
      <div className="w-[480px] rounded-xl border bg-card shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2>Upload Requirement Document</h2>
          <button onClick={onClose} className="h-7 w-7 grid place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Requirement Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="mt-1.5 w-full h-9 px-2.5 rounded-md border bg-card text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/25">
              {reqCategories.map(c => <option key={c} value={c}>{c}</option>)}
              <option value="custom">Custom Requirement Type…</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Document</label>
            <div className="mt-1.5 rounded-md border border-dashed bg-secondary/50 p-6 text-center">
              <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
              <div className="text-[12px] text-muted-foreground">{file ? file.name : "Drag a PDF / DOCX here, or click to browse"}</div>
              <input type="file" className="hidden" id="upl" onChange={e => setFile(e.target.files?.[0] ?? null)} />
              <label htmlFor="upl" className="mt-2 inline-block text-[12px] text-primary font-medium cursor-pointer">Browse files</label>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">After upload, the system will parse the document and extract requirements into the selected category folder.</p>
        </div>
        <div className="px-5 py-3 border-t flex items-center justify-end gap-2">
          <button onClick={onClose} className="h-8 px-3 rounded-md text-[12px] font-medium hover:bg-muted">Cancel</button>
          <button onClick={onClose} className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-[12px] font-medium hover:bg-primary/90 inline-flex items-center gap-1.5">
            <Upload className="h-3.5 w-3.5" /> Upload & Parse
          </button>
        </div>
      </div>
    </div>
  );
}
