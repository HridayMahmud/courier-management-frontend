"use client";

import { ArrowLeft, ExternalLink, PackageX } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ParcelActions } from "@/components/admin/parcel-actions";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ParcelInfo } from "@/components/parcels/parcel-info";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProgressStepper } from "@/components/tracking/progress-stepper";
import { StatusTimeline } from "@/components/tracking/status-timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useParcel } from "@/hooks/use-parcels";
import { useI18n } from "@/lib/i18n";

export default function AdminParcelPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { dict } = useI18n();
  const { data: parcel, isPending, isError } = useParcel(id);

  const back = (
    <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4 text-muted-foreground">
      <Link href="/admin/parcels">
        <ArrowLeft data-icon="inline-start" /> {dict.nav.allParcels}
      </Link>
    </Button>
  );

  if (isPending) {
    return (
      <>
        {back}
        <Skeleton className="mb-6 h-16 w-2/3 rounded-xl" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </>
    );
  }

  if (isError || !parcel) {
    return (
      <>
        {back}
        <EmptyState icon={PackageX} title={dict.customer.detail.notFound} text={dict.customer.detail.notFoundText} />
      </>
    );
  }

  return (
    <>
      {back}
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{parcel.title}</h1>
            <StatusBadge status={parcel.status} withIcon />
          </div>
          <p className="flex flex-wrap items-center gap-3 font-mono text-sm tracking-wider text-muted-foreground">
            {parcel.trackingId ?? "—"}
            {parcel.trackingId && (
              <Link href={`/track/${parcel.trackingId}`} target="_blank" className="inline-flex items-center gap-1 font-sans text-xs tracking-normal text-primary hover:underline">
                <ExternalLink className="size-3.5" /> {dict.parcel.trackPublic}
              </Link>
            )}
          </p>
        </div>
        <ParcelActions parcel={parcel} variant="buttons" onDeleted={() => router.replace("/admin/parcels")} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <ParcelInfo parcel={parcel} showSender />
        <div className="space-y-5">
          {parcel.status !== "cancelled" && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">{dict.track.progress}</CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressStepper status={parcel.status} />
              </CardContent>
            </Card>
          )}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">{dict.track.timeline}</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusTimeline status={parcel.status} history={parcel.statusHistory} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
