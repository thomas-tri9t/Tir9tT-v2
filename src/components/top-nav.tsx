import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, HelpCircle, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "Traceability", to: "/traceability" },
  { label: "Reports", to: "/reports" },
  { label: "Defects", to: "/defects" },
  { label: "Integrations", to: "/integrations" },
  { label: "Settings", to: "/settings" },
];

export function TopNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <header className="bg-nav text-nav-foreground border-b border-black/20">
      <div className="flex h-14 items-center px-4 gap-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary grid place-items-center font-bold text-primary-foreground">
            R
          </div>
          <span className="font-semibold tracking-tight text-sm uppercase">
            RequireQA
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "px-3 py-2 text-xs font-semibold uppercase tracking-wide rounded transition-colors",
                isActive(item.to)
                  ? "bg-nav-accent text-white"
                  : "text-nav-foreground/70 hover:text-white hover:bg-white/5"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-nav-foreground/50" />
            <Input
              placeholder="Search..."
              className="h-8 w-56 pl-7 bg-white/10 border-white/10 text-nav-foreground placeholder:text-nav-foreground/50"
            />
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-nav-foreground/80 hover:text-white hover:bg-white/10">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-nav-foreground/80 hover:text-white hover:bg-white/10">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="h-7 w-7 rounded-full bg-primary/80 grid place-items-center">
              <User className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-medium">Aaron Perillat</span>
          </div>
        </div>
      </div>
    </header>
  );
}
