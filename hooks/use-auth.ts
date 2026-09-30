"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/endpoints";
import { TOKEN_COOKIE } from "@/lib/config";
import { deleteCookie, getCookie, setCookie } from "@/lib/cookies";
import { decodeToken, homeForRole } from "@/lib/jwt";

export const meKey = ["me"] as const;

export function useMe() {
  return useQuery({
    queryKey: meKey,
    queryFn: authApi.me,
    enabled: typeof document !== "undefined" && !!getCookie(TOKEN_COOKIE),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

// Stores the token, then sends the user to `next` (if it is a safe local path) or their role home.
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      const payload = decodeToken(data.token);
      const maxAge = payload ? Math.max(60, payload.exp - Math.floor(Date.now() / 1000)) : 60 * 60 * 24;
      setCookie(TOKEN_COOKIE, data.token, maxAge);
      queryClient.clear();
      const next = new URLSearchParams(location.search).get("next");
      const home = homeForRole(payload?.role ?? data.user);
      const safeNext = next && next.startsWith("/") && !next.startsWith("//") && next.startsWith(home) ? next : home;
      router.replace(safeNext);
      router.refresh();
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return () => {
    deleteCookie(TOKEN_COOKIE);
    queryClient.clear();
    router.replace("/login");
    router.refresh();
  };
}

export function useUpdateMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.updateMe,
    onSuccess: (data) => queryClient.setQueryData(meKey, data.user),
  });
}

export function useChangePassword() {
  return useMutation({ mutationFn: authApi.changePassword });
}
