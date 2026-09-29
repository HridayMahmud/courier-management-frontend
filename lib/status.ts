import { CircleCheckBig, Clock3, MapPinned, PackageCheck, Truck, XCircle, type LucideIcon } from "lucide-react";
import type { ParcelStatus } from "./types";

// Delivery order shown on timelines; cancelled sits outside the flow.
export const DELIVERY_FLOW: ParcelStatus[] = ["pending", "picked_up", "in_transit", "out_for_delivery", "delivered"];

export const STATUS_META: Record<ParcelStatus, { icon: LucideIcon; badge: string; dot: string; chart: string }> = {
  pending: {
    icon: Clock3,
    badge: "bg-amber-500/12 text-amber-700 ring-amber-500/25 dark:text-amber-300",
    dot: "bg-amber-500",
    chart: "#F59E0B",
  },
  picked_up: {
    icon: PackageCheck,
    badge: "bg-violet-500/12 text-violet-700 ring-violet-500/25 dark:text-violet-300",
    dot: "bg-violet-500",
    chart: "#8B5CF6",
  },
  in_transit: {
    icon: Truck,
    badge: "bg-blue-500/12 text-blue-700 ring-blue-500/25 dark:text-blue-300",
    dot: "bg-blue-500",
    chart: "#3B82F6",
  },
  out_for_delivery: {
    icon: MapPinned,
    badge: "bg-cyan-500/12 text-cyan-700 ring-cyan-500/25 dark:text-cyan-300",
    dot: "bg-cyan-500",
    chart: "#06B6D4",
  },
  delivered: {
    icon: CircleCheckBig,
    badge: "bg-emerald-500/12 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300",
    dot: "bg-emerald-500",
    chart: "#10B981",
  },
  cancelled: {
    icon: XCircle,
    badge: "bg-red-500/12 text-red-700 ring-red-500/25 dark:text-red-300",
    dot: "bg-red-500",
    chart: "#EF4444",
  },
};

// 0..100 progress along the delivery flow
export function statusProgress(status: ParcelStatus) {
  if (status === "cancelled") return 0;
  return Math.round((DELIVERY_FLOW.indexOf(status) / (DELIVERY_FLOW.length - 1)) * 100);
}
