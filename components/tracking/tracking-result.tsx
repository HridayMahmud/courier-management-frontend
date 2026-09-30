"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AlertTriangle, CalendarDays, Check, CircleCheckBig, Clock, Copy, PackageX, Scale, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { StatusBadge } from "@/components/shared/status-badge";
import { TrackForm } from "@/components/shared/track-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api/client";
import { parcelApi } from "@/lib/api/endpoints";
import { formatDate, formatDateTime, formatNumber, formatRelative } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { ProgressStepper } from "./progress-stepper";
import { StatusTimeline } from "./status-timeline";

function CopyButton({ text }: { text: string }) {
  const { dict } = useI18n();
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={async () => {
        await navigator.clipboard?.writeText(text).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check data-icon="inline-start" className="text-emerald-500" /> : <Copy data-icon="inline-start" />}
      {copied ? dict.track.copied : dict.track.copy}
    </Button>
  );
}

function ResultSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-40 rounded-2xl" />
      <Skeleton className="h-28 rounded-2xl" />
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  );
}

function Message({ icon: Icon, title, text, tone }: { icon: typeof PackageX; title: string; text: string; tone: "muted" | "error" }) {
  return (
    <Card className="shadow-soft">
      <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
        <span className={tone === "error" ? "grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive" : "grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground"}>
          <Icon className="size-7" />
        </span>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="max-w-sm text-sm text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  );
}

export function TrackingResult({ trackingId }: { trackingId: string }) {
  const { dict, lang } = useI18n();
  const t = dict.track;
  const query = useQuery({
    queryKey: ["track", trackingId],
    queryFn: () => parcelApi.track(trackingId),
    retry: false,
    refetchInterval: 60_000,
  });

  const notFound = axios.isAxiosError(query.error) && query.error.response?.status === 404;
  const data = query.data;

  return (
    <div className="space-y-6">
      <TrackForm defaultValue={trackingId} size="md" />

      {query.isPending && <ResultSkeleton />}
      {notFound && <Message icon={PackageX} title={t.notFoundTitle} text={t.notFoundText} tone="muted" />}
      {query.isError && !notFound && <Message icon={AlertTriangle} title={t.errorTitle} text={getErrorMessage(query.error)} tone="error" />}

      {data && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <Card className="overflow-hidden shadow-soft">
            <div className="h-1.5 bg-gradient-to-r from-primary via-chart-5 to-highlight" />
            <CardContent className="space-y-6 pt-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{t.trackingId}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <p className="font-mono text-2xl font-semibold tracking-wider sm:text-3xl">{data.trackingId}</p>
                    <CopyButton text={data.trackingId} />
                  </div>
                </div>
                <div className="sm:text-right">
                  <p className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">{t.currentStatus}</p>
                  <StatusBadge status={data.status} withIcon className="px-3 py-1 text-sm" />
                </div>
              </div>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                  <CalendarDays className="size-4.5 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">{t.booked}</dt>
                    <dd className="text-sm font-medium">{formatDate(data.createdAt, lang)}</dd>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                  <Clock className="size-4.5 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">{t.lastUpdate}</dt>
                    <dd className="text-sm font-medium" title={formatDateTime(data.updatedAt, lang)}>
                      {formatRelative(data.updatedAt, lang)}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                  <Scale className="size-4.5 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">{t.weight}</dt>
                    <dd className="text-sm font-medium">{data.weight != null ? `${formatNumber(data.weight, lang)} ${dict.common.kg}` : "—"}</dd>
                  </div>
                </div>
              </dl>
            </CardContent>
          </Card>

          {data.status === "cancelled" ? (
            <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300">
              <XCircle className="size-5 shrink-0" /> {t.cancelledText}
            </div>
          ) : (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">{t.progress}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProgressStepper status={data.status} />
                {data.status === "delivered" && (
                  <p className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
                    <CircleCheckBig className="size-4.5" /> {t.deliveredText}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">{t.timeline}</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusTimeline status={data.status} history={data.statusHistory} />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
