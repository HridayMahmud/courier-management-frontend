"use client";

import { cn } from "cn";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { STATUS_META } from "@/lib/status";
import { PARCEL_STATUSES, type ParcelStatus } from "@/lib/types";

// Status filter; "" means all statuses (Radix Select can't use an empty value, so "all" stands in).
export function StatusSelect({
  value,
  onChange,
  className,
}: {
  value: ParcelStatus | "";
  onChange: (value: ParcelStatus | "") => void;
  className?: string;
}) {
  const { dict } = useI18n();
  return (
    <Select value={value || "all"} onValueChange={(v) => onChange(v === "all" ? "" : (v as ParcelStatus))}>
      <SelectTrigger className={cn("h-10 w-full rounded-xl bg-card sm:w-48", className)} aria-label={dict.parcel.status}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{dict.customer.allStatuses}</SelectItem>
        {PARCEL_STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            <span className={cn("size-2 rounded-full", STATUS_META[s].dot)} />
            {dict.status[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
