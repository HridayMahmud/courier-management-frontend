"use client";

import { Home, PackageSearch, RotateCcw, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

// Full-page message used by the 404 and error screens.
export function StatusScreen({
  code,
  icon: Icon,
  title,
  text,
  onRetry,
}: {
  code?: string;
  icon: LucideIcon;
  title: string;
  text: string;
  onRetry?: () => void;
}) {
  const { dict } = useI18n();
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div className="bg-mesh pointer-events-none absolute inset-0" />
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <header className="relative flex h-16 items-center px-4 sm:px-8">
        <Link href="/">
          <Logo />
        </Link>
      </header>
      <main className="relative flex flex-1 flex-col items-center justify-center px-4 pb-20 text-center">
        {code && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gradient text-7xl font-semibold tracking-tighter sm:text-8xl"
          >
            {code}
          </motion.p>
        )}
        <motion.span
          initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.1 }}
          className="mt-6 grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary"
        >
          <Icon className="size-7" />
        </motion.span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-md text-muted-foreground">{text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {onRetry ? (
            <Button size="xl" onClick={onRetry}>
              <RotateCcw data-icon="inline-start" /> {dict.common.retry}
            </Button>
          ) : (
            <Button asChild size="xl" className="shadow-glow">
              <Link href="/">
                <Home data-icon="inline-start" /> {dict.errors.goHome}
              </Link>
            </Button>
          )}
          <Button asChild size="xl" variant="outline">
            <Link href={onRetry ? "/" : "/track"}>
              {onRetry ? (
                <>
                  <Home data-icon="inline-start" /> {dict.errors.goHome}
                </>
              ) : (
                <>
                  <PackageSearch data-icon="inline-start" /> {dict.errors.trackInstead}
                </>
              )}
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
