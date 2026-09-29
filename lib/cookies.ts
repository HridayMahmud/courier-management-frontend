// Browser-side cookie helpers (the token cookie is read by middleware for route protection).

export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

export function setCookie(name: string, value: string, maxAgeSeconds: number) {
  const secure = location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; samesite=lax${secure}`;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}
