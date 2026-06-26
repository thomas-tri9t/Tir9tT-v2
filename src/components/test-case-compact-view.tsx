import { Link2, ArrowUpRight } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { type GeneratedTestCase } from "@/routes/workspace.$projectId";
import { reqDocuments, requirements } from "@/lib/mock-data";

export interface TestCaseCompactViewProps {
  tc: GeneratedTestCase;
  onSelectReq: (id: string) => void;
  onOpenFullView?: () => void;
}

export function TestCaseCompactView({
  tc,
  onSelectReq,
  onOpenFullView,
}: TestCaseCompactViewProps) {
  const doc = tc.sourceDocId
    ? reqDocuments.find((d) => d.id === tc.sourceDocId)
    : null;
  const linkedReqs = requirements.filter((r) =>
    tc.sourceReqIds.includes(r.id)
  );

  return (
    <div className="space-y-4">
      {/* ID and Status */}
      <div className="space-y-2">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          ID & Status
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[11px] px-2 py-1 rounded border bg-secondary text-foreground">
            {tc.id}
          </span>
          <StatusBadge value={tc.status} />
          <StatusBadge value={tc.priority} />
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          Title
        </div>
        <p className="text-[13px] font-medium text-foreground">{tc.title}</p>
      </div>

      {/* Description */}
      {tc.description && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Description
          </div>
          <p className="text-[12px] text-foreground/90 leading-relaxed line-clamp-3">
            {tc.description}
          </p>
        </div>
      )}

      {/* Test Type & Metadata */}
      <div className="space-y-2 py-2 border-t border-border/50">
        <div className="grid grid-cols-2 gap-3 text-[12px]">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">
              Type
            </div>
            <p className="text-foreground text-[11px] px-1.5 py-0.5 rounded border bg-secondary w-fit">
              {tc.type}
            </p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">
              Steps
            </div>
            <p className="text-foreground">{tc.steps.length}</p>
          </div>
        </div>
      </div>

      {/* Created Date */}
      <div className="space-y-1 py-2 border-t border-border/50">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          Created
        </div>
        <p className="text-[12px] text-foreground/90">{tc.createdAt}</p>
      </div>

      {/* Source Document */}
      {doc && (
        <div className="space-y-1 py-2 border-t border-border/50">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Source Document
          </div>
          <p className="text-[12px] text-foreground/90">{doc.name}</p>
        </div>
      )}

      {/* Linked Requirements Preview */}
      {linkedReqs.length > 0 && (
        <div className="space-y-1 py-2 border-t border-border/50">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
            <Link2 className="h-3 w-3" /> Requirements ({linkedReqs.length})
          </div>
          <div className="space-y-1">
            {linkedReqs.slice(0, 5).map((req) => (
              <button
                key={req.id}
                onClick={() => onSelectReq(req.id)}
                className="w-full text-left px-2 py-1 rounded bg-secondary/50 hover:bg-secondary text-[11px] flex items-center justify-between gap-1 group"
              >
                <span>
                  <span className="font-mono text-muted-foreground group-hover:text-primary mr-1">
                    {req.id}
                  </span>
                  <span className="text-foreground/90 truncate">
                    {req.name}
                  </span>
                </span>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 shrink-0" />
              </button>
            ))}
            {linkedReqs.length > 5 && (
              <div className="text-[11px] text-muted-foreground px-2 py-1">
                +{linkedReqs.length - 5} more
              </div>
            )}
          </div>
        </div>
      )}

      {linkedReqs.length === 0 && (
        <div className="space-y-1 py-2 border-t border-border/50">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
            <Link2 className="h-3 w-3" /> Requirements
          </div>
          <p className="text-[11px] text-muted-foreground">
            No requirements linked.
          </p>
        </div>
      )}

      {/* Test Steps Preview */}
      <div className="space-y-1 py-2 border-t border-border/50">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          Steps Preview
        </div>
        <div className="space-y-2">
          {tc.steps.slice(0, 3).map((step, i) => (
            <div key={i} className="text-[11px] p-2 rounded bg-secondary/30 space-y-1">
              <div className="font-mono text-[10px] text-muted-foreground">
                Step {i + 1}
              </div>
              <p className="text-foreground/90 line-clamp-2">{step.step}</p>
              <p className="text-foreground/70 line-clamp-1">
                → {step.expected}
              </p>
            </div>
          ))}
          {tc.steps.length > 3 && (
            <div className="text-[11px] text-muted-foreground px-2 py-1">
              +{tc.steps.length - 3} more steps
            </div>
          )}
        </div>
      </div>

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
