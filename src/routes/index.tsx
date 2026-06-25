import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight, Activity, AlertTriangle, CheckCircle2, GitBranch,
  Plug, Plus, Sparkles,
} from "lucide-react";
import { ContextHeader } from "@/components/workspace-shell";
import { ActivityFeed } from "@/components/activity-feed";
import { StatusBadge } from "@/components/status-badge";
import { projects, testExecution, defectStats, traceability, almSync } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mission Control — RequireQA" },
      { name: "description", content: "Your engineering mission control." },
    ],
  }),
  component: HomePage,
});

const spring = { type: "spring" as const, stiffness: 260, damping: 26 };

function HomePage() {
  const passRate = Math.round((testExecution.passed / testExecution.executed) * 100);

  return (
    <div className="min-h-screen">
      <ContextHeader
        eyebrow="Mission Control"
        title="Good morning, Aaron"
        meta={`${projects.filter(p => p.status === "Active").length} active projects · ${defectStats.open} open defects · ${almSync.integrationHealth}% ALM health`}
        actions={
          <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 shadow-sm">
            <Plus className="h-3.5 w-3.5" /> New project
          </button>
        }
      />

      <div className="px-8 py-8 max-w-[1600px] mx-auto space-y-8">
        {/* Hero metric strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Tile
            tone="primary" icon={CheckCircle2} label="Pass rate"
            value={`${passRate}%`} hint={`${testExecution.passed} of ${testExecution.executed} executed`}
          />
          <Tile
            tone="warning" icon={Activity} label="In motion"
            value={testExecution.scheduled} hint="Scheduled this sprint"
          />
          <Tile
            tone="danger" icon={AlertTriangle} label="Open defects"
            value={defectStats.open} hint={`${defectStats.fixed} fixed · ${defectStats.closed} closed`}
          />
          <Tile
            tone="info" icon={GitBranch} label="Traceability"
            value={`${Math.round((traceability.linked / (traceability.linked + traceability.unlinked + traceability.missing)) * 100)}%`}
            hint={`${traceability.unlinked} unlinked · ${traceability.missing} missing`}
          />
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects bento */}
          <div className="lg:col-span-2">
            <SectionHeader title="Your projects" hint="Hover for vitals" action={
              <Link to="/workspace" className="text-xs font-medium text-primary inline-flex items-center gap-1">
                Open workspace <ArrowUpRight className="h-3 w-3" />
              </Link>
            } />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.slice(0, 6).map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: i * 0.04 }}
                >
                  <Link
                    to="/workspace/$projectId" params={{ projectId: p.id }}
                    className="group block rounded-2xl border bg-card p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-[10px] font-mono text-muted-foreground">{p.id}</div>
                      <StatusBadge value={p.health} />
                    </div>
                    <h3 className="font-semibold tracking-tight group-hover:text-primary transition-colors">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{p.progress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                          initial={{ width: 0 }} animate={{ width: `${p.progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.05 }}
                        />
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{p.owner}</span>
                      <span>{p.updatedAt}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Activity stream */}
          <div>
            <SectionHeader title="Activity stream" hint="Live across all projects" />
            <div className="rounded-2xl border bg-card overflow-hidden">
              <ActivityFeed limit={8} />
            </div>
          </div>
        </div>

        {/* Bottom row — integrations + insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-6 lg:col-span-2 relative overflow-hidden">
            <Sparkles className="absolute top-4 right-4 h-5 w-5 text-primary/40" />
            <div className="text-[10px] uppercase tracking-[0.14em] text-primary font-semibold mb-2">Insight</div>
            <h3 className="text-lg font-semibold tracking-tight max-w-md">
              {defectStats.open} open defects across {projects.filter(p => p.health !== "Healthy").length} at-risk projects need attention this week.
            </h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-lg">
              {traceability.missing} requirements lack traceability links. Review them from the traceability graph.
            </p>
            <div className="mt-4 flex gap-2">
              <Link to="/traceability" className="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90">
                Open traceability <ArrowUpRight className="h-3 w-3" />
              </Link>
              <Link to="/workspace" className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border text-xs font-medium hover:bg-muted">
                Review defects
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Plug className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Integrations</h3>
            </div>
            <div className="space-y-3">
              {[
                { name: "Jira", health: 98, status: "Connected" },
                { name: "Polarion", health: 87, status: "Connected" },
                { name: "Azure DevOps", health: 0, status: "Disconnected" },
              ].map((i) => (
                <div key={i.name} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{i.name}</div>
                    <div className="text-[11px] text-muted-foreground">Last sync · {i.status}</div>
                  </div>
                  <div className={`text-xs font-semibold ${i.health > 0 ? "text-success" : "text-muted-foreground"}`}>
                    {i.health > 0 ? `${i.health}%` : "—"}
                  </div>
                </div>
              ))}
            </div>
            <Link to="/admin" className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
              Manage <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tile({
  icon: Icon, label, value, hint, tone,
}: { icon: any; label: string; value: string | number; hint: string; tone: "primary" | "warning" | "danger" | "info" }) {
  const toneMap = {
    primary: "from-primary/15 to-primary/0 text-primary",
    warning: "from-warning/15 to-warning/0 text-warning-foreground",
    danger: "from-destructive/15 to-destructive/0 text-destructive",
    info: "from-info/15 to-info/0 text-info",
  };
  return (
    <div className={`relative rounded-2xl border bg-gradient-to-br ${toneMap[tone]} bg-card p-5 overflow-hidden`}>
      <div className="flex items-center gap-2">
        <div className={`h-7 w-7 rounded-lg grid place-items-center bg-background/50`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-[11px] uppercase tracking-wider font-semibold opacity-70">{label}</span>
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight text-foreground">{value}</div>
      <div className="text-[11px] text-muted-foreground mt-1">{hint}</div>
    </div>
  );
}

function SectionHeader({ title, hint, action }: { title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-3">
      <div>
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        {hint && <div className="text-[11px] text-muted-foreground">{hint}</div>}
      </div>
      {action}
    </div>
  );
}
