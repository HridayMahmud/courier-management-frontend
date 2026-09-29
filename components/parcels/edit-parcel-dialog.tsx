"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Home, MapPin, Package, Phone, Scale, User } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateParcel } from "@/hooks/use-parcels";
import { getErrorMessage } from "@/lib/api/client";
import { useI18n } from "@/lib/i18n";
import { fromParcel, parcelSchema, toParcelInput, type ParcelFormValues } from "@/lib/parcel-schema";
import type { Parcel } from "@/lib/types";

export function EditParcelDialog({ parcel, open, onOpenChange }: { parcel: Parcel; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { dict } = useI18n();
  const p = dict.parcel;
  const t = dict.customer.detail;
  const schema = useMemo(() => parcelSchema(dict), [dict]);
  const update = useUpdateParcel(parcel._id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ParcelFormValues>({ resolver: zodResolver(schema), defaultValues: fromParcel(parcel) });

  // start from the latest saved values every time the dialog opens
  useEffect(() => {
    if (open) {
      reset(fromParcel(parcel));
      update.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t.editTitle}</DialogTitle>
          <DialogDescription>{t.editHint}</DialogDescription>
        </DialogHeader>
        <form
          id="edit-parcel"
          onSubmit={handleSubmit((v) =>
            update.mutate(toParcelInput(v), {
              onSuccess: () => {
                toast.success(t.saved);
                onOpenChange(false);
              },
            }),
          )}
          className="grid gap-5 sm:grid-cols-2"
          noValidate
        >
          <FormField label={p.title} icon={Package} error={errors.title?.message} {...register("title")} />
          <FormField label={p.weight} icon={Scale} inputMode="decimal" error={errors.weight?.message} {...register("weight")} />
          <FormField label={p.receiverName} icon={User} error={errors.receiverName?.message} {...register("receiverName")} />
          <FormField label={p.receiverPhone} icon={Phone} type="tel" error={errors.receiverPhone?.message} {...register("receiverPhone")} />
          <div className="sm:col-span-2">
            <FormField label={p.pickupAddress} icon={Home} error={errors.pickupAddress?.message} {...register("pickupAddress")} />
          </div>
          <div className="sm:col-span-2">
            <FormField label={p.address} icon={MapPin} error={errors.address?.message} {...register("address")} />
          </div>
          {update.isError && (
            <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive sm:col-span-2">
              <AlertCircle className="mt-0.5 size-4 shrink-0" /> {getErrorMessage(update.error)}
            </div>
          )}
        </form>
        <DialogFooter>
          <Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>
            {dict.common.cancel}
          </Button>
          <Button type="submit" form="edit-parcel" size="lg" disabled={update.isPending || !isDirty}>
            {update.isPending && <Spinner />} {dict.common.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
