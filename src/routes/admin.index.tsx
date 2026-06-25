import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Shield, Key, Settings2, Plug } from "lucide-react";
import { ContextHeader } from "@/components/workspace-shell";
import { StatusBadge } from "@/components/status-badge";
import { users, roles, permissions, integrations } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin — RequireQA" }] }),
  component: AdminHub,
});

const sections = [
  { id: "users", label: "Users", icon: Users, count: users.length },
  { id: "roles", label: "Roles", icon: Shield, count: roles.length },
  { id: "permissions", label: "Permissions", icon: Key, count: permissions.length },
  { id: "integrations", label: "Integrations", icon: Plug, count: integrations.length },
  { id: "admin", label: "System", icon: Settings2 },
] as const;

type SectionId = (typeof sections)[number]["id"];

function AdminHub() {
  const [active, setActive] = useState<SectionId>("users");

  return (
    <div className="min-h-screen">
      <ContextHeader
        eyebrow="Admin"
        title="System & access"
        meta="Manage users, roles, permissions, integrations, and platform settings — all in one place."
      />
      <div className="flex">
        <nav className="w-56 shrink-0 border-r min-h-[calc(100vh-88px)] p-3 space-y-0.5 sticky top-[88px]">
          {sections.map(s => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id} onClick={() => setActive(s.id)}
                className={cn(
                  "relative w-full flex items-center gap-2.5 px-3 h-9 rounded-lg text-sm transition-colors",
                  isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {isActive && (
                  <motion.span layoutId="admin-active" className="absolute inset-0 rounded-lg bg-muted" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                )}
                <s.icon className="h-3.5 w-3.5 relative z-10" />
                <span className="relative z-10 flex-1 text-left">{s.label}</span>
                {"count" in s && s.count !== undefined && (
                  <span className="relative z-10 text-[10px] text-muted-foreground font-mono">{s.count}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex-1 p-8 max-w-[1200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {active === "users" && <UsersPanel />}
              {active === "roles" && <RolesPanel />}
              {active === "permissions" && <PermissionsPanel />}
              {active === "integrations" && <IntegrationsPanel />}
              {active === "admin" && <SystemPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function PanelHeader({ title, hint, actions }: { title: string; hint: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{hint}</p>
      </div>
      {actions}
    </div>
  );
}

function UsersPanel() {
  return (
    <div>
      <PanelHeader title="Users" hint="Invite, assign roles, and manage workspace access." actions={
        <button className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium">+ Invite user</button>
      } />
      <div className="rounded-2xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-4 py-2.5 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">User</th>
              <th className="px-4 py-2.5 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Role</th>
              <th className="px-4 py-2.5 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Department</th>
              <th className="px-4 py-2.5 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 grid place-items-center text-xs font-semibold">
                      {u.name.split(" ").map(s => s[0]).join("")}
                    </div>
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{u.role}</td>
                <td className="px-4 py-3 text-sm">{u.department}</td>
                <td className="px-4 py-3"><StatusBadge value={u.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RolesPanel() {
  return (
    <div>
      <PanelHeader title="Roles" hint="Bundle permissions into roles you assign to users." actions={
        <button className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium">+ New role</button>
      } />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map(r => (
          <div key={r.id} className="rounded-2xl border bg-card p-5 hover:border-primary/40 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{r.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>
              </div>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs">
              <span><b>{r.users}</b> <span className="text-muted-foreground">users</span></span>
              <span><b>{r.permissions}</b> <span className="text-muted-foreground">permissions</span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PermissionsPanel() {
  const byCategory = permissions.reduce<Record<string, typeof permissions>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});
  return (
    <div>
      <PanelHeader title="Permissions" hint="Fine-grained capabilities grouped by area." />
      <div className="space-y-6">
        {Object.entries(byCategory).map(([cat, perms]) => (
          <div key={cat}>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">{cat}</div>
            <div className="rounded-2xl border bg-card divide-y">
              {perms.map(p => (
                <div key={p.id} className="px-4 py-3 flex items-center gap-4">
                  <Key className="h-3.5 w-3.5 text-muted-foreground" />
                  <code className="text-xs font-mono">{p.name}</code>
                  <span className="text-sm text-muted-foreground flex-1">{p.description}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntegrationsPanel() {
  return (
    <div>
      <PanelHeader title="Integrations" hint="Sync requirements, tests, and defects with external ALM tools." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {integrations.map(i => (
          <div key={i.id} className="rounded-2xl border bg-card p-5 hover:border-primary/40 transition-all">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/5 grid place-items-center font-bold text-primary">
                {i.icon}
              </div>
              <StatusBadge value={i.status} />
            </div>
            <h3 className="font-semibold mt-4">{i.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{i.description}</p>
            <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Last sync · {i.lastSync}</span>
              {i.health > 0 && <span className="font-semibold text-success">{i.health}%</span>}
            </div>
            <button className="mt-3 w-full h-8 rounded-lg border text-xs font-medium hover:bg-muted">
              {i.status === "Connected" ? "Configure" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SystemPanel() {
  return (
    <div>
      <PanelHeader title="System" hint="Workspace-level configuration." />
      <div className="rounded-2xl border bg-card p-6 space-y-4">
        {[
          { label: "Workspace name", value: "RequireQA Production" },
          { label: "Default timezone", value: "America/New_York" },
          { label: "Retention policy", value: "90 days" },
          { label: "Audit logging", value: "Enabled" },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between py-2 border-b last:border-b-0">
            <div className="text-sm font-medium">{row.label}</div>
            <div className="text-sm text-muted-foreground">{row.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
