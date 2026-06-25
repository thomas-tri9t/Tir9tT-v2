import { X, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export interface WorkspaceDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFullView?: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function WorkspaceDetailPanel({
  isOpen,
  onClose,
  onOpenFullView,
  title,
  children,
  className,
}: WorkspaceDetailPanelProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/10"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 h-screen w-[420px] bg-card border-l border-border z-50 flex flex-col",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="shrink-0 px-4 py-3 border-b border-border/50 flex items-center justify-between gap-3">
          <h2 className="text-[13px] font-semibold truncate text-foreground">
            {title}
          </h2>
          <div className="flex items-center gap-1">
            {onOpenFullView && (
              <button
                onClick={onOpenFullView}
                className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Open full view"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Close panel"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={cn("flex-1 overflow-y-auto", className)}>
          {children}
        </div>
      </div>
    </>
  );
}
