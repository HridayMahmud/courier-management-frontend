"use client";

import { Eye, MoreHorizontal, Pencil, RefreshCcw, Trash2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { EditParcelDialog } from "@/components/parcels/edit-parcel-dialog";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteParcel } from "@/hooks/use-parcels";
import { getErrorMessage } from "@/lib/api/client";
import { fmt, useI18n } from "@/lib/i18n";
import type { Parcel } from "@/lib/types";
import { AssignDialog } from "./assign-dialog";
import { StatusDialog } from "./status-dialog";

type Dialog = "status" | "assign" | "edit" | "delete" | null;
const FINAL = new Set(["delivered", "cancelled"]);

// Admin actions for one parcel: a "..." menu (table rows) or a row of buttons (details page).
export function ParcelActions({ parcel, variant = "menu", onDeleted }: { parcel: Parcel; variant?: "menu" | "buttons"; onDeleted?: () => void }) {
  const { dict } = useI18n();
  const t = dict.admin;
  const [open, setOpen] = useState<Dialog>(null);
  const remove = useDeleteParcel();
  const finished = FINAL.has(parcel.status);
  const hasCourier = !!parcel.assignedCourier;
  const setDialog = (d: Dialog) => (v: boolean) => setOpen(v ? d : null);

  return (
    <>
      {variant === "menu" ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={`${t.actions} ${parcel.trackingId ?? ""}`} onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem asChild>
              <Link href={`/admin/parcels/${parcel._id}`}>
                <Eye /> {t.viewDetails}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setOpen("status")}>
              <RefreshCcw /> {t.changeStatus}
            </DropdownMenuItem>
            <DropdownMenuItem disabled={finished} onSelect={() => setOpen("assign")}>
              <UserPlus /> {hasCourier ? t.reassignCourier : t.assignCourier}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setOpen("edit")}>
              <Pencil /> {dict.common.edit}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => setOpen("delete")}>
              <Trash2 /> {t.deleteParcel}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button size="lg" onClick={() => setOpen("status")}>
            <RefreshCcw data-icon="inline-start" /> {t.changeStatus}
          </Button>
          <Button variant="outline" size="lg" disabled={finished} onClick={() => setOpen("assign")}>
            <UserPlus data-icon="inline-start" /> {hasCourier ? t.reassignCourier : t.assignCourier}
          </Button>
          <Button variant="outline" size="lg" onClick={() => setOpen("edit")}>
            <Pencil data-icon="inline-start" /> {dict.common.edit}
          </Button>
          <Button variant="destructive" size="lg" onClick={() => setOpen("delete")}>
            <Trash2 data-icon="inline-start" /> {dict.common.delete}
          </Button>
        </div>
      )}

      <StatusDialog parcel={parcel} open={open === "status"} onOpenChange={setDialog("status")} />
      <AssignDialog parcel={parcel} open={open === "assign"} onOpenChange={setDialog("assign")} />
      <EditParcelDialog parcel={parcel} open={open === "edit"} onOpenChange={setDialog("edit")} />
      <AlertDialog open={open === "delete"} onOpenChange={setDialog("delete")}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <span className="mb-2 grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
              <Trash2 className="size-6" />
            </span>
            <AlertDialogTitle>{t.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>{fmt(t.deleteText, { id: parcel.trackingId ?? parcel.title })}</AlertDialogDescription>
          </AlertDialogHeader>
          {remove.isError && <p className="text-sm text-destructive">{getErrorMessage(remove.error)}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel>{dict.common.cancel}</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={remove.isPending}
              onClick={() =>
                remove.mutate(parcel._id, {
                  onSuccess: () => {
                    toast.success(t.deleted);
                    setOpen(null);
                    onDeleted?.();
                  },
                })
              }
            >
              {remove.isPending && <Spinner />} {t.deleteConfirm}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
