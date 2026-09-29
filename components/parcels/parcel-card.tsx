"use client";

import { ArrowRight, MapPin, Scale, User } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatNumber, formatRelative } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { STATUS_META, statusProgress } from "@/lib/status";
import type { Parcel } from "@/lib/types";

export function ParcelCard({ parcel, href }: { parcel: Parcel; href: string }) {
  const { dict, lang } = useI18n();
  return (
    <Link
      href={href}
      className="group flex h-full flex-col gap-4 rounded-2xl border bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-glow focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">{parcel.title}</p>
          <p className="font-mono text-xs tracking-wide text-muted-foreground">{parcel.trackingId ?? "—"}</p>
        </div>
        <StatusBadge status={parcel.status} />
      </div>
      <div className="space-y-1.5 text-sm text-muted-foreground">
        {parcel.receiverName && (
          <p className="flex items-center gap-2">
            <User className="size-3.5 shrink-0" /> <span className="truncate">{parcel.receiverName}</span>
          </p>
        )}
        <p className="flex items-center gap-2">
          <MapPin className="size-3.5 shrink-0" /> <span className="truncate">{parcel.address}</span>
        </p>
        {parcel.weight != null && (
          <p className="flex items-center gap-2">
            <Scale className="size-3.5 shrink-0" /> {formatNumber(parcel.weight, lang)} {dict.common.kg}
          </p>
        )}
      </div>
      <div className="mt-auto space-y-2">
        {parcel.status !== "cancelled" && (
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full transition-all" style={{ width: `${statusProgress(parcel.status)}%`, backgroundColor: STATUS_META[parcel.status].chart }} />
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatRelative(parcel.updatedAt, lang)}</span>
          <span className="inline-flex items-center gap-1 font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            {dict.parcel.view} <ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
