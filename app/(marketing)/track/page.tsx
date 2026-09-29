"use client";

import { PackageSearch } from "lucide-react";
import { motion } from "motion/react";
import { TrackForm } from "@/components/shared/track-form";
import { useI18n } from "@/lib/i18n";

export default function TrackPage() {
  const { dict } = useI18n();
  return (
    <section className="relative overflow-hidden">
      <div className="bg-mesh pointer-events-none absolute inset-0" />
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="relative mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <motion.span
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 18 }}
          className="grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary shadow-soft"
        >
          <PackageSearch className="size-8" />
        </motion.span>
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
          {dict.track.title}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="mt-3 text-muted-foreground">
          {dict.track.subtitle}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 w-full">
          <TrackForm />
          <p className="mt-2.5 text-xs text-muted-foreground">{dict.landing.trackHint}</p>
        </motion.div>
      </div>
    </section>
  );
}
