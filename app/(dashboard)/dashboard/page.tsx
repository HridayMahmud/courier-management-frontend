"use client";

import { ArrowRight, CircleCheckBig, Clock3, Package, PackagePlus, Truck } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ParcelCard } from "@/components/parcels/parcel-card";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/hooks/use-auth";
import { useMounted } from "@/hooks/use-mounted";
import { useMyParcels } from "@/hooks/use-parcels";
import { fmt, useI18n } from "@/lib/i18n";

const ACTIVE = new Set(["picked_up", "in_transit", "out_for_delivery"]);

export default function CustomerOverview() {
  const { dict } = useI18n();
  const t = dict.customer;
  const mounted = useMounted();
  const { data: me } = useMe();
  const { data: parcels, isPending, isError, error, refetch } = useMyParcels();
  const list = parcels ?? [];
  const firstName = mounted && me ? me.name.split(" ")[0] : "";

  const counts = {
    total: list.length,
    active: list.filter((p) => ACTIVE.has(p.status)).length,
    delivered: list.filter((p) => p.status === "delivered").length,
    pending: list.filter((p) => p.status === "pending").length,
  };

  return (
    <>
      <PageHeader
        title={firstName ? fmt(t.welcome, { name: firstName }) : dict.nav.overview}
        description={t.welcomeSubtitle}
        actions={
          <Button asChild size="xl" className="shadow-glow">
            <Link href="/dashboard/parcels/new">
              <PackagePlus data-icon="inline-start" /> {t.newParcel}
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label={t.stats.total} value={counts.total} icon={Package} tint="indigo" loading={isPending} />
        <StatCard label={t.stats.active} value={counts.active} icon={Truck} tint="blue" loading={isPending} />
        <StatCard label={t.stats.delivered} value={counts.delivered} icon={CircleCheckBig} tint="emerald" loading={isPending} />
        <StatCard label={t.stats.pending} value={counts.pending} icon={Clock3} tint="amber" loading={isPending} />
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t.recent}</h2>
          {list.length > 0 && (
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/parcels">
                {t.viewAll} <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          )}
        </div>
        {isPending ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-52 rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState error={error} onRetry={() => refetch()} />
        ) : list.length === 0 ? (
          <EmptyState
            icon={Package}
            title={t.emptyTitle}
            text={t.emptyText}
            action={
              <Button asChild size="lg">
                <Link href="/dashboard/parcels/new">
                  <PackagePlus data-icon="inline-start" /> {t.emptyCta}
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.slice(0, 6).map((p, i) => (
              <Reveal key={p._id} delay={i * 0.05}>
                <ParcelCard parcel={p} href={`/dashboard/parcels/${p._id}`} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
