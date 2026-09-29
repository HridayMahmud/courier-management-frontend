export type Role = "admin" | "customer" | "courier";

export const PARCEL_STATUSES = [
  "pending",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;
export type ParcelStatus = (typeof PARCEL_STATUSES)[number];

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface UserRef {
  _id: string;
  name: string;
  email?: string;
  role?: Role;
}

export interface StatusEvent {
  status: ParcelStatus;
  note?: string;
  at: string;
  updatedBy?: string | UserRef;
}

export interface Parcel {
  _id: string;
  trackingId?: string;
  title: string;
  address: string;
  pickupAddress?: string;
  receiverName?: string;
  receiverPhone?: string;
  weight?: number;
  status: ParcelStatus;
  statusHistory: StatusEvent[];
  userId: string | UserRef;
  assignedCourier: string | UserRef | null;
  createdAt: string;
  updatedAt: string;
}

export interface Courier extends User {
  activeParcels: number;
}

export interface PublicTracking {
  trackingId: string;
  status: ParcelStatus;
  weight?: number;
  createdAt: string;
  updatedAt: string;
  statusHistory: { status: ParcelStatus; note?: string; at: string }[];
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface Stats {
  total: number;
  byStatus: Record<ParcelStatus, number>;
  daily: { date: string; count: number }[];
  users: { customers: number; couriers: number; admins: number };
  recent: Parcel[];
}

export interface ParcelInput {
  title: string;
  address: string;
  pickupAddress?: string;
  receiverName?: string;
  receiverPhone?: string;
  weight?: number;
}
