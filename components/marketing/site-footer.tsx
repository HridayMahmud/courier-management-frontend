"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { dict } = useI18n();
  const columns = [
    {
      title: dict.footer.product,
      links: [
        { href: "/#features", label: dict.nav.features },
        { href: "/#how-it-works", label: dict.nav.howItWorks },
        { href: "/track", label: dict.nav.track },
      ],
    },
    {
      title: dict.footer.account,
      links: [
        { href: "/login", label: dict.common.signIn },
        { href: "/register", label: dict.common.signUp },
      ],
    },
  ];

  return (
    <footer className="border-t bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-sm space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground">{dict.footer.blurb}</p>
        </div>
        {columns.map((col) => (
          <div key={col.title} className="space-y-3">
            <h3 className="text-sm font-semibold">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} SwiftShip. {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
