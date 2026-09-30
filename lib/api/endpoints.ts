import { api } from "./client";
import type {
  Courier,
  Paginated,
  Parcel,
  ParcelInput,
  ParcelStatus,
  PublicTracking,
  Role,
  Stats,
  User,
} from "@/lib/types";

export const authApi = {
  login: (body: { email: string; password: string }) =>
    api.post<{ token: string; user: Role; message: string }>("/auth/login", body).then((r) => r.data),
  register: (body: { name: string; email: string; password: string }) =>
    api.post<{ message: string; User: User }>("/auth/register", body).then((r) => r.data),
  forgotPassword: (body: { email: string }) =>
    api.post<{ message: string }>("/auth/forgot-password", body).then((r) => r.data),
  resetPassword: (body: { email: string; token: string; password: string }) =>
    api.post<{ message: string }>("/auth/reset-password", body).then((r) => r.data),
  me: () => api.get<{ user: User }>("/auth/me").then((r) => r.data.user),
  updateMe: (body: { name: string }) => api.patch<{ message: string; user: User }>("/auth/me", body).then((r) => r.data),
  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    api.patch<{ message: string }>("/auth/password", body).then((r) => r.data),
};

export interface ParcelListParams {
  page?: number;
  limit?: number;
  status?: ParcelStatus | "";
  search?: string;
}

export const parcelApi = {
  mine: () => api.get<Parcel[]>("/parcel/user-parcel").then((r) => r.data),
  get: (id: string) => api.get<Parcel>(`/parcel/${id}`).then((r) => r.data),
  create: (body: ParcelInput) =>
    api.post<{ message: string; parcel: Parcel }>("/parcel/create-parcel", body).then((r) => r.data),
  update: (id: string, body: Partial<ParcelInput>) =>
    api.put<{ message: string; parcel: Parcel }>(`/parcel/update-parcel/${id}`, body).then((r) => r.data),
  remove: (id: string) => api.delete<{ message: string }>(`/parcel/delete-parcel/${id}`).then((r) => r.data),
  cancel: (id: string, reason?: string) =>
    api.patch<{ message: string; parcel: Parcel }>(`/parcel/${id}/cancel`, { reason }).then((r) => r.data),
  updateStatus: (id: string, status: ParcelStatus, note?: string) =>
    api.patch<{ message: string; parcel: Parcel }>(`/parcel/${id}/status`, { status, note }).then((r) => r.data),
  assign: (id: string, courierId: string | null) =>
    api.patch<{ message: string; parcel: Parcel }>(`/parcel/${id}/assign`, { courierId }).then((r) => r.data),
  list: (params: ParcelListParams) => {
    const query = Object.fromEntries(Object.entries({ page: 1, limit: 10, ...params }).filter(([, v]) => v !== "" && v !== undefined));
    return api.get<Paginated<Parcel>>("/parcel/getall-parcels", { params: query }).then((r) => r.data);
  },
  assigned: (status?: ParcelStatus) =>
    api.get<Parcel[]>("/parcel/courier/assigned", { params: status ? { status } : {} }).then((r) => r.data),
  stats: () => api.get<Stats>("/parcel/stats").then((r) => r.data),
  track: (trackingId: string) =>
    api.get<PublicTracking>(`/parcel/track/${encodeURIComponent(trackingId)}`).then((r) => r.data),
};

export const userApi = {
  list: (role?: Role) => api.get<User[]>("/users", { params: role ? { role } : {} }).then((r) => r.data),
  couriers: () => api.get<Courier[]>("/users", { params: { role: "courier" } }).then((r) => r.data),
  createCourier: (body: { name: string; email: string; password: string }) =>
    api.post<{ message: string; user: User }>("/users/courier", body).then((r) => r.data),
  resetPassword: (body: { email: string; newPassword: string }) =>
    api.patch<{ message: string; user: Pick<User, "name" | "email" | "role"> }>("/users/password", body).then((r) => r.data),
};
