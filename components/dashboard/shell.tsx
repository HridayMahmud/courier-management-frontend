"use client";

import { LogOut, Menu, UserCog } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "cn";
import { Logo } from "@/components/brand/logo";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogout, useMe } from "@/hooks/use-auth";
import { TOKEN_COOKIE } from "@/lib/config";
import { getCookie } from "@/lib/cookies";
import { decodeToken } from "@/lib/jwt";
import { useMounted } from "@/hooks/use-mounted";
import { useI18n } from "@/lib/i18n";
import { isActive, navForRole, roleForPath, type NavItem } from "./nav";

function initials(name?: string) {
  return (name ?? "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function NavLinks({ items, pathname, onNavigate }: { items: NavItem[]; pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = isActive(item, pathname);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="nav-active"
                className="absolute inset-0 rounded-xl bg-sidebar-accent"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <Icon className="relative size-4.5" />
            <span className="relative">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { dict } = useI18n();
  const mounted = useMounted();
  const { data } = useMe();
  const me = mounted ? data : undefined;
  const logout = useLogout();
  const [mobileOpen, setMobileOpen] = useState(false);

  const tokenRole = mounted ? decodeToken(getCookie(TOKEN_COOKIE))?.role : undefined;
  const role = me?.role ?? (pathname.startsWith("/account") ? tokenRole : undefined) ?? roleForPath(pathname);
  const items = navForRole(role, dict);

  const userMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2.5 rounded-xl p-1 pr-2 text-left transition-colors outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary/12 text-xs font-semibold text-primary">{initials(me?.name)}</AvatarFallback>
          </Avatar>
          <span className="hidden flex-col leading-tight sm:flex">
            {me ? <span className="text-sm font-medium">{me.name}</span> : <Skeleton className="h-3.5 w-24" />}
            <span className="text-xs text-muted-foreground">{dict.roles[role]}</span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="truncate text-sm font-medium text-foreground">{me?.name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{me?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">
            <UserCog /> {dict.account.menu}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect={logout}>
          <LogOut /> {dict.common.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="min-h-dvh bg-background">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-sidebar lg:flex">
        <div className="flex h-16 items-center px-5">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{dict.roles[role]}</p>
          <NavLinks items={items} pathname={pathname} />
        </div>
        <div className="border-t p-3">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" size="lg" onClick={logout}>
            <LogOut className="size-4" /> {dict.common.signOut}
          </Button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="glass sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label={dict.nav.menu}>
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar">
                <SheetHeader>
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <div className="px-3">
                  <NavLinks items={items} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/" className="lg:hidden">
              <Logo className="[&>span:last-child]:hidden sm:[&>span:last-child]:inline" />
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
            <div className="ml-1">{userMenu}</div>
          </div>
        </header>

        {/* enter-only transition: an exit phase would mount the next page twice and drop its state */}
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
