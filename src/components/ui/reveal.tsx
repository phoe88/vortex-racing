"use client";
import { motion, type HTMLMotionProps } from "motion/react";

/** Entrance motion: a short fade with a small rise. Motion's defaults respect reduced-motion preferences. */
const EASE = [0.2, 0.8, 0.2, 1] as const;
const DURATION = 0.6;
const RISE = 24;

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
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: DURATION, ease: EASE, delay }}
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
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
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
        show: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
