import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  Active: "bg-success/15 text-success border-success/30",
  Healthy: "bg-success/15 text-success border-success/30",
  Approved: "bg-success/15 text-success border-success/30",
  Connected: "bg-success/15 text-success border-success/30",
  Passed: "bg-success/15 text-success border-success/30",
  Fixed: "bg-info/15 text-info border-info/30",
  Closed: "bg-muted text-muted-foreground border-border",
  Completed: "bg-muted text-muted-foreground border-border",
  Inactive: "bg-muted text-muted-foreground border-border",
  Disconnected: "bg-muted text-muted-foreground border-border",
  Warning: "bg-warning/20 text-warning-foreground border-warning/40",
  "Under Review": "bg-warning/20 text-warning-foreground border-warning/40",
  "On Hold": "bg-warning/20 text-warning-foreground border-warning/40",
  "At Risk": "bg-destructive/15 text-destructive border-destructive/30",
  Critical: "bg-destructive/15 text-destructive border-destructive/30",
  Failed: "bg-destructive/15 text-destructive border-destructive/30",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
  Open: "bg-destructive/15 text-destructive border-destructive/30",
  High: "bg-destructive/15 text-destructive border-destructive/30",
  Medium: "bg-warning/20 text-warning-foreground border-warning/40",
  Low: "bg-info/15 text-info border-info/30",
  Draft: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ value, className }: { value: string; className?: string }) {
  const cls = variants[value] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border",
        cls,
        className
      )}
    >
      {value}
    </span>
  );
}
