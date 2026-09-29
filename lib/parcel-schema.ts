import { z } from "zod";
import { toAsciiDigits } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n/en";
import type { Parcel, ParcelInput } from "@/lib/types";

// Bangladeshi mobile: 01XXXXXXXXX, optionally with +88 / 88, spaces or dashes allowed
const BD_PHONE = /^(?:\+?88)?01[3-9]\d{8}$/;
const cleanPhone = (v: string) => toAsciiDigits(v).replace(/[\s-]/g, "");

export function parcelSchema(dict: Dictionary) {
  const e = dict.parcel.errors;
  return z.object({
    pickupAddress: z.string().trim().min(1, e.pickupRequired).min(5, e.addressMin),
    receiverName: z.string().trim().min(1, e.receiverRequired),
    receiverPhone: z.string().trim().refine((v) => BD_PHONE.test(cleanPhone(v)), e.phoneInvalid),
    address: z.string().trim().min(1, e.addressRequired).min(5, e.addressMin),
    title: z.string().trim().min(1, e.titleRequired),
    weight: z
      .string()
      .trim()
      .min(1, e.weightRequired)
      .refine((v) => {
        const n = Number(toAsciiDigits(v));
        return Number.isFinite(n) && n > 0 && n <= 100;
      }, e.weightInvalid),
  });
}

export type ParcelFormValues = z.infer<ReturnType<typeof parcelSchema>>;

export const EMPTY_PARCEL_FORM: ParcelFormValues = {
  pickupAddress: "",
  receiverName: "",
  receiverPhone: "",
  address: "",
  title: "",
  weight: "",
};

export function toParcelInput(v: ParcelFormValues): ParcelInput {
  return {
    title: v.title.trim(),
    address: v.address.trim(),
    pickupAddress: v.pickupAddress.trim(),
    receiverName: v.receiverName.trim(),
    receiverPhone: cleanPhone(v.receiverPhone),
    weight: Number(toAsciiDigits(v.weight)),
  };
}

export function fromParcel(p: Parcel): ParcelFormValues {
  return {
    title: p.title ?? "",
    address: p.address ?? "",
    pickupAddress: p.pickupAddress ?? "",
    receiverName: p.receiverName ?? "",
    receiverPhone: p.receiverPhone ?? "",
    weight: p.weight != null ? String(p.weight) : "",
  };
}
