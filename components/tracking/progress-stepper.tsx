"use client";

import { cn } from "cn";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useI18n } from "@/lib/i18n";
import { DELIVERY_FLOW, STATUS_META, statusProgress } from "@/lib/status";
import type { ParcelStatus } from "@/lib/types";

// Horizontal delivery progress: filled bar plus one node per stage.
export function ProgressStepper({ status }: { status: ParcelStatus }) {
  const { dict } = useI18n();
  const current = DELIVERY_FLOW.indexOf(status);
  const progress = statusProgress(status);

  return (
    <div className="relative">
      <div className="absolute top-5 right-5 left-5 h-1 rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary via-chart-5 to-emerald-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </div>
      <ol className="relative grid grid-cols-5">
        {DELIVERY_FLOW.map((step, i) => {
          const Icon = STATUS_META[step].icon;
          const done = i < current || status === "delivered";
          const active = i === current && status !== "delivered";
          return (
            <li key={step} className="flex flex-col items-center gap-2 text-center">
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.12, type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "relative grid size-10 place-items-center rounded-full border-2 bg-card transition-colors",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && "border-primary text-primary",
                  !done && !active && "border-border text-muted-foreground",
                )}
              >
                {active && <span className="absolute inset-0 animate-ping rounded-full border-2 border-primary/50 [animation-duration:2s]" />}
                {done ? <Check className="size-4.5" /> : <Icon className="size-4.5" />}
              </motion.span>
              <span
                className={cn(
                  "hidden text-xs leading-tight sm:block",
                  done || active ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {dict.status[step]}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
