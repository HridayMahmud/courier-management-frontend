"use client";

import { ArrowRight, BarChart3, Globe2, LayoutDashboard, PackagePlus, ShieldCheck, Star, Truck, UserCheck, Waypoints, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Counter } from "@/components/shared/counter";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
      <p className="text-sm font-semibold tracking-wide text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base text-muted-foreground sm:text-lg">{subtitle}</p>}
    </Reveal>
  );
}

export function StatsStrip() {
  const { dict } = useI18n();
  return (
    <section className="relative border-y bg-card/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 sm:px-6 lg:grid-cols-4">
        {dict.landing.stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="px-4 text-center lg:border-l lg:first:border-l-0">
            <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
              <Counter value={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const FEATURE_ICONS: LucideIcon[] = [Waypoints, UserCheck, LayoutDashboard, Globe2, ShieldCheck, BarChart3];
const FEATURE_TINTS = [
  "from-indigo-500/15 text-indigo-600 dark:text-indigo-300",
  "from-amber-500/15 text-amber-600 dark:text-amber-300",
  "from-violet-500/15 text-violet-600 dark:text-violet-300",
  "from-cyan-500/15 text-cyan-600 dark:text-cyan-300",
  "from-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  "from-rose-500/15 text-rose-600 dark:text-rose-300",
];

export function Features() {
  const { dict } = useI18n();
  const t = dict.landing;
  return (
    <section id="features" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow={t.featuresEyebrow} title={t.featuresTitle} subtitle={t.featuresSubtitle} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.map((f, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <Reveal key={f.title} delay={(i % 3) * 0.08}>
                <div className="group relative h-full overflow-hidden rounded-2xl border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow">
                  <div className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                  <span className={`inline-grid size-11 place-items-center rounded-xl bg-gradient-to-br to-transparent ${FEATURE_TINTS[i]}`}>
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const STEP_ICONS: LucideIcon[] = [PackagePlus, Truck, Waypoints];

export function HowItWorks() {
  const { dict, lang } = useI18n();
  const t = dict.landing;
  return (
    <section id="how-it-works" className="relative scroll-mt-20 overflow-hidden bg-card/40 py-20 sm:py-28">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow={t.howEyebrow} title={t.howTitle} />
        <div className="relative grid gap-10 md:grid-cols-3 md:gap-6">
          {/* connecting line on desktop */}
          <div className="absolute top-8 right-[16%] left-[16%] hidden h-px md:block">
            <div className="h-full w-full bg-[repeating-linear-gradient(90deg,var(--border)_0_8px,transparent_8px_16px)]" />
          </div>
          {t.steps.map((step, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <Reveal key={step.title} delay={i * 0.15} className="relative text-center">
                <div className="relative mx-auto grid size-16 place-items-center rounded-2xl border bg-card shadow-soft">
                  <Icon className="size-7 text-primary" />
                  <span className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground shadow-glow">
                    {formatNumber(i + 1, lang)}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const { dict } = useI18n();
  const t = dict.landing;
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow={t.testimonialsEyebrow} title={t.testimonialsTitle} />
        <div className="grid gap-5 md:grid-cols-3">
          {t.testimonials.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.1}>
              <figure className="flex h-full flex-col rounded-2xl border bg-card p-6 shadow-soft">
                <div className="flex gap-0.5 text-amber-400" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed">“{item.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-primary to-chart-5 text-sm font-semibold text-white">
                    {item.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{item.name}</span>
                    <span className="block text-xs text-muted-foreground">{item.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CallToAction() {
  const { dict } = useI18n();
  const t = dict.landing;
  return (
    <section className="px-4 pb-20 sm:px-6 sm:pb-28">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-primary to-violet-700 px-6 py-14 text-center text-white shadow-glow sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(30rem_20rem_at_85%_0%,rgba(245,158,11,.35),transparent_70%),radial-gradient(26rem_18rem_at_0%_100%,rgba(6,182,212,.3),transparent_70%)]" />
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="relative">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{t.ctaTitle}</h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/80 sm:text-lg">{t.ctaSubtitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="xl" className="bg-white text-indigo-700 hover:bg-white/90">
              <Link href="/register">
                {t.ctaButton} <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white dark:border-white/30 dark:bg-white/10 dark:hover:bg-white/20">
              <Link href="/track">{t.ctaSecondary}</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
