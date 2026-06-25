import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Home, LayoutGrid, GitBranch, Settings2, Command,
  Bell, User, ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandPalette } from "./command-palette";
import { Tri9tLogo } from "./tri9t-logo";

const railItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/workspace", icon: LayoutGrid, label: "Workspace" },
  { to: "/traceability", icon: GitBranch, label: "Traceability" },
  { to: "/admin", icon: Settings2, label: "Admin" },
];

const EASE = "cubic-bezier(0.25,0.1,0.25,1)";

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Left rail — collapsible, white surface */}
      <aside
        style={{ width: expanded ? 224 : 64, transition: `width 150ms ${EASE}` }}
        className="shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col sticky top-0 h-screen overflow-hidden"
      >
        {/* Brand */}
        <div className="h-14 flex items-center px-3 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <span className="h-8 w-8 shrink-0 grid place-items-center rounded-md bg-primary text-primary-foreground font-bold text-[15px]">
              T
            </span>
            {expanded && (
              <span className="font-semibold text-[14px] tracking-[-0.01em] text-sidebar-foreground whitespace-nowrap">
                TRI<span className="text-primary">9</span>T
              </span>
            )}
          </Link>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="ml-auto h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className={cn("h-3.5 w-3.5", !expanded && "rotate-180")} />
          </button>
        </div>

        {/* Command */}
        <div className="px-2 pt-3">
          <button
            onClick={() => setPaletteOpen(true)}
            className="w-full flex items-center gap-2.5 h-9 px-2.5 rounded-md text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border"
          >
            <Command className="h-4 w-4 shrink-0" />
            {expanded && (
              <>
                <span>Search</span>
                <kbd className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted border border-border text-muted-foreground">⌘K</kbd>
              </>
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 pt-4 flex flex-col gap-0.5">
          {expanded && (
            <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-semibold px-2.5 pb-2">
              Workspace
            </div>
          )}
          {railItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group relative flex items-center gap-2.5 h-9 px-2.5 rounded-md text-[13px] font-medium",
                  active
                    ? "text-primary bg-accent"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                )}
              >
                {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-primary" />}
                <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
                {expanded && <span className="whitespace-nowrap">{item.label}</span>}
                {!expanded && (
                  <span className="absolute left-full ml-2 px-2 py-1 rounded-md bg-popover text-popover-foreground text-[12px] font-medium whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none z-50 border">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-sidebar-border flex items-center gap-2">
          <button className="h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">
            <Bell className="h-4 w-4" />
          </button>
          <div className="h-8 w-8 rounded-md bg-primary grid place-items-center">
            <User className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          {expanded && (
            <div className="min-w-0 leading-tight">
              <div className="text-[12px] font-semibold text-foreground truncate">Engineer</div>
              <div className="text-[11px] text-muted-foreground truncate">workspace</div>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 min-w-0">{children}</main>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}

export function ContextHeader({
  eyebrow, title, meta, actions,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-xl border-b">
      <div className="px-8 py-5 flex items-end justify-between gap-6">
        <div className="min-w-0">
          {eyebrow && (
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold mb-1.5">
              {eyebrow}
            </div>
          )}
          <h1 className="text-[28px] font-bold tracking-[-0.02em] leading-tight truncate text-foreground">
            {title}
          </h1>
          {meta && <div className="mt-1.5 text-[13px] font-medium text-muted-foreground">{meta}</div>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </header>
  );
}

export { Tri9tLogo };
