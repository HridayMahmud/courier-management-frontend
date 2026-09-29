"use client";

import { ArrowRight, CircleCheckBig, Clock3, Package, Truck } from "lucide-react";
import Link from "next/link";
import { DailyChart } from "@/components/admin/daily-chart";
import { StatusBreakdown } from "@/components/admin/status-breakdown";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStats } from "@/hooks/use-parcels";
import { formatNumber, formatRelative } from "@/lib/format";
import { fmt, useI18n } from "@/lib/i18n";
import type { UserRef } from "@/lib/types";

export default function AdminOverview() {
  const { dict, lang } = useI18n();
  const t = dict.admin;
  const { data, isPending } = useStats();
  const n = (v: number) => formatNumber(v, lang);

  const by = data?.byStatus;
  const active = by ? by.picked_up + by.in_transit + by.out_for_delivery : 0;
  const deliveredRate = data && data.total ? Math.round((by!.delivered / data.total) * 100) : 0;
  const last30 = data?.daily.reduce((sum, d) => sum + d.count, 0) ?? 0;

  return (
    <>
      <PageHeader title={dict.nav.overview} description={t.overviewSubtitle} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label={t.kpi.total} value={data?.total ?? 0} icon={Package} tint="indigo" loading={isPending} hint={data && fmt(t.kpiHint.customers, { count: n(data.users.customers) })} />
        <StatCard label={t.kpi.active} value={active} icon={Truck} tint="blue" loading={isPending} hint={data && fmt(t.kpiHint.couriers, { count: n(data.users.couriers) })} />
        <StatCard label={t.kpi.delivered} value={by?.delivered ?? 0} icon={CircleCheckBig} tint="emerald" loading={isPending} hint={data && fmt(t.kpiHint.rate, { rate: n(deliveredRate) })} />
        <StatCard label={t.kpi.pending} value={by?.pending ?? 0} icon={Clock3} tint="amber" loading={isPending} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>{t.dailyTitle}</CardTitle>
              <CardDescription>{t.dailySubtitle}</CardDescription>
            </div>
            {data && <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{fmt(t.dailyTotal, { count: n(last30) })}</span>}
          </CardHeader>
          <CardContent>{isPending ? <Skeleton className="h-64 rounded-xl" /> : data && <DailyChart data={data.daily} />}</CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>{t.statusTitle}</CardTitle>
            <CardDescription>{t.statusSubtitle}</CardDescription>
          </CardHeader>
          <CardContent>{isPending ? <Skeleton className="h-64 rounded-xl" /> : data && <StatusBreakdown counts={data.byStatus} total={data.total} />}</CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t.recentTitle}</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/parcels">
              {t.viewAll} <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="px-0">
          {isPending ? (
            <div className="space-y-2 px-6">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-12 rounded-xl" />
              ))}
            </div>
          ) : !data?.recent.length ? (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">{t.noData}</p>
          ) : (
            <ul className="divide-y">
              {data.recent.map((p) => {
                const customer = typeof p.userId === "object" ? (p.userId as UserRef) : null;
                return (
                  <li key={p._id}>
                    <Link href={`/admin/parcels/${p._id}`} className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-accent/40">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{p.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          <span className="font-mono">{p.trackingId}</span> · {customer?.name ?? "—"}
                        </p>
                      </div>
                      <span className="hidden text-xs text-muted-foreground sm:block">{formatRelative(p.createdAt, lang)}</span>
                      <StatusBadge status={p.status} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
}
