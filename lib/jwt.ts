import type { Role } from "./types";

export interface TokenPayload {
  id: string;
  role: Role;
  exp: number;
}

// Reads the JWT payload without verifying it. Only used for routing decisions;
// the backend verifies the signature on every request.
export function decodeToken(token: string | undefined | null): TokenPayload | null {
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "=");
    const payload = JSON.parse(atob(base64)) as TokenPayload;
    if (!payload?.role || typeof payload.exp !== "number") return null;
    if (payload.exp * 1000 <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function homeForRole(role: Role | undefined): string {
  if (role === "admin") return "/admin";
  if (role === "courier") return "/courier";
  return "/dashboard";
}
