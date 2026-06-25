import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Thin 2px top progress bar, Linear/Vercel-style.
 * Visible while the router is loading or transitioning between routes.
 */
export function TopProgressBar() {
  const status = useRouterState({ select: (s) => s.status });
  const isPending = useRouterState({ select: (s) => s.isLoading || s.isTransitioning });
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf: number;
    let timeout: ReturnType<typeof setTimeout>;
    if (isPending || status === "pending") {
      setVisible(true);
      setProgress(0.08);
      const tick = () => {
        setProgress((p) => (p < 0.9 ? p + (0.9 - p) * 0.04 : p));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    } else if (visible) {
      setProgress(1);
      timeout = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 220);
    }
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, status]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed top-0 left-0 right-0 z-[100] h-[2px] pointer-events-none"
        >
          <div
            className="h-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
            style={{
              width: `${progress * 100}%`,
              transition: "width 180ms cubic-bezier(0.25,0.1,0.25,1)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
