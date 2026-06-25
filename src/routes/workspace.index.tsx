import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Folder } from "lucide-react";
import { ContextHeader } from "@/components/workspace-shell";
import { StatusBadge } from "@/components/status-badge";
import { projects } from "@/lib/mock-data";

export const Route = createFileRoute("/workspace/")({
  head: () => ({ meta: [{ title: "Workspace — RequireQA" }] }),
  component: WorkspaceLauncher,
});

function WorkspaceLauncher() {
  return (
    <div className="min-h-screen">
      <ContextHeader
        eyebrow="Workspace"
        title="Choose a project"
        meta="Press ⌘K to jump directly to any project, requirement, or test."
      />
      <div className="px-8 py-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Link
                to="/workspace/$projectId" params={{ projectId: p.id }}
                className="group block rounded-2xl border bg-card p-6 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center">
                    <Folder className="h-5 w-5 text-primary" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-4">
                  <div className="text-[10px] font-mono text-muted-foreground">{p.id}</div>
                  <h3 className="text-base font-semibold tracking-tight mt-1 group-hover:text-primary transition-colors">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <StatusBadge value={p.status} />
                  <StatusBadge value={p.health} />
                  <span className="ml-auto text-xs font-semibold">{p.progress}%</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
