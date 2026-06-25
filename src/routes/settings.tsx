import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { Users, Shield, Key, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  component: SettingsLayout,
});

const items = [
  { label: "User Management", to: "/settings/users", icon: Users },
  { label: "Role Management", to: "/settings/roles", icon: Shield },
  { label: "Permission Management", to: "/settings/permissions", icon: Key },
  { label: "Admin", to: "/settings/admin", icon: Wrench },
];

function SettingsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="max-w-[1600px] mx-auto px-6 py-6">
      <h1 className="text-2xl font-semibold tracking-tight mb-1">Settings</h1>
      <p className="text-sm text-muted-foreground mb-6">Administer users, roles, permissions, and system configuration.</p>
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <aside>
          <nav className="space-y-1">
            {items.map((i) => {
              const active = pathname === i.to || (i.to !== "/settings" && pathname.startsWith(i.to));
              return (
                <Link key={i.to} to={i.to} className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors",
                  active ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                )}>
                  <i.icon className="h-4 w-4" />
                  {i.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div><Outlet /></div>
      </div>
    </div>
  );
}
