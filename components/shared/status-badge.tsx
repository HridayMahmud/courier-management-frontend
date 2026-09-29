"use client";

import { cn } from "cn";
import { useI18n } from "@/lib/i18n";
import { STATUS_META } from "@/lib/status";
import type { ParcelStatus } from "@/lib/types";

export function StatusBadge({ status, className, withIcon = false }: { status: ParcelStatus; className?: string; withIcon?: boolean }) {
  const { dict } = useI18n();
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
        meta.badge,
        className,
      )}
    >
      {withIcon ? <Icon className="size-3.5" /> : <span className={cn("size-1.5 rounded-full", meta.dot)} />}
      {dict.status[status]}
    </span>
  );
}
