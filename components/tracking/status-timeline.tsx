"use client";

import { cn } from "cn";
import { motion } from "motion/react";
import { formatDateTime } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { DELIVERY_FLOW, STATUS_META } from "@/lib/status";
import type { ParcelStatus, StatusEvent } from "@/lib/types";

type Entry = { status: ParcelStatus; state: "done" | "current" | "upcoming" | "cancelled"; event?: StatusEvent };

// Chronological list: every recorded event, then the stages still to come.
function buildEntries(status: ParcelStatus, history: StatusEvent[]): Entry[] {
  if (status === "cancelled") {
    return history.map((event, i) => ({
      status: event.status,
      event,
      state: i === history.length - 1 ? "cancelled" : "done",
    }));
  }
  const current = DELIVERY_FLOW.indexOf(status);
  return DELIVERY_FLOW.map((step, i) => ({
    status: step,
    event: [...history].reverse().find((e) => e.status === step),
    state: i < current || (i === current && status === "delivered") ? "done" : i === current ? "current" : "upcoming",
  }));
}

export function StatusTimeline({ status, history }: { status: ParcelStatus; history: StatusEvent[] }) {
  const { dict, lang } = useI18n();
  const entries = buildEntries(status, history);

  return (
    <ol className="relative">
      {entries.map((entry, i) => {
        const Icon = STATUS_META[entry.status].icon;
        const last = i === entries.length - 1;
        const by = entry.event?.updatedBy && typeof entry.event.updatedBy === "object" ? entry.event.updatedBy.name : null;
        return (
          <motion.li
            key={`${entry.status}-${i}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="relative flex gap-4 pb-7 last:pb-0"
          >
            {!last && (
              <span
                className={cn(
                  "absolute top-10 bottom-1 left-[19px] w-0.5 rounded-full",
                  entry.state === "done" ? "bg-primary/50" : "bg-[repeating-linear-gradient(180deg,var(--border)_0_5px,transparent_5px_10px)]",
                )}
              />
            )}
            <span
              className={cn(
                "relative grid size-10 shrink-0 place-items-center rounded-full border-2",
                entry.state === "done" && "border-primary/40 bg-primary/10 text-primary",
                entry.state === "current" && "border-primary bg-primary text-primary-foreground shadow-glow",
                entry.state === "upcoming" && "border-dashed border-border text-muted-foreground",
                entry.state === "cancelled" && "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400",
              )}
            >
              {entry.state === "current" && <span className="absolute inset-0 animate-ping rounded-full bg-primary/30 [animation-duration:2.2s]" />}
              <Icon className="relative size-4.5" />
            </span>
            <div className="min-w-0 flex-1 pt-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <p className={cn("text-sm font-medium", entry.state === "upcoming" && "text-muted-foreground")}>{dict.status[entry.status]}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.event ? formatDateTime(entry.event.at, lang) : entry.state === "upcoming" ? dict.track.upcoming : ""}
                </p>
              </div>
              {(entry.event?.note || by) && (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {entry.event?.note}
                  {by && <span className="text-xs"> · {by}</span>}
                </p>
              )}
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
