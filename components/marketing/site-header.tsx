"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "cn";
import { Logo } from "@/components/brand/logo";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TOKEN_COOKIE } from "@/lib/config";
import { getCookie } from "@/lib/cookies";
import { useI18n } from "@/lib/i18n";
import { decodeToken, homeForRole } from "@/lib/jwt";

export function SiteHeader() {
  const { dict } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [home, setHome] = useState<string | null>(null);

  useEffect(() => {
    const payload = decodeToken(getCookie(TOKEN_COOKIE));
    setHome(payload ? homeForRole(payload.role) : null);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/#features", label: dict.nav.features },
    { href: "/#how-it-works", label: dict.nav.howItWorks },
    { href: "/track", label: dict.nav.track },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled ? "glass border-b shadow-soft" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
          <div className="ml-2 hidden items-center gap-2 sm:flex">
            {home ? (
              <Button asChild size="lg">
                <Link href={home}>{dict.common.dashboard}</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="lg">
                  <Link href="/login">{dict.common.signIn}</Link>
                </Button>
                <Button asChild size="lg" className="shadow-glow">
                  <Link href="/register">{dict.common.getStarted}</Link>
                </Button>
              </>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label={dict.nav.menu}>
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {links.map((l) => (
                  <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2.5 text-sm hover:bg-accent">
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 p-4">
                {home ? (
                  <Button asChild size="xl">
                    <Link href={home}>{dict.common.dashboard}</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" size="xl">
                      <Link href="/login">{dict.common.signIn}</Link>
                    </Button>
                    <Button asChild size="xl">
                      <Link href="/register">{dict.common.getStarted}</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
