"use client";

// Temporary home: previews the design system until the real landing page (step 4).
import { ArrowRight, PackageSearch } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { LogoMark } from "@/components/brand/logo";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { PARCEL_STATUSES } from "@/lib/types";

const SWATCHES = [
  { name: "Primary", className: "bg-primary", hex: "#4F46E5" },
  { name: "Highlight", className: "bg-highlight", hex: "#F59E0B" },
  { name: "Navy", className: "bg-[#0B1020]", hex: "#0B1020" },
  { name: "Cyan", className: "bg-chart-3", hex: "chart-3" },
  { name: "Emerald", className: "bg-chart-4", hex: "chart-4" },
  { name: "Violet", className: "bg-chart-5", hex: "chart-5" },
];

export default function Home() {
  const { dict } = useI18n();
  return (
    <div className="relative overflow-hidden">
      <div className="bg-mesh pointer-events-none absolute inset-0" />
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <section className="relative mx-auto max-w-5xl px-4 pt-20 pb-12 text-center sm:px-6">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
          <LogoMark className="mx-auto size-16" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl"
        >
          <span className="text-gradient">SwiftShip</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground"
        >
          {dict.common.appTagline}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Button asChild size="xl" className="shadow-glow">
            <Link href="/register">
              {dict.common.getStarted} <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild size="xl" variant="outline">
            <Link href="/login">{dict.common.signIn}</Link>
          </Button>
        </motion.div>
      </section>

      <section className="relative mx-auto grid max-w-5xl gap-6 px-4 pb-24 sm:px-6 md:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Colors</CardTitle>
            <CardDescription>Design tokens · light & dark</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3">
            {SWATCHES.map((s) => (
              <div key={s.name} className="space-y-1.5">
                <div className={`h-14 rounded-xl ring-1 ring-border ${s.className}`} />
                <p className="text-xs font-medium">{s.name}</p>
                <p className="font-mono text-[11px] text-muted-foreground">{s.hex}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Parcel status</CardTitle>
            <CardDescription>{dict.nav.track}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {PARCEL_STATUSES.map((s) => (
                <StatusBadge key={s} status={s} withIcon />
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="SS-8F3K2Q9P" className="h-11 rounded-xl font-mono" />
              <Button size="xl">
                <PackageSearch data-icon="inline-start" /> {dict.nav.track}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">{dict.common.delete}</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
