"use client";

import { ArrowLeft, ExternalLink, Lock, PackageX, Pencil, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { CancelParcelDialog } from "@/components/parcels/cancel-parcel-dialog";
import { EditParcelDialog } from "@/components/parcels/edit-parcel-dialog";
import { ParcelInfo } from "@/components/parcels/parcel-info";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProgressStepper } from "@/components/tracking/progress-stepper";
import { StatusTimeline } from "@/components/tracking/status-timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useParcel } from "@/hooks/use-parcels";
import { useI18n } from "@/lib/i18n";

export default function CustomerParcelPage() {
  const { id } = useParams<{ id: string }>();
  const { dict } = useI18n();
  const t = dict.customer.detail;
  const { data: parcel, isPending, isError } = useParcel(id);
  const [editOpen, setEditOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const back = (
    <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4 text-muted-foreground">
      <Link href="/dashboard/parcels">
        <ArrowLeft data-icon="inline-start" /> {t.back}
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
        <EmptyState icon={PackageX} title={t.notFound} text={t.notFoundText} />
      </>
    );
  }

  const editable = parcel.status === "pending";

  return (
    <>
      {back}
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{parcel.title}</h1>
            <StatusBadge status={parcel.status} withIcon />
          </div>
          <p className="font-mono text-sm tracking-wider text-muted-foreground">{parcel.trackingId ?? "—"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {parcel.trackingId && (
            <Button asChild variant="outline" size="lg">
              <Link href={`/track/${parcel.trackingId}`} target="_blank">
                <ExternalLink data-icon="inline-start" /> {dict.parcel.trackPublic}
              </Link>
            </Button>
          )}
          {editable && (
            <>
              <Button variant="outline" size="lg" onClick={() => setEditOpen(true)}>
                <Pencil data-icon="inline-start" /> {dict.common.edit}
              </Button>
              <Button variant="destructive" size="lg" onClick={() => setCancelOpen(true)}>
                <XCircle data-icon="inline-start" /> {t.cancelAction}
              </Button>
            </>
          )}
        </div>
      </div>

      {!editable && parcel.status !== "cancelled" && parcel.status !== "delivered" && (
        <p className="mb-6 flex items-center gap-2 rounded-xl border bg-muted/40 p-3 text-sm text-muted-foreground">
          <Lock className="size-4 shrink-0" /> {t.lockedHint}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <ParcelInfo parcel={parcel} />
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

      <EditParcelDialog parcel={parcel} open={editOpen} onOpenChange={setEditOpen} />
      <CancelParcelDialog parcelId={parcel._id} open={cancelOpen} onOpenChange={setCancelOpen} />
    </>
  );
}
