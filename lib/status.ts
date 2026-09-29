import { CircleCheckBig, Clock3, MapPinned, PackageCheck, Truck, XCircle, type LucideIcon } from "lucide-react";
import type { ParcelStatus } from "./types";

// Delivery order shown on timelines; cancelled sits outside the flow.
export const DELIVERY_FLOW: ParcelStatus[] = ["pending", "picked_up", "in_transit", "out_for_delivery", "delivered"];

export const STATUS_META: Record<ParcelStatus, { icon: LucideIcon; badge: string; dot: string; chart: string }> = {
  pending: {
    icon: Clock3,
    badge: "bg-amber-500/12 text-amber-700 ring-amber-500/25 dark:text-amber-300",
    dot: "bg-[var(--status-pending)]",
    chart: "var(--status-pending)",
  },
  picked_up: {
    icon: PackageCheck,
    badge: "bg-pink-500/12 text-pink-700 ring-pink-500/25 dark:text-pink-300",
    dot: "bg-[var(--status-picked-up)]",
    chart: "var(--status-picked-up)",
  },
  in_transit: {
    icon: Truck,
    badge: "bg-blue-500/12 text-blue-700 ring-blue-500/25 dark:text-blue-300",
    dot: "bg-[var(--status-in-transit)]",
    chart: "var(--status-in-transit)",
  },
  out_for_delivery: {
    icon: MapPinned,
    badge: "bg-teal-500/12 text-teal-700 ring-teal-500/25 dark:text-teal-300",
    dot: "bg-[var(--status-out-for-delivery)]",
    chart: "var(--status-out-for-delivery)",
  },
  delivered: {
    icon: CircleCheckBig,
    badge: "bg-green-600/12 text-green-800 ring-green-600/25 dark:text-green-300",
    dot: "bg-[var(--status-delivered)]",
    chart: "var(--status-delivered)",
  },
  cancelled: {
    icon: XCircle,
    badge: "bg-red-500/12 text-red-700 ring-red-500/25 dark:text-red-300",
    dot: "bg-[var(--status-cancelled)]",
    chart: "var(--status-cancelled)",
  },
};

// 0..100 progress along the delivery flow
export function statusProgress(status: ParcelStatus) {
  if (status === "cancelled") return 0;
  return Math.round((DELIVERY_FLOW.indexOf(status) / (DELIVERY_FLOW.length - 1)) * 100);
}
