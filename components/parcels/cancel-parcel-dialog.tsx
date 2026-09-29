"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCancelParcel } from "@/hooks/use-parcels";
import { getErrorMessage } from "@/lib/api/client";
import { useI18n } from "@/lib/i18n";

export function CancelParcelDialog({ parcelId, open, onOpenChange }: { parcelId: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { dict } = useI18n();
  const t = dict.customer.detail;
  const [reason, setReason] = useState("");
  const cancel = useCancelParcel(parcelId);

  return (
    <AlertDialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setReason("");
          cancel.reset();
        }
        onOpenChange(v);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <span className="mb-2 grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-6" />
          </span>
          <AlertDialogTitle>{t.cancelTitle}</AlertDialogTitle>
          <AlertDialogDescription>{t.cancelText}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <Label htmlFor="cancel-reason">{t.cancelReason}</Label>
          <Textarea id="cancel-reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t.cancelReasonPlaceholder} maxLength={200} className="rounded-xl" />
          {cancel.isError && <p className="text-sm text-destructive">{getErrorMessage(cancel.error)}</p>}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{t.keep}</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={cancel.isPending}
            onClick={() =>
              cancel.mutate(reason.trim() || undefined, {
                onSuccess: () => {
                  toast.success(t.cancelled);
                  onOpenChange(false);
                },
              })
            }
          >
            {cancel.isPending && <Spinner />} {t.cancelConfirm}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
