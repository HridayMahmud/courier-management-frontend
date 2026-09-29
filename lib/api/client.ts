import axios, { AxiosError } from "axios";
import { API_URL, LANG_COOKIE, TOKEN_COOKIE } from "@/lib/config";
import { deleteCookie, getCookie } from "@/lib/cookies";

export const api = axios.create({ baseURL: `${API_URL}/api`, timeout: 20000 });

api.interceptors.request.use((config) => {
  const token = getCookie(TOKEN_COOKIE);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers["Accept-Language"] = getCookie(LANG_COOKIE) ?? "en";
  return config;
});

// An expired or invalid token on a protected call sends the user back to login.
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const hadToken = !!getCookie(TOKEN_COOKIE);
    const isAuthCall = error.config?.url?.startsWith("/auth/login");
    if (error.response?.status === 401 && hadToken && !isAuthCall && typeof window !== "undefined") {
      deleteCookie(TOKEN_COOKIE);
      const next = encodeURIComponent(location.pathname + location.search);
      location.href = `/login?expired=1&next=${next}`;
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    if (message) return message;
    if (!error.response) return "Cannot reach the server. Check your connection.";
  }
  return fallback;
}
