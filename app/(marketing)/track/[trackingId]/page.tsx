"use client";

import { useParams } from "next/navigation";
import { TrackingResult } from "@/components/tracking/tracking-result";
import { normalizeTrackingId } from "@/lib/format";

export default function TrackingResultPage() {
  const params = useParams<{ trackingId: string }>();
  const trackingId = normalizeTrackingId(decodeURIComponent(params.trackingId ?? ""));
  return (
    <section className="relative">
      <div className="bg-mesh pointer-events-none absolute inset-x-0 top-0 h-80 opacity-70" />
      <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <TrackingResult trackingId={trackingId} />
      </div>
    </section>
  );
}
