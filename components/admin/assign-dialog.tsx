"use client";

import { cn } from "cn";
import { Check, UserX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useAssignCourier, useCouriers } from "@/hooks/use-parcels";
import { getErrorMessage } from "@/lib/api/client";
import { formatNumber } from "@/lib/format";
import { fmt, useI18n } from "@/lib/i18n";
import type { Parcel } from "@/lib/types";

export function initials(name?: string) {
  return (name ?? "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function AssignDialog({ parcel, open, onOpenChange }: { parcel: Parcel; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { dict, lang } = useI18n();
  const t = dict.admin.assignDialog;
  const currentId = parcel.assignedCourier ? (typeof parcel.assignedCourier === "object" ? parcel.assignedCourier._id : parcel.assignedCourier) : null;
  const [selected, setSelected] = useState<string | null>(null);
  const couriers = useCouriers();
  const assign = useAssignCourier();
  const choice = selected ?? currentId;

  const close = (v: boolean) => {
    if (!v) {
      setSelected(null);
      assign.reset();
    }
    onOpenChange(v);
  };

  const submit = (courierId: string | null) =>
    assign.mutate(
      { id: parcel._id, courierId },
      {
        onSuccess: () => {
          toast.success(courierId ? t.saved : t.removed);
          close(false);
        },
      },
    );

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>
        <div role="radiogroup" aria-label={t.title} className="max-h-80 space-y-2 overflow-y-auto">
          {couriers.isPending &&
            [0, 1, 2].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
          {couriers.data?.length === 0 && <p className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">{t.none}</p>}
          {couriers.data?.map((c) => {
            const active = choice === c._id;
            return (
              <button
                key={c._id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSelected(c._id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all",
                  active ? "border-primary bg-primary/8 ring-3 ring-primary/20" : "hover:border-primary/40 hover:bg-accent/50",
                )}
              >
                <Avatar className="size-9">
                  <AvatarFallback className="bg-primary/12 text-xs font-semibold text-primary">{initials(c.name)}</AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{c.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{c.email}</span>
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground tabular-nums">
                  {fmt(t.active, { count: formatNumber(c.activeParcels, lang) })}
                </span>
                {active && <Check className="size-4 text-primary" />}
              </button>
            );
          })}
        </div>
        {assign.isError && <p className="text-sm text-destructive">{getErrorMessage(assign.error)}</p>}
        <DialogFooter className="sm:justify-between">
          {currentId ? (
            <Button variant="ghost" size="lg" className="text-destructive" disabled={assign.isPending} onClick={() => submit(null)}>
              <UserX data-icon="inline-start" /> {dict.admin.unassign}
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="lg" onClick={() => close(false)}>
              {dict.common.cancel}
            </Button>
            <Button size="lg" disabled={!choice || choice === currentId || assign.isPending} onClick={() => choice && submit(choice)}>
              {assign.isPending && <Spinner />} {t.save}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
