"use client";

import { cn } from "cn";
import { CircleCheckBig, PackageCheck, Truck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { DeliveryCard } from "@/components/courier/delivery-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/hooks/use-auth";
import { useMounted } from "@/hooks/use-mounted";
import { useAssignedParcels } from "@/hooks/use-parcels";
import { formatNumber } from "@/lib/format";
import { fmt, useI18n } from "@/lib/i18n";
import { DELIVERY_FLOW } from "@/lib/status";

const ON_ROAD = new Set(["picked_up", "in_transit", "out_for_delivery"]);
const DONE = new Set(["delivered", "cancelled"]);

export default function CourierPage() {
  const { dict, lang } = useI18n();
  const t = dict.courier;
  const mounted = useMounted();
  const { data: me } = useMe();
  const { data, isPending } = useAssignedParcels();
  const [tab, setTab] = useState<"active" | "done">("active");

  const all = data ?? [];
  // furthest along first: the parcel closest to the door is the next job
  const active = all
    .filter((p) => !DONE.has(p.status))
    .sort((a, b) => DELIVERY_FLOW.indexOf(b.status) - DELIVERY_FLOW.indexOf(a.status));
  const done = all.filter((p) => DONE.has(p.status));
  const list = tab === "active" ? active : done;
  const firstName = mounted && me ? me.name.split(" ")[0] : "";

  return (
    <>
      <PageHeader title={firstName ? fmt(t.greeting, { name: firstName }) : dict.nav.deliveries} description={t.subtitle} />

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard label={t.stats.toPickup} value={all.filter((p) => p.status === "pending").length} icon={PackageCheck} tint="amber" loading={isPending} compact />
        <StatCard label={t.stats.onRoute} value={all.filter((p) => ON_ROAD.has(p.status)).length} icon={Truck} tint="blue" loading={isPending} compact />
        <StatCard label={t.stats.delivered} value={all.filter((p) => p.status === "delivered").length} icon={CircleCheckBig} tint="emerald" loading={isPending} compact />
      </div>

      <div role="tablist" className="mt-8 mb-5 inline-flex rounded-xl border bg-card p-1">
        {(["active", "done"] as const).map((key) => {
          const count = key === "active" ? active.length : done.length;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={cn(
                "relative rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
                tab === key ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab === key && <motion.span layoutId="courier-tab" className="absolute inset-0 rounded-lg bg-primary" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <span className="relative">
                {t.tabs[key]} · {formatNumber(count, lang)}
              </span>
            </button>
          );
        })}
      </div>

      {isPending ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <EmptyState icon={tab === "active" ? Truck : CircleCheckBig} title={tab === "active" ? t.emptyActive : t.emptyDone} text={tab === "active" ? t.emptyActiveText : undefined} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence initial={false} mode="popLayout">
            {list.map((p) => (
              <motion.div key={p._id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <DeliveryCard parcel={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
