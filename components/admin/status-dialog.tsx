"use client";

import { cn } from "cn";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateStatus } from "@/hooks/use-parcels";
import { getErrorMessage } from "@/lib/api/client";
import { useI18n } from "@/lib/i18n";
import { STATUS_META } from "@/lib/status";
import { PARCEL_STATUSES, type Parcel, type ParcelStatus } from "@/lib/types";

// Status picker as a grid of labelled options (icon + name), current status marked.
export function StatusDialog({
  parcel,
  open,
  onOpenChange,
  allowed = PARCEL_STATUSES,
}: {
  parcel: Pick<Parcel, "_id" | "status" | "trackingId">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allowed?: readonly ParcelStatus[];
}) {
  const { dict } = useI18n();
  const t = dict.admin.statusDialog;
  const [status, setStatus] = useState<ParcelStatus | null>(null);
  const [note, setNote] = useState("");
  const update = useUpdateStatus();

  const close = (v: boolean) => {
    if (!v) {
      setStatus(null);
      setNote("");
      update.reset();
    }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>
            <span className="font-mono">{parcel.trackingId}</span> · {t.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>{t.newStatus}</Label>
            <div role="radiogroup" aria-label={t.newStatus} className="grid grid-cols-2 gap-2">
              {allowed.map((s) => {
                const Icon = STATUS_META[s].icon;
                const current = s === parcel.status;
                return (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={status === s}
                    disabled={current}
                    onClick={() => setStatus(s)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border p-3 text-left text-sm transition-all",
                      status === s ? "border-primary bg-primary/8 ring-3 ring-primary/20" : "hover:border-primary/40 hover:bg-accent/50",
                      current && "cursor-not-allowed opacity-60",
                    )}
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: `color-mix(in oklch, ${STATUS_META[s].chart} 16%, transparent)`, color: STATUS_META[s].chart }}>
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-medium">{dict.status[s]}</span>
                      {current && <span className="block text-xs text-muted-foreground">{t.current}</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status-note">{t.note}</Label>
            <Textarea id="status-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder={t.notePlaceholder} maxLength={200} className="rounded-xl" />
          </div>
          {status && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <StatusBadge status={parcel.status} /> → <StatusBadge status={status} />
            </p>
          )}
          {update.isError && <p className="text-sm text-destructive">{getErrorMessage(update.error)}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" size="lg" onClick={() => close(false)}>
            {dict.common.cancel}
          </Button>
          <Button
            size="lg"
            disabled={!status || update.isPending}
            onClick={() =>
              status &&
              update.mutate(
                { id: parcel._id, status, note: note.trim() || undefined },
                {
                  onSuccess: () => {
                    toast.success(t.saved);
                    close(false);
                  },
                },
              )
            }
          >
            {update.isPending && <Spinner />} {t.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
