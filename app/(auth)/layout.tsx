import Link from "next/link";
import { AuthPanel } from "@/components/auth/auth-panel";
import { Logo } from "@/components/brand/logo";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="relative flex flex-col">
        <div className="bg-mesh pointer-events-none absolute inset-0 opacity-60 lg:opacity-40" />
        <header className="relative flex h-16 items-center justify-between px-4 sm:px-8">
          <Link href="/" className="rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
            <Logo />
          </Link>
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
        <main className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-[400px]">{children}</div>
        </main>
      </div>
      <AuthPanel />
    </div>
  );
}
