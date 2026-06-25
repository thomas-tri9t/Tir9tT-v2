import { Command } from "cmdk";
import { useNavigate } from "@tanstack/react-router";
import {
  Home, LayoutGrid, GitBranch, Settings2, Users, Shield, Key,
  Plug, Folder, FileText, Bug, Search,
} from "lucide-react";
import { projects, requirements, defects } from "@/lib/mock-data";
import { useEffect } from "react";

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export function CommandPalette({ open, onOpenChange }: Props) {
  const navigate = useNavigate();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const go = (to: string, params?: Record<string, string>) => {
    onOpenChange(false);
    (navigate as unknown as (o: { to: string; params?: Record<string, string> }) => void)({ to, params });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={() => onOpenChange(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border bg-popover shadow-2xl overflow-hidden ring-1 ring-white/5"
        style={{ animation: "fade-in 0.2s ease-out" }}
      >
        <Command label="Command Palette" className="flex flex-col">
          <div className="flex items-center gap-3 px-4 border-b">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Jump to anything — projects, requirements, tests, defects, actions…"
              className="flex-1 h-14 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
            <kbd className="text-[10px] font-mono text-muted-foreground border rounded px-1.5 py-0.5">ESC</kbd>
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
              No results.
            </Command.Empty>

            <Command.Group heading="Navigate" className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1.5">
              <Item icon={Home} label="Home — Mission Control" onSelect={() => go("/")} />
              <Item icon={LayoutGrid} label="Workspace" onSelect={() => go("/workspace")} />
              <Item icon={GitBranch} label="Traceability Graph" onSelect={() => go("/traceability")} />
              <Item icon={Settings2} label="Admin Hub" onSelect={() => go("/admin")} />
            </Command.Group>

            <Command.Group heading="Projects" className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1.5">
              {projects.map((p) => (
                <Item
                  key={p.id}
                  icon={Folder}
                  label={p.name}
                  hint={p.id}
                  onSelect={() => go("/workspace/$projectId", { projectId: p.id })}
                />
              ))}
            </Command.Group>

            <Command.Group heading="Requirements" className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1.5">
              {requirements.slice(0, 6).map((r) => (
                <Item key={r.id} icon={FileText} label={r.name} hint={r.id} onSelect={() => go("/workspace")} />
              ))}
            </Command.Group>

            <Command.Group heading="Defects" className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1.5">
              {defects.slice(0, 5).map((d) => (
                <Item key={d.id} icon={Bug} label={d.title} hint={`${d.id} · ${d.severity}`} onSelect={() => go("/workspace")} />
              ))}
            </Command.Group>

            <Command.Group heading="Admin" className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1.5">
              <Item icon={Users} label="Manage Users" onSelect={() => go("/admin")} />
              <Item icon={Shield} label="Manage Roles" onSelect={() => go("/admin")} />
              <Item icon={Key} label="Permissions" onSelect={() => go("/admin")} />
              <Item icon={Plug} label="Integrations" onSelect={() => go("/admin")} />
            </Command.Group>
          </Command.List>
          <div className="border-t px-3 py-2 flex items-center gap-3 text-[10px] text-muted-foreground">
            <span><kbd className="font-mono">↑↓</kbd> navigate</span>
            <span><kbd className="font-mono">↵</kbd> select</span>
            <span className="ml-auto"><kbd className="font-mono">⌘K</kbd> toggle</span>
          </div>
        </Command>
      </div>
    </div>
  );
}

function Item({
  icon: Icon, label, hint, onSelect,
}: { icon: any; label: string; hint?: string; onSelect: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
    >
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="flex-1 truncate">{label}</span>
      {hint && <span className="text-[10px] text-muted-foreground font-mono">{hint}</span>}
    </Command.Item>
  );
}
