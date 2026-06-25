import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const pageVariants = {
  initial: { opacity: 0, x: 6 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0 },
};

const containerVariants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.03, delayChildren: 0.05 },
  },
};

const cardVariants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, ease: EASE },
  },
};

export function AnimatedPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2, ease: EASE }}
      className={className}
    >
      <motion.div variants={containerVariants} initial="initial" animate="animate">
        {children}
      </motion.div>
    </motion.div>
  );
}

export function AnimatedCard({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: any;
}) {
  const MotionTag = (motion as any)[Tag] ?? motion.div;
  return (
    <MotionTag variants={cardVariants} className={className}>
      {children}
    </MotionTag>
  );
}
