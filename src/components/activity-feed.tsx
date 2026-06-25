import { Link } from "@tanstack/react-router";
import { activities as allActivities, type Activity } from "@/lib/mock-data";
import { Edit3, Plus, X, Check, MessageSquare, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  edit: Edit3,
  create: Plus,
  reject: X,
  approve: Check,
  comment: MessageSquare,
  sync: RefreshCw,
};

const colorMap = {
  edit: "text-info bg-info/10",
  create: "text-success bg-success/10",
  reject: "text-destructive bg-destructive/10",
  approve: "text-success bg-success/10",
  comment: "text-muted-foreground bg-muted",
  sync: "text-primary bg-primary/10",
};

export function ActivityFeed({
  limit,
  showViewMore = false,
  activities = allActivities,
}: {
  limit?: number;
  showViewMore?: boolean;
  activities?: Activity[];
}) {
  const items = limit ? activities.slice(0, limit) : activities;
  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="text-sm font-semibold">Recent Activity</h3>
        <span className="text-xs text-muted-foreground">{items.length} events</span>
      </div>
      <ul className="divide-y">
        {items.map((a) => {
          const Icon = iconMap[a.type];
          return (
            <li key={a.id} className="px-4 py-3 hover:bg-accent/40 transition-colors">
              <div className="flex gap-3">
                <div className={cn("h-7 w-7 rounded-full grid place-items-center shrink-0", colorMap[a.type])}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug">
                    <span className="font-medium">{a.user}</span>{" "}
                    <span className="text-muted-foreground">{a.action}</span>{" "}
                    <span className="font-medium">{a.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {a.project} • {a.timestamp}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {showViewMore && (
        <div className="px-4 py-3 border-t">
          <Link
            to="/activities"
            className="text-xs font-semibold text-primary hover:underline"
          >
            View all activities →
          </Link>
        </div>
      )}
    </div>
  );
}
