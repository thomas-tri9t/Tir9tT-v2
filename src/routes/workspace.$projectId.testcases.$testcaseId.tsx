import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, Check, X, Pencil, BadgeCheck, Trash2, ListChecks,
  Plus, Search, FileType2, ChevronDown, Link2, FileText,
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { requirements, reqDocuments, type Requirement } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/workspace/$projectId/testcases/$testcaseId")({
  head: () => ({ meta: [{ title: "Test Case — RequireQA" }] }),
  loader: ({ params }) => {
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
  const [template, setTemplate] = useState<"Text Test Case" | "Step Test Case">("Step Test Case");
  const [reqSearch, setReqSearch] = useState("");
  const [showReqPicker, setShowReqPicker] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-card border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-[12px] text-muted-foreground mb-2">
                <Link
                  to="/workspace/$projectId"
                  params={{ projectId }}
                  className="hover:text-primary"
                >
                  Workspace
                </Link>
                <span>/</span>
                <span>Test Cases</span>
                <span>/</span>
                <span className="text-foreground font-semibold">{testcaseId}</span>
              </div>
              <h1 className="text-[20px] font-semibold text-foreground truncate">
                {editing ? (
                  <input
                    value={draft.title}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, title: e.target.value }))
                    }
                    className="w-full bg-transparent border-b border-primary/30 focus:outline-none focus:border-primary text-[20px] py-1"
                  />
                ) : (
                  draft.title
                )}
              </h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {editing ? (
                <>
                  <button
                    onClick={cancel}
                    className="h-9 px-3.5 rounded-md border bg-card text-[12px] font-medium inline-flex items-center gap-1.5 hover:bg-muted transition-colors"
                  >
                    <X className="h-3.5 w-3.5" /> Cancel
                  </button>
                  <button
                    onClick={save}
                    className="h-9 px-3.5 rounded-md bg-primary text-primary-foreground text-[12px] font-medium inline-flex items-center gap-1.5 hover:bg-primary/90 transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" /> Save
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="h-9 px-3.5 rounded-md border text-[12px] font-medium inline-flex items-center gap-1.5 hover:bg-muted transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  {testCase.status === "Draft" && (
                    <button className="h-9 px-3.5 rounded-md bg-primary text-primary-foreground text-[12px] font-medium inline-flex items-center gap-1.5 hover:bg-primary/90 transition-colors">
                      <BadgeCheck className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-6 pb-32 max-w-6xl mx-auto w-full">
        <div className="space-y-4">
          {/* Header Information Section */}
          <Section title="Header Information">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Test Case ID" read>
                <span className="font-mono text-[13px]">{draft.id}</span>
              </Field>
              <Field
                label="Status"
                edit={
                  editing && (
                    <select
                      value={draft.status}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          status: e.target.value as "Draft" | "Approved",
                        }))
                      }
                      className="h-8 border rounded bg-background text-[12px] px-2"
                    >
                      {(["Draft", "Approved"] as const).map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  )
                }
              >
                <StatusBadge value={draft.status} />
              </Field>
              <Field
                label="Priority"
                edit={
                  editing && (
                    <select
                      value={draft.priority}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          priority: e.target.value as GeneratedTestCase["priority"],
                        }))
                      }
                      className="h-8 border rounded bg-background text-[12px] px-2"
                    >
                      {(["High", "Medium", "Low"] as const).map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  )
                }
              >
                <StatusBadge value={draft.priority} />
              </Field>
              <Field label="Module / Category">
                {editing ? (
                  <input
                    defaultValue="Authentication"
                    className="h-8 border rounded bg-background text-[12px] px-2 w-full"
                  />
                ) : (
                  <span className="text-[13px]">Authentication</span>
                )}
              </Field>
              <Field label="Application Name">
                {editing ? (
                  <input
                    defaultValue="Security Suite"
                    className="h-8 border rounded bg-background text-[12px] px-2 w-full"
                  />
                ) : (
                  <span className="text-[13px]">Security Suite</span>
                )}
              </Field>
            </div>
          </Section>

          {/* Ownership & Metadata Section */}
          <Section title="Ownership & Metadata">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Created By" read>
                <span className="text-[13px]">Sarah Chen</span>
              </Field>
              <Field label="Reviewed By">
                {editing ? (
                  <input
                    defaultValue="James Morrison"
                    className="h-8 border rounded bg-background text-[12px] px-2 w-full"
                  />
                ) : (
                  <span className="text-[13px]">James Morrison</span>
                )}
              </Field>
              <Field label="Created Date" read>
                <span className="text-[13px]">{draft.createdAt}</span>
              </Field>
              <Field label="Last Updated" read>
                <span className="text-[13px]">2026-06-24</span>
              </Field>
            </div>
          </Section>

          {/* Test Case Information Section */}
          <Section title="Test Case Information">
            <div className="grid grid-cols-3 gap-3">
              <Field label="Group">
                {editing ? (
                  <select className="h-8 border rounded bg-background text-[12px] px-2 w-full">
                    {[
                      "Authentication",
                      "User Management",
                      "Dashboard",
                      "Transactions",
                      "Reports & Analytics",
                    ].map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                ) : (
                  <span className="text-[13px]">Authentication</span>
                )}
              </Field>
              <Field label="Template">
                {editing ? (
                  <select
                    value={template}
                    onChange={(e) =>
                      setTemplate(
                        e.target.value as "Text Test Case" | "Step Test Case"
                      )
                    }
                    className="h-8 border rounded bg-background text-[12px] px-2 w-full"
                  >
                    <option>Text Test Case</option>
                    <option>Step Test Case</option>
                  </select>
                ) : (
                  <span className="text-[13px]">{template}</span>
                )}
              </Field>
              <Field label="Type">
                {editing ? (
                  <select
                    value={draft.type}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        type: e.target.value as GeneratedTestCase["type"],
                      }))
                    }
                    className="h-8 border rounded bg-background text-[12px] px-2 w-full"
                  >
                    {([
                      "Functional",
                      "Integration",
                      "Negative",
                      "Boundary",
                    ] as const).map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                ) : (
                  <span className="text-[13px]">{draft.type}</span>
                )}
              </Field>
              <Field label="Estimate">
                {editing ? (
                  <input
                    defaultValue="2 hours"
                    className="h-8 border rounded bg-background text-[12px] px-2 w-full"
                  />
                ) : (
                  <span className="text-[13px]">2 hours</span>
                )}
              </Field>
              <Field label="References">
                {editing ? (
                  <input
                    defaultValue="SEC-2024-08"
                    className="h-8 border rounded bg-background text-[12px] px-2 w-full"
                  />
                ) : (
                  <span className="text-[13px]">SEC-2024-08</span>
                )}
              </Field>
              <Field label="Automation Type">
                {editing ? (
                  <select className="h-8 border rounded bg-background text-[12px] px-2 w-full">
                    {[
                      "Manual",
                      "Automated",
                      "Semi-Automated",
                      "Not Automatable",
                      "Planned for Automation",
                    ].map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                ) : (
                  <span className="text-[13px]">Automated</span>
                )}
              </Field>
            </div>
          </Section>

          {/* Preconditions Section */}
          <Section title="Preconditions">
            {editing ? (
              <textarea
                value={draft.description}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, description: e.target.value }))
                }
                rows={4}
                placeholder="Enter preconditions (supports rich text in production)..."
                className="w-full border rounded bg-background text-[13px] p-2 focus:outline-none focus:ring-2 focus:ring-primary/25"
              />
            ) : (
              <p className="text-[13px] leading-relaxed text-foreground/90">
                {draft.description}
              </p>
            )}
          </Section>

          {/* Dynamic Template Section */}
          {template === "Step Test Case" && (
            <Section title="Test Steps">
              <div className="overflow-x-auto border rounded">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-12">
                        #
                      </th>
                      <th className="px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex-1">
                        Step
                      </th>
                      <th className="px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex-1">
                        Expected Result
                      </th>
                      {editing && (
                        <th className="px-3 py-2 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-12">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {draft.steps.map((step, i) => (
                      <tr key={i} className="hover:bg-muted/20">
                        <td className="px-3 py-3 font-mono text-[11px] text-muted-foreground">
                          {i + 1}
                        </td>
                        <td className="px-3 py-3">
                          {editing ? (
                            <textarea
                              value={step.step}
                              onChange={(e) =>
                                updateStep(i, "step", e.target.value)
                              }
                              rows={2}
                              className="w-full border rounded bg-background text-[12px] p-1.5 focus:outline-none focus:ring-2 focus:ring-primary/25"
                            />
                          ) : (
                            <p className="text-[13px] text-foreground/90">
                              {step.step}
                            </p>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          {editing ? (
                            <textarea
                              value={step.expected}
                              onChange={(e) =>
                                updateStep(i, "expected", e.target.value)
                              }
                              rows={2}
                              className="w-full border rounded bg-background text-[12px] p-1.5 focus:outline-none focus:ring-2 focus:ring-primary/25"
                            />
                          ) : (
                            <p className="text-[13px] text-foreground/90">
                              {step.expected}
                            </p>
                          )}
                        </td>
                        {editing && (
                          <td className="px-3 py-3">
                            <button
                              onClick={() => removeStep(i)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {editing && (
                <button
                  onClick={addStep}
                  className="mt-3 h-8 px-3 text-[12px] font-medium rounded border text-primary hover:bg-accent inline-flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Step
                </button>
              )}
            </Section>
          )}

          {template === "Text Test Case" && (
            <>
              <Section title="Steps to Execute">
                {editing ? (
                  <textarea
                    defaultValue="1. Navigate to the login screen\n2. Enter credentials\n3. Verify authentication"
                    rows={5}
                    className="w-full border rounded bg-background text-[13px] p-2 focus:outline-none focus:ring-2 focus:ring-primary/25"
                  />
                ) : (
                  <p className="text-[13px] leading-relaxed text-foreground/90">
                    1. Navigate to the login screen
                    <br />
                    2. Enter credentials
                    <br />
                    3. Verify authentication
                  </p>
                )}
              </Section>

              <Section title="Expected Results">
                {editing ? (
                  <textarea
                    defaultValue="User is successfully authenticated and routed to the dashboard"
                    rows={4}
                    className="w-full border rounded bg-background text-[13px] p-2 focus:outline-none focus:ring-2 focus:ring-primary/25"
                  />
                ) : (
                  <p className="text-[13px] leading-relaxed text-foreground/90">
                    User is successfully authenticated and routed to the dashboard
                  </p>
                )}
              </Section>
            </>
          )}

          {/* Traceability Section */}
          <Section title="Traceability">
            <div className="space-y-3">
              <div>
                <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                  Linked Requirements
                </div>
                <div className="flex flex-wrap gap-2">
                  {linkedReqs.map((req) => (
                    <Link
                      key={req.id}
                      to="/requirements/$reqId"
                      params={{ reqId: req.id }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border bg-card hover:bg-muted transition-colors"
                    >
                      <span className="font-mono text-[11px] font-semibold text-primary">
                        {req.id}
                      </span>
                      <span className="text-[12px] text-foreground truncate max-w-xs">
                        {req.name}
                      </span>
                    </Link>
                  ))}
                  {linkedReqs.length === 0 && (
                    <p className="text-[12px] text-muted-foreground">
                      No requirements linked.
                    </p>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                    Add Requirement
                  </div>
                  {editing && (
                    <button
                      onClick={() => setShowReqPicker((v) => !v)}
                      className="text-[11px] text-primary hover:underline"
                    >
                      <Plus className="h-3 w-3 inline mr-1" /> Add
                    </button>
                  )}
                </div>
                {editing && showReqPicker && (
                  <div className="border rounded-md bg-card">
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <input
                          autoFocus
                          value={reqSearch}
                          onChange={(e) => setReqSearch(e.target.value)}
                          placeholder="Search requirements…"
                          className="w-full h-7 pl-7 pr-2 text-[12px] focus:outline-none bg-background rounded"
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
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted text-left text-[12px] border-b last:border-b-0"
                          >
                            <span className="font-mono text-[10px] text-muted-foreground w-14 shrink-0">
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
            </div>
          </Section>

          {/* Regulatory Compliance Section */}
          <Section title="Regulatory Compliance">
            <div className="grid grid-cols-3 gap-3">
              <Field label="Standard">
                {editing ? (
                  <input
                    defaultValue="ISO 13485"
                    className="h-8 border rounded bg-background text-[12px] px-2 w-full"
                  />
                ) : (
                  <span className="text-[13px]">ISO 13485</span>
                )}
              </Field>
              <Field label="Clause">
                {editing ? (
                  <input
                    defaultValue="7.3.2"
                    className="h-8 border rounded bg-background text-[12px] px-2 w-full"
                  />
                ) : (
                  <span className="text-[13px]">7.3.2</span>
                )}
              </Field>
              <Field label="Compliance Details">
                {editing ? (
                  <textarea
                    defaultValue="Security controls for user authentication"
                    rows={1}
                    className="h-8 border rounded bg-background text-[12px] px-2 w-full resize-none"
                  />
                ) : (
                  <span className="text-[13px]">
                    Security controls for user authentication
                  </span>
                )}
              </Field>
            </div>
          </Section>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer
        ref={footerRef}
        className="fixed bottom-0 left-0 right-0 border-t bg-card backdrop-blur-sm"
      >
        <div className="px-6 py-3 max-w-6xl mx-auto w-full flex items-center justify-end gap-2">
          {editing ? (
            <>
              <button
                onClick={cancel}
                className="h-9 px-4 rounded-md border text-[12px] font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-[12px] font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" /> Save Test Case
              </button>
            </>
          ) : (
            <div className="text-[11px] text-muted-foreground">
              All changes saved
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="border rounded-lg bg-card">
      <div className="px-4 h-10 flex items-center border-b bg-muted/50">
        <h2 className="text-[13px] font-semibold text-foreground">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
  edit?: React.ReactNode;
  read?: boolean;
}

function Field({ label, children, edit, read }: FieldProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block mb-1">
        {label}
        {read && <span className="text-muted-foreground/60"> (read-only)</span>}
      </label>
      {edit && !read ? (
        <div onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? edit : children}
        </div>
      ) : (
        <div className="text-[13px]">{children}</div>
      )}
    </div>
  );
}
