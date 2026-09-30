import { NextResponse, type NextRequest } from "next/server";
import { TOKEN_COOKIE } from "@/lib/config";
import { decodeToken, homeForRole } from "@/lib/jwt";
import type { Role } from "@/lib/types";

// Which role may open which area. The API still checks permissions on every call.
const AREAS: { prefix: string; role: Role }[] = [
  { prefix: "/admin", role: "admin" },
  { prefix: "/courier", role: "courier" },
  { prefix: "/dashboard", role: "customer" },
];
const AUTH_PAGES = ["/login", "/register", "/forgot-password", "/reset-password"];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  const payload = decodeToken(token);

  // account settings: any signed-in role
  if (pathname === "/account" || pathname.startsWith("/account/")) {
    if (payload) return NextResponse.next();
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const area = AREAS.find((a) => pathname === a.prefix || pathname.startsWith(`${a.prefix}/`));
  if (area) {
    if (!payload) {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", pathname + search);
      if (token) url.searchParams.set("expired", "1");
      const res = NextResponse.redirect(url);
      if (token) res.cookies.delete(TOKEN_COOKIE);
      return res;
    }
    if (payload.role !== area.role) {
      return NextResponse.redirect(new URL(homeForRole(payload.role), req.url));
    }
    return NextResponse.next();
  }

  // already signed in: skip login/register pages
  if (payload && AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL(homeForRole(payload.role), req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/courier/:path*", "/dashboard/:path*", "/account", "/login", "/register", "/forgot-password", "/reset-password"],
};
