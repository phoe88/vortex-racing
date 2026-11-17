"use client";
import { motion, type HTMLMotionProps } from "motion/react";

/**
 * Entrance motion, kept to the design system's motion principles: a short fade
 * with an 8px rise (duration.xlong, easing.out.bold). Motion's defaults respect
 * reduced-motion preferences.
 */
const EASE_OUT_BOLD = [0, 0.4, 0, 1] as const;
const DURATION = 0.4;
const RISE = 8;

export function Reveal({
  children,
  delay = 0,
  className,
  ...rest
}: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: RISE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: DURATION, ease: EASE_OUT_BOLD, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: RISE },
        show: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE_OUT_BOLD } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
