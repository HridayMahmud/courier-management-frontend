import { LayoutDashboard, Package, PackagePlus, Truck, Users, type LucideIcon } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/en";
import type { Role } from "@/lib/types";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export function navForRole(role: Role, dict: Dictionary): NavItem[] {
  if (role === "admin") {
    return [
      { href: "/admin", label: dict.nav.overview, icon: LayoutDashboard, exact: true },
      { href: "/admin/parcels", label: dict.nav.allParcels, icon: Package },
      { href: "/admin/couriers", label: dict.nav.couriers, icon: Users },
    ];
  }
  if (role === "courier") {
    return [{ href: "/courier", label: dict.nav.deliveries, icon: Truck, exact: true }];
  }
  return [
    { href: "/dashboard", label: dict.nav.overview, icon: LayoutDashboard, exact: true },
    { href: "/dashboard/parcels", label: dict.nav.myParcels, icon: Package, exact: true },
    { href: "/dashboard/parcels/new", label: dict.nav.newParcel, icon: PackagePlus },
  ];
}

// the area a path belongs to decides which menu is shown (middleware already checked the role)
export function roleForPath(pathname: string): Role {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/courier")) return "courier";
  return "customer";
}

export function isActive(item: NavItem, pathname: string) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}
