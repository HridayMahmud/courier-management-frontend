"use client";

import { AnimatePresence, motion } from "motion/react";
import { MessageSquarePlus, Phone, Scale } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateStatus } from "@/hooks/use-parcels";
import { getErrorMessage } from "@/lib/api/client";
import { formatNumber, formatRelative } from "@/lib/format";
import { fmt, useI18n } from "@/lib/i18n";
import { DELIVERY_FLOW, STATUS_META, statusProgress } from "@/lib/status";
import type { Parcel } from "@/lib/types";

type NextStatus = "picked_up" | "in_transit" | "out_for_delivery" | "delivered";

function nextStatus(parcel: Parcel): NextStatus | null {
  const i = DELIVERY_FLOW.indexOf(parcel.status);
  if (i < 0 || i >= DELIVERY_FLOW.length - 1) return null;
  return DELIVERY_FLOW[i + 1] as NextStatus;
}

export function DeliveryCard({ parcel }: { parcel: Parcel }) {
  const { dict, lang } = useI18n();
  const t = dict.courier;
  const update = useUpdateStatus();
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const next = nextStatus(parcel);
  const NextIcon = next ? STATUS_META[next].icon : null;

  const advance = () => {
    if (!next) return;
    update.mutate(
      { id: parcel._id, status: next, note: note.trim() || undefined },
      {
        onSuccess: () => {
          toast.success(fmt(t.updated, { status: dict.status[next] }));
          setNote("");
          setNoteOpen(false);
          setConfirmOpen(false);
        },
        onError: (e) => toast.error(getErrorMessage(e)),
      },
    );
  };

  return (
    <motion.article layout className="flex h-full flex-col rounded-2xl border bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{parcel.title}</h3>
          <p className="font-mono text-xs tracking-wide text-muted-foreground">{parcel.trackingId}</p>
        </div>
        <StatusBadge status={parcel.status} withIcon />
      </div>

      {parcel.status !== "cancelled" && (
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: STATUS_META[parcel.status].chart }}
            initial={false}
            animate={{ width: `${statusProgress(parcel.status)}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      )}

      <ol className="relative mt-5 space-y-4 pl-6">
        <span className="absolute top-2 bottom-2 left-[5px] w-0.5 bg-[repeating-linear-gradient(180deg,var(--border)_0_4px,transparent_4px_8px)]" />
        <li className="relative">
          <span className="absolute top-1.5 -left-6 size-3 rounded-full bg-primary ring-4 ring-primary/15" />
          <p className="text-xs text-muted-foreground">{t.pickupFrom}</p>
          <p className="text-sm font-medium">{parcel.pickupAddress || "—"}</p>
        </li>
        <li className="relative">
          <span className="absolute top-1.5 -left-6 size-3 rounded-full bg-amber-500 ring-4 ring-amber-500/15" />
          <p className="text-xs text-muted-foreground">{t.deliverTo}</p>
          <p className="text-sm font-medium">{parcel.address}</p>
          <p className="text-sm text-muted-foreground">{parcel.receiverName}</p>
        </li>
      </ol>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {parcel.weight != null && (
          <span className="inline-flex items-center gap-1.5">
            <Scale className="size-3.5" /> {formatNumber(parcel.weight, lang)} {dict.common.kg}
          </span>
        )}
        <span>{fmt(t.lastUpdate, { time: formatRelative(parcel.updatedAt, lang) })}</span>
      </div>

      <AnimatePresence initial={false}>
        {noteOpen && next && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.notePlaceholder}
              aria-label={t.addNote}
              maxLength={200}
              className="mt-4 rounded-xl"
              autoFocus
            />
          </motion.div>
        )}
      </AnimatePresence>

      {(next || parcel.receiverPhone) && (
        <div className="mt-auto flex gap-2 pt-5">
          {parcel.receiverPhone && (
            <Button asChild variant="outline" size="icon-lg" className="size-11 shrink-0 rounded-xl" aria-label={t.call}>
              <a href={`tel:${parcel.receiverPhone}`}>
                <Phone />
              </a>
            </Button>
          )}
          {next && (
            <>
              <Button variant="outline" size="icon-lg" className="size-11 shrink-0 rounded-xl" aria-label={t.addNote} aria-pressed={noteOpen} onClick={() => setNoteOpen((v) => !v)}>
                <MessageSquarePlus />
              </Button>
              <Button size="xl" className="flex-1" disabled={update.isPending} onClick={() => (next === "delivered" ? setConfirmOpen(true) : advance())}>
                {update.isPending ? <Spinner /> : NextIcon && <NextIcon data-icon="inline-start" />}
                {t.next[next]}
              </Button>
            </>
          )}
        </div>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.confirmDeliveredTitle}</AlertDialogTitle>
            <AlertDialogDescription>{fmt(t.confirmDeliveredText, { name: parcel.receiverName || "—" })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{dict.common.cancel}</AlertDialogCancel>
            <Button disabled={update.isPending} onClick={advance}>
              {update.isPending && <Spinner />} {t.confirm}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.article>
  );
}
