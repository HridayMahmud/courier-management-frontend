"use client";

import { motion } from "motion/react";

export function AuthHeading({ title, subtitle, icon }: { title: string; subtitle: string; icon?: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8 space-y-2">
      {icon && <div className="mb-5">{icon}</div>}
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
      <p className="text-sm text-muted-foreground sm:text-base">{subtitle}</p>
    </motion.div>
  );
}

// fades the form in slightly after the heading
export function AuthBody({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}>
      {children}
    </motion.div>
  );
}
