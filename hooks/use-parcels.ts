"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parcelApi, userApi, type ParcelListParams } from "@/lib/api/endpoints";
import type { ParcelInput, ParcelStatus } from "@/lib/types";

export const keys = {
  mine: ["parcels", "mine"] as const,
  list: (params: ParcelListParams) => ["parcels", "list", params] as const,
  assigned: ["parcels", "assigned"] as const,
  parcel: (id: string) => ["parcel", id] as const,
  stats: ["stats"] as const,
  couriers: ["users", "couriers"] as const,
};

// ---- queries

export function useMyParcels() {
  return useQuery({ queryKey: keys.mine, queryFn: parcelApi.mine });
}

export function useParcel(id: string) {
  return useQuery({ queryKey: keys.parcel(id), queryFn: () => parcelApi.get(id), enabled: !!id, retry: false });
}

export function useParcelList(params: ParcelListParams) {
  return useQuery({ queryKey: keys.list(params), queryFn: () => parcelApi.list(params), placeholderData: keepPreviousData });
}

export function useAssignedParcels() {
  return useQuery({ queryKey: keys.assigned, queryFn: () => parcelApi.assigned(), refetchInterval: 60_000 });
}

export function useStats() {
  return useQuery({ queryKey: keys.stats, queryFn: parcelApi.stats });
}

export function useCouriers() {
  return useQuery({ queryKey: keys.couriers, queryFn: userApi.couriers });
}

// ---- mutations: every change refreshes parcel lists, the parcel itself and dashboard numbers

function useInvalidateParcels() {
  const queryClient = useQueryClient();
  return (id?: string) => {
    queryClient.invalidateQueries({ queryKey: ["parcels"] });
    queryClient.invalidateQueries({ queryKey: keys.stats });
    queryClient.invalidateQueries({ queryKey: keys.couriers });
    if (id) queryClient.invalidateQueries({ queryKey: keys.parcel(id) });
  };
}

export function useCreateParcel() {
  const invalidate = useInvalidateParcels();
  return useMutation({ mutationFn: (body: ParcelInput) => parcelApi.create(body), onSuccess: () => invalidate() });
}

export function useUpdateParcel(id: string) {
  const invalidate = useInvalidateParcels();
  return useMutation({ mutationFn: (body: Partial<ParcelInput>) => parcelApi.update(id, body), onSuccess: () => invalidate(id) });
}

export function useCancelParcel(id: string) {
  const invalidate = useInvalidateParcels();
  return useMutation({ mutationFn: (reason?: string) => parcelApi.cancel(id, reason), onSuccess: () => invalidate(id) });
}

export function useDeleteParcel() {
  const invalidate = useInvalidateParcels();
  return useMutation({ mutationFn: (id: string) => parcelApi.remove(id), onSuccess: () => invalidate() });
}

export function useUpdateStatus() {
  const invalidate = useInvalidateParcels();
  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: ParcelStatus; note?: string }) => parcelApi.updateStatus(id, status, note),
    onSuccess: (_d, vars) => invalidate(vars.id),
  });
}

export function useAssignCourier() {
  const invalidate = useInvalidateParcels();
  return useMutation({
    mutationFn: ({ id, courierId }: { id: string; courierId: string | null }) => parcelApi.assign(id, courierId),
    onSuccess: (_d, vars) => invalidate(vars.id),
  });
}

export function useCreateCourier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.createCourier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.couriers });
      queryClient.invalidateQueries({ queryKey: keys.stats });
    },
  });
}
