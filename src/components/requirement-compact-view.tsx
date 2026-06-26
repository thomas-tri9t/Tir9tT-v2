import { Link2, FlaskConical, Shield, ArrowUpRight } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { type Requirement } from "@/lib/mock-data";
import { reqDocuments, requirements } from "@/lib/mock-data";

export interface RequirementCompactViewProps {
  req: Requirement;
  onOpenTest: (id: string) => void;
  onOpenFullView?: () => void;
  allTestCases: Array<{
    id: string;
    title: string;
    sourceReqIds: string[];
    status: "Draft" | "Approved";
  }>;
}

export function RequirementCompactView({
  req,
  onOpenTest,
  onOpenFullView,
  allTestCases,
}: RequirementCompactViewProps) {
  const doc = reqDocuments.find((d) => d.id === req.documentId);
  const linkedTests = allTestCases.filter((tc) =>
    tc.sourceReqIds.includes(req.id)
  );
  const upstream = req.parent
    ? requirements.find((r) => r.id === req.parent)
    : null;

  return (
    <div className="space-y-4">
      {/* ID and Status */}
      <div className="space-y-2">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          ID & Status
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[11px] px-2 py-1 rounded border bg-secondary text-foreground">
            {req.id}
          </span>
          <StatusBadge value={req.status} />
          <StatusBadge value={req.priority} />
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          Title
        </div>
        <p className="text-[13px] font-medium text-foreground">{req.name}</p>
      </div>

      {/* Description */}
      {req.description && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Description
          </div>
          <p className="text-[12px] text-foreground/90 leading-relaxed line-clamp-3">
            {req.description}
          </p>
        </div>
      )}

      {/* Metadata */}
      <div className="space-y-2 py-2 border-t border-border/50">
        <div className="grid grid-cols-2 gap-3 text-[12px]">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">
              Group
            </div>
            <p className="text-foreground">{req.group}</p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">
              Level
            </div>
            <p className="text-foreground">{req.levelName}</p>
          </div>
        </div>
      </div>

      {/* Source Document */}
      {doc && (
        <div className="space-y-1 py-2 border-t border-border/50">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Source Document
          </div>
          <p className="text-[12px] text-foreground/90 flex items-center gap-1">
            {doc.name}
          </p>
        </div>
      )}

      {/* Upstream Requirement */}
      {upstream && (
        <div className="space-y-1 py-2 border-t border-border/50">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
            <Link2 className="h-3 w-3" /> Parent
          </div>
          <p className="text-[12px] text-foreground/90">
            <span className="font-mono text-[11px] text-muted-foreground">
              {upstream.id}
            </span>{" "}
            {upstream.name}
          </p>
        </div>
      )}

      {/* Compliance Tags */}
      {req.compliance.length > 0 && (
        <div className="space-y-1 py-2 border-t border-border/50">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
            <Shield className="h-3 w-3" /> Compliance
          </div>
          <div className="flex flex-wrap gap-1">
            {req.compliance.map((c) => (
              <span
                key={c}
                className="text-[10px] px-1.5 py-0.5 rounded border bg-secondary/40 text-foreground"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Linked Test Cases Preview */}
      {linkedTests.length > 0 && (
        <div className="space-y-1 py-2 border-t border-border/50">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
            <FlaskConical className="h-3 w-3" /> Test Cases ({linkedTests.length})
          </div>
          <div className="space-y-1">
            {linkedTests.slice(0, 5).map((tc) => (
              <button
                key={tc.id}
                onClick={() => onOpenTest(tc.id)}
                className="w-full text-left px-2 py-1 rounded bg-secondary/50 hover:bg-secondary text-[11px] flex items-center justify-between gap-1 group"
              >
                <span className="font-mono text-muted-foreground group-hover:text-primary">
                  {tc.id}
                </span>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
              </button>
            ))}
            {linkedTests.length > 5 && (
              <div className="text-[11px] text-muted-foreground px-2 py-1">
                +{linkedTests.length - 5} more
              </div>
            )}
          </div>
        </div>
      )}

      {linkedTests.length === 0 && (
        <div className="space-y-1 py-2 border-t border-border/50">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
            <FlaskConical className="h-3 w-3" /> Test Cases
          </div>
          <p className="text-[11px] text-muted-foreground">No test cases linked.</p>
        </div>
      )}

      {/* Open Full View Button */}
      {onOpenFullView && (
        <div className="pt-2 border-t border-border/50">
          <button
            onClick={onOpenFullView}
            className="w-full h-8 px-3 rounded-md border bg-card text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted inline-flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowUpRight className="h-3.5 w-3.5" /> Open Full View
          </button>
        </div>
      )}
    </div>
  );
}
