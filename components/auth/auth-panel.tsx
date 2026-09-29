"use client";

import { Check, MapPin, Package, Quote } from "lucide-react";
import { motion } from "motion/react";
import { RouteAnimation } from "@/components/brand/route-animation";
import { StatusBadge } from "@/components/shared/status-badge";
import { useI18n } from "@/lib/i18n";

export function AuthPanel() {
  const { dict } = useI18n();
  return (
    <div className="relative hidden overflow-hidden bg-[#0B1020] text-white lg:flex lg:flex-col">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(36rem 26rem at 15% 10%, rgba(99,102,241,.35), transparent 70%), radial-gradient(28rem 22rem at 90% 30%, rgba(245,158,11,.18), transparent 70%), radial-gradient(30rem 24rem at 50% 110%, rgba(6,182,212,.18), transparent 70%)",
        }}
      />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div className="relative flex flex-1 flex-col justify-between gap-10 p-10 xl:p-14">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-md space-y-4">
          <h2 className="text-3xl leading-tight font-semibold tracking-tight xl:text-4xl">{dict.auth.panelTitle}</h2>
          <p className="text-base text-white/65">{dict.auth.panelSubtitle}</p>
          <ul className="space-y-2.5 pt-2">
            {dict.auth.panelPoints.map((point, i) => (
              <motion.li
                key={point}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
                className="flex items-center gap-3 text-sm text-white/85"
              >
                <span className="grid size-6 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
                  <Check className="size-3.5" />
                </span>
                {point}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <div className="relative h-64 xl:h-72">
          <RouteAnimation className="text-white" />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
            transition={{ opacity: { delay: 0.8 }, scale: { delay: 0.8 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.4 } }}
            className="absolute right-4 bottom-0 w-64 rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs text-white/60">
                <Package className="size-3.5" /> <span className="font-mono tracking-wide text-white/90">SS-8F3K2Q9P</span>
              </span>
              <StatusBadge status="in_transit" className="text-blue-200" />
            </div>
            <div className="mt-4 space-y-2.5">
              {(["picked_up", "in_transit", "out_for_delivery"] as const).map((s, i) => (
                <div key={s} className="flex items-center gap-2.5 text-xs">
                  <span className={i < 2 ? "size-2 rounded-full bg-indigo-400" : "size-2 rounded-full border border-white/30"} />
                  <span className={i < 2 ? "text-white/90" : "text-white/45"}>{dict.status[s]}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-white/50">
              <MapPin className="size-3" /> Dhaka → Sylhet
            </div>
          </motion.div>
        </div>

        <figure className="max-w-md space-y-2 border-l-2 border-amber-400/60 pl-4">
          <Quote className="size-4 text-amber-300" />
          <blockquote className="text-sm text-white/80">{dict.auth.panelQuote}</blockquote>
          <figcaption className="text-xs text-white/45">— {dict.auth.panelQuoteBy}</figcaption>
        </figure>
      </div>
    </div>
  );
}
