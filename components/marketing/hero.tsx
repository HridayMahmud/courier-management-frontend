"use client";

import { ArrowRight, CircleCheckBig, MapPinned, Radio } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { RouteAnimation } from "@/components/brand/route-animation";
import { StatusBadge } from "@/components/shared/status-badge";
import { TrackForm } from "@/components/shared/track-form";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { STATUS_META, statusProgress } from "@/lib/status";
import type { ParcelStatus } from "@/lib/types";

// Sample rows for the product preview card (illustration only).
const PREVIEW: { id: string; route: string; status: ParcelStatus }[] = [
  { id: "SS-8F3K2Q9P", route: "Dhaka → Sylhet", status: "in_transit" },
  { id: "SS-J7PV4M2X", route: "Gulshan → Mirpur", status: "out_for_delivery" },
  { id: "SS-Q2W9R5TN", route: "Chattogram → Dhaka", status: "delivered" },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

function HeroVisual() {
  const { dict } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-xl [perspective:1200px]"
    >
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-primary/25 via-chart-5/15 to-highlight/20 blur-2xl" />
      <div className="glass rounded-3xl border p-4 shadow-soft sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold">{dict.landing.heroCard.title}</p>
          <span className="rounded-full border border-dashed px-2.5 py-1 text-xs font-medium text-muted-foreground">{dict.landing.heroCard.sample}</span>
        </div>
        <div className="bg-grid relative h-44 overflow-hidden rounded-2xl border bg-muted/40 sm:h-52">
          <RouteAnimation className="text-foreground" />
        </div>
        <ul className="mt-4 space-y-2">
          {PREVIEW.map((row, i) => (
            <motion.li
              key={row.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.12 }}
              className="flex items-center gap-3 rounded-xl border bg-card/80 px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs font-medium tracking-wide">{row.id}</p>
                <p className="truncate text-xs text-muted-foreground">{row.route}</p>
              </div>
              <div className="hidden w-20 sm:block">
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: STATUS_META[row.status].chart }}
                    initial={{ width: 0 }}
                    animate={{ width: `${statusProgress(row.status)}%` }}
                    transition={{ duration: 1, delay: 0.9 + i * 0.12 }}
                  />
                </div>
              </div>
              <StatusBadge status={row.status} />
            </motion.li>
          ))}
        </ul>
      </div>

      {/* floating chips */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
        transition={{ opacity: { delay: 1.1 }, scale: { delay: 1.1 }, y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" } }}
        className="glass absolute -top-5 -left-3 hidden items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium shadow-soft sm:flex"
      >
        <CircleCheckBig className="size-4 text-emerald-500" /> {dict.status.delivered} · Banani
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.3 }, scale: { delay: 1.3 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
        className="glass absolute -right-3 -bottom-5 hidden items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium shadow-soft sm:flex"
      >
        <MapPinned className="size-4 text-cyan-500" /> {dict.status.out_for_delivery} · Mirpur
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const { dict } = useI18n();
  const t = dict.landing;
  return (
    <section className="relative overflow-hidden">
      <div className="bg-mesh pointer-events-none absolute inset-0" />
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-20 lg:pb-28">
        <div className="max-w-2xl">
          <motion.span
            {...fadeUp(0)}
            className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft backdrop-blur"
          >
            <Radio className="size-3.5 text-primary" /> {t.badge}
          </motion.span>
          <motion.h1 {...fadeUp(0.08)} className="mt-6 text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {t.titleA} <span className="text-gradient">{t.titleHighlight}</span> {t.titleB}
          </motion.h1>
          <motion.p {...fadeUp(0.16)} className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            {t.subtitle}
          </motion.p>
          <motion.div {...fadeUp(0.24)} className="mt-8 max-w-xl">
            <TrackForm />
            <p className="mt-2.5 pl-1 text-xs text-muted-foreground">{t.trackHint}</p>
          </motion.div>
          <motion.div {...fadeUp(0.32)} className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="xl" className="shadow-glow">
              <Link href="/register">
                {t.ctaPrimary} <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="#how-it-works">{dict.nav.howItWorks}</Link>
            </Button>
          </motion.div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}
