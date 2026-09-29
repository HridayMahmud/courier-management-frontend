"use client";

import { motion } from "motion/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { STATUS_META } from "@/lib/status";
import { PARCEL_STATUSES, type ParcelStatus } from "@/lib/types";

// Part-to-whole as one stacked bar (2px gaps between segments) plus a labelled legend with counts,
// so identity never rests on color alone.
export function StatusBreakdown({ counts, total }: { counts: Record<ParcelStatus, number>; total: number }) {
  const { dict, lang } = useI18n();
  const pct = (n: number) => (total ? Math.round((n / total) * 1000) / 10 : 0);
  const visible = PARCEL_STATUSES.filter((s) => counts[s] > 0);

  return (
    <div className="space-y-5">
      <div className="flex h-4 w-full gap-[2px] overflow-hidden rounded-full bg-muted">
        {visible.map((s, i) => (
          <Tooltip key={s}>
            <TooltipTrigger asChild>
              <motion.div
                className="h-full first:rounded-l-full last:rounded-r-full"
                style={{ backgroundColor: STATUS_META[s].chart }}
                initial={{ width: 0 }}
                animate={{ width: `${pct(counts[s])}%` }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                aria-label={`${dict.status[s]}: ${counts[s]}`}
              />
            </TooltipTrigger>
            <TooltipContent>
              {dict.status[s]} · {formatNumber(counts[s], lang)} ({formatNumber(pct(counts[s]), lang)}%)
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <ul className="space-y-2.5">
        {PARCEL_STATUSES.map((s) => (
          <li key={s} className="flex items-center gap-3 text-sm">
            <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: STATUS_META[s].chart }} />
            <span className="flex-1 text-muted-foreground">{dict.status[s]}</span>
            <span className="font-medium tabular-nums">{formatNumber(counts[s], lang)}</span>
            <span className="w-12 text-right text-xs text-muted-foreground tabular-nums">{formatNumber(pct(counts[s]), lang)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
