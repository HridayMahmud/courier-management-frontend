"use client";

import { CalendarDays, Package, Phone, Scale, Truck, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, formatNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import type { Parcel, UserRef } from "@/lib/types";

const asUser = (v: Parcel["userId"] | Parcel["assignedCourier"]): UserRef | null => (v && typeof v === "object" ? v : null);

function Row({ icon: Icon, label, children }: { icon: typeof Package; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="text-sm font-medium break-words">{children}</div>
      </div>
    </div>
  );
}

// Route (pickup -> delivery) plus the parcel, receiver, sender and courier facts.
export function ParcelInfo({ parcel, showSender = false }: { parcel: Parcel; showSender?: boolean }) {
  const { dict, lang } = useI18n();
  const p = dict.parcel;
  const sender = asUser(parcel.userId);
  const courier = asUser(parcel.assignedCourier);

  return (
    <div className="space-y-5">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">{p.route}</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative space-y-5 pl-7">
            <span className="absolute top-2 bottom-2 left-[7px] w-0.5 bg-[repeating-linear-gradient(180deg,var(--border)_0_5px,transparent_5px_10px)]" />
            <li className="relative">
              <span className="absolute top-1 -left-7 size-4 rounded-full border-4 border-primary/30 bg-primary" />
              <p className="text-xs text-muted-foreground">{p.pickupAddress}</p>
              <p className="text-sm font-medium">{parcel.pickupAddress || "—"}</p>
            </li>
            <li className="relative">
              <span className="absolute top-1 -left-7 size-4 rounded-full border-4 border-amber-500/30 bg-amber-500" />
              <p className="text-xs text-muted-foreground">{p.address}</p>
              <p className="text-sm font-medium">{parcel.address}</p>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">{p.details}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Row icon={Package} label={p.title}>
            {parcel.title}
          </Row>
          <Row icon={Scale} label={p.weight}>
            {parcel.weight != null ? `${formatNumber(parcel.weight, lang)} ${dict.common.kg}` : "—"}
          </Row>
          <Row icon={User} label={p.receiverName}>
            {parcel.receiverName || "—"}
          </Row>
          <Row icon={Phone} label={p.receiverPhone}>
            {parcel.receiverPhone ? (
              <a href={`tel:${parcel.receiverPhone}`} className="text-primary hover:underline">
                {parcel.receiverPhone}
              </a>
            ) : (
              "—"
            )}
          </Row>
          {showSender && sender && (
            <Row icon={User} label={p.sender}>
              {sender.name}
              {sender.email && <span className="block text-xs font-normal text-muted-foreground">{sender.email}</span>}
            </Row>
          )}
          <Row icon={Truck} label={p.courier}>
            {courier ? courier.name : <span className="font-normal text-muted-foreground">{p.notAssigned}</span>}
          </Row>
          <Row icon={CalendarDays} label={p.created}>
            {formatDateTime(parcel.createdAt, lang)}
          </Row>
        </CardContent>
      </Card>
    </div>
  );
}
