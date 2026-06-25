import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft, Check, X, Pencil, BadgeCheck, Trash2, ListChecks,
  Plus, Search, FileType2,
} from "lucide-react";
import { ContextHeader } from "@/components/workspace-shell";
import { StatusBadge } from "@/components/status-badge";
import { requirements, reqDocuments, type Requirement } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/workspace/$projectId/testcases/$testcaseId")({
  head: () => ({ meta: [{ title: "Test Case — RequireQA" }] }),
  loader: ({ params }) => {
    // In a real app, fetch the test case from data
    return { projectId: params.projectId, testcaseId: params.testcaseId };
  },
  component: TestCaseDetailPage,
});

export type GeneratedTestCase = {
  id: string;
  title: string;
  description: string;
  sourceReqIds: string[];
  sourceDocId?: string;
  priority: "High" | "Medium" | "Low";
  type: "Functional" | "Integration" | "Negative" | "Boundary";
  steps: { step: string; expected: string }[];
  createdAt: string;
  status: "Draft" | "Approved";
};

// Mock test case - in production, fetch from route data
const mockTestCases: GeneratedTestCase[] = [
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

function TestCaseDetailPage() {
  const { projectId, testcaseId } = useParams({
    from: "/workspace/$projectId/testcases/$testcaseId",
  });

  const testCase = mockTestCases.find((tc) => tc.id === testcaseId);
  if (!testCase) throw notFound();

  const doc = testCase.sourceDocId
    ? reqDocuments.find((d) => d.id === testCase.sourceDocId)
    : null;
  const linkedReqs = requirements.filter((r) =>
    testCase.sourceReqIds.includes(r.id)
  );

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<GeneratedTestCase>(testCase);
  const [reqSearch, setReqSearch] = useState("");
  const [showReqPicker, setShowReqPicker] = useState(false);

  useEffect(() => {
    setDraft(testCase);
    setEditing(false);
  }, [testcaseId]);

  const save = () => {
    setEditing(false);
  };
  const cancel = () => {
    setDraft(testCase);
    setEditing(false);
  };

  const updateStep = (i: number, key: "step" | "expected", value: string) => {
    setDraft((d) => ({
      ...d,
      steps: d.steps.map((s, idx) =>
        idx === i ? { ...s, [key]: value } : s
      ),
    }));
  };
  const addStep = () =>
    setDraft((d) => ({ ...d, steps: [...d.steps, { step: "", expected: "" }] }));
  const removeStep = (i: number) =>
    setDraft((d) => ({ ...d, steps: d.steps.filter((_, idx) => idx !== i) }));

  const addReq = (id: string) => {
    if (draft.sourceReqIds.includes(id)) return;
    setDraft((d) => ({ ...d, sourceReqIds: [...d.sourceReqIds, id] }));
  };
  const removeReq = (id: string) =>
    setDraft((d) => ({
      ...d,
      sourceReqIds: d.sourceReqIds.filter((x) => x !== id),
    }));

  const reqPickerResults = requirements
    .filter(
      (r) =>
        !draft.sourceReqIds.includes(r.id) &&
        (!reqSearch ||
          r.id.toLowerCase().includes(reqSearch.toLowerCase()) ||
          r.name.toLowerCase().includes(reqSearch.toLowerCase()))
    )
    .slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col">
      <ContextHeader
        eyebrow={
          <Link
            to="/workspace/$projectId"
            params={{ projectId }}
            className="hover:text-primary"
          >
            Workspace
          </Link>
        }
        title={
          <span className="flex items-center gap-2">
            Test Case {draft.id}
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <button
                  onClick={cancel}
                  className="h-8 px-3 rounded-md border text-[12px] font-medium inline-flex items-center gap-1.5 hover:bg-muted"
                >
                  <X className="h-3.5 w-3.5" /> Cancel
                </button>
                <button
                  onClick={save}
                  className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-[12px] font-medium inline-flex items-center gap-1.5 hover:bg-primary/90"
                >
                  <Check className="h-3.5 w-3.5" /> Save changes
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="h-8 px-3 rounded-md border text-[12px] font-medium inline-flex items-center gap-1.5 hover:bg-muted"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                {testCase.status === "Draft" && (
                  <button className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-[12px] font-medium inline-flex items-center gap-1.5 hover:bg-primary/90">
                    <BadgeCheck className="h-3.5 w-3.5" /> Approve
                  </button>
                )}
              </>
            )}
          </div>
        }
      />

      <div className="flex-1 px-6 py-6 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            {/* Title */}
            <div className="rounded-lg border bg-card p-4">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">
                Title
              </div>
              {editing ? (
                <input
                  value={draft.title}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, title: e.target.value }))
                  }
                  className="w-full text-[18px] font-semibold bg-transparent border-b border-primary/30 focus:outline-none focus:border-primary py-1"
                />
              ) : (
                <h2 className="text-[18px] font-semibold">{draft.title}</h2>
              )}
            </div>

            {/* Description */}
            <div className="rounded-lg border bg-card p-4">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">
                Description
              </div>
              {editing ? (
                <textarea
                  value={draft.description}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full bg-card border rounded-md p-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
              ) : (
                <p className="text-[13px] leading-relaxed">
                  {draft.description}
                </p>
              )}
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border bg-card p-4">
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">
                  Type
                </div>
                {editing ? (
                  <select
                    value={draft.type}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        type: e.target.value as GeneratedTestCase["type"],
                      }))
                    }
                    className="w-full h-8 border rounded-md bg-card text-[13px] px-2"
                  >
                    {(["Functional", "Integration", "Negative", "Boundary"] as const).map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                ) : (
                  <span className="text-[13px] font-medium">{draft.type}</span>
                )}
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">
                  Priority
                </div>
                {editing ? (
                  <select
                    value={draft.priority}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        priority: e.target.value as GeneratedTestCase["priority"],
                      }))
                    }
                    className="w-full h-8 border rounded-md bg-card text-[13px] px-2"
                  >
                    {(["High", "Medium", "Low"] as const).map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                ) : (
                  <StatusBadge value={draft.priority} />
                )}
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">
                  Status
                </div>
                {editing ? (
                  <select
                    value={draft.status}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        status: e.target.value as "Draft" | "Approved",
                      }))
                    }
                    className="w-full h-8 border rounded-md bg-card text-[13px] px-2"
                  >
                    {(["Draft", "Approved"] as const).map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                ) : (
                  <StatusBadge value={draft.status} />
                )}
              </div>
            </div>

            {/* Test Steps */}
            <div className="rounded-lg border bg-card">
              <div className="px-4 h-10 flex items-center border-b">
                <h3 className="font-semibold flex items-center gap-1.5">
                  <ListChecks className="h-4 w-4 text-primary" /> Test Steps
                </h3>
                <span className="ml-2 text-[11px] text-muted-foreground font-mono">
                  {draft.steps.length}
                </span>
                {editing && (
                  <button
                    onClick={addStep}
                    className="ml-auto h-7 px-2.5 rounded-md text-[12px] font-medium inline-flex items-center gap-1.5 text-primary hover:bg-accent"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add step
                  </button>
                )}
              </div>
              <div className="divide-y">
                {draft.steps.map((s, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 grid grid-cols-[28px_1fr_1fr_24px] gap-3 text-[13px] items-start"
                  >
                    <div className="font-mono text-[11px] text-muted-foreground pt-1">
                      #{i + 1}
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                        Action
                      </div>
                      {editing ? (
                        <textarea
                          value={s.step}
                          onChange={(e) =>
                            updateStep(i, "step", e.target.value)
                          }
                          rows={2}
                          className="w-full bg-card border rounded-md p-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/25"
                        />
                      ) : (
                        <div>{s.step}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                        Expected Result
                      </div>
                      {editing ? (
                        <textarea
                          value={s.expected}
                          onChange={(e) =>
                            updateStep(i, "expected", e.target.value)
                          }
                          rows={2}
                          className="w-full bg-card border rounded-md p-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/25"
                        />
                      ) : (
                        <div>{s.expected}</div>
                      )}
                    </div>
                    {editing && (
                      <button
                        onClick={() => removeStep(i)}
                        className="text-muted-foreground hover:text-destructive mt-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Document */}
            {doc && (
              <div className="rounded-lg border bg-card p-4">
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">
                  Source Document
                </div>
                <p className="text-[12px] font-medium text-foreground flex items-center gap-1">
                  <FileType2 className="h-3.5 w-3.5 text-muted-foreground" />
                  {doc.name}
                </p>
              </div>
            )}

            {/* Linked Requirements */}
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
                  Linked Requirements
                </div>
                {editing && (
                  <button
                    onClick={() => setShowReqPicker((v) => !v)}
                    className="text-[11px] text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add
                  </button>
                )}
              </div>
              <div className="space-y-1">
                {draft.sourceReqIds.map((rid) => {
                  const r = requirements.find((x) => x.id === rid);
                  return (
                    <div
                      key={rid}
                      className="flex items-center gap-2 text-[12px] bg-secondary/50 border rounded-md px-2 py-1"
                    >
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {rid}
                      </span>
                      <span className="flex-1 truncate text-foreground/90">
                        {r?.name ?? "—"}
                      </span>
                      {editing && (
                        <button
                          onClick={() => removeReq(rid)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
                {draft.sourceReqIds.length === 0 && (
                  <p className="text-[12px] text-muted-foreground">
                    No requirements linked.
                  </p>
                )}
              </div>
              {editing && showReqPicker && (
                <div className="mt-2 border rounded-md bg-card">
                  <div className="p-1.5 border-b">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      <input
                        autoFocus
                        value={reqSearch}
                        onChange={(e) => setReqSearch(e.target.value)}
                        placeholder="Search requirements…"
                        className="w-full h-7 pl-7 pr-2 text-[12px] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {reqPickerResults.length === 0 ? (
                      <p className="px-3 py-2 text-[11px] text-muted-foreground">
                        No matches
                      </p>
                    ) : (
                      reqPickerResults.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => {
                            addReq(r.id);
                            setReqSearch("");
                          }}
                          className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-muted text-left text-[12px]"
                        >
                          <span className="font-mono text-[10px] text-muted-foreground w-14">
                            {r.id}
                          </span>
                          <span className="flex-1 truncate">{r.name}</span>
                          <Plus className="h-3 w-3 text-primary" />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="rounded-lg border bg-card p-4 space-y-2 text-[12px]">
              <div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-0.5">
                  Created
                </div>
                <p className="text-foreground">{draft.createdAt}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
