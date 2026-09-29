"use client";

import { cn } from "cn";
import type { LucideIcon } from "lucide-react";
import { Counter } from "@/components/shared/counter";
import { Skeleton } from "@/components/ui/skeleton";

const TINTS = {
  indigo: "bg-indigo-500/12 text-indigo-600 dark:text-indigo-300",
  amber: "bg-amber-500/12 text-amber-600 dark:text-amber-300",
  blue: "bg-blue-500/12 text-blue-600 dark:text-blue-300",
  emerald: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
  violet: "bg-violet-500/12 text-violet-600 dark:text-violet-300",
  cyan: "bg-cyan-500/12 text-cyan-600 dark:text-cyan-300",
  red: "bg-red-500/12 text-red-600 dark:text-red-300",
} as const;

export function StatCard({
  label,
  value,
  icon: Icon,
  tint = "indigo",
  hint,
  loading,
  compact = false,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  tint?: keyof typeof TINTS;
  hint?: React.ReactNode;
  loading?: boolean;
  // tighter padding and no icon on phones, for rows of three
  compact?: boolean;
}) {
  return (
    <div className={cn("group relative overflow-hidden rounded-2xl border bg-card shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow", compact ? "p-3.5 sm:p-5" : "p-5")}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className={cn("text-muted-foreground", compact ? "text-xs sm:text-sm" : "text-sm")}>{label}</p>
          {loading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <p className="text-3xl font-semibold tracking-tight">
              <Counter value={value} duration={0.9} />
            </p>
          )}
        </div>
        <span className={cn("size-11 shrink-0 place-items-center rounded-xl", compact ? "hidden sm:grid" : "grid", TINTS[tint])}>
          <Icon className="size-5" />
        </span>
      </div>
      {hint && <div className="mt-3 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
