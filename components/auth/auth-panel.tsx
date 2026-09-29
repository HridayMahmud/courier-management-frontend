"use client";

import { Check, MapPin, Package, Quote } from "lucide-react";
import { motion } from "motion/react";
import { StatusBadge } from "@/components/shared/status-badge";
import { useI18n } from "@/lib/i18n";

// Route drawn across the panel; a parcel travels along it on a loop.
const ROUTE = "M 40 300 C 140 120, 260 380, 360 200 S 520 60, 600 140";

// pin pulse, scaled around each pin's own centre
const PULSE = "animate-ping origin-center [transform-box:fill-box] [animation-duration:2s]";

function RouteAnimation() {
  return (
    <svg viewBox="0 0 640 360" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="route-grad" x1="0" x2="1">
          <stop offset="0" stopColor="#818CF8" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <path d={ROUTE} fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="14" strokeLinecap="round" />
      <motion.path
        d={ROUTE}
        fill="none"
        stroke="url(#route-grad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="8 10"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
      />
      {/* pickup + drop pins */}
      <circle cx="40" cy="300" r="7" fill="#818CF8" />
      <circle cx="40" cy="300" r="7" fill="none" stroke="#818CF8" strokeWidth="2" className={PULSE} />
      <circle cx="600" cy="140" r="7" fill="#F59E0B" />
      <circle cx="600" cy="140" r="7" fill="none" stroke="#F59E0B" strokeWidth="2" className={`${PULSE} [animation-delay:1s]`} />
      {/* travelling parcel */}
      <motion.g
        style={{ offsetPath: `path("${ROUTE}")`, offsetRotate: "0deg" }}
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      >
        <rect x="-14" y="-14" width="28" height="28" rx="8" fill="#4F46E5" stroke="white" strokeOpacity="0.5" />
        <path d="M-6 -3 L0 -6 L6 -3 L6 4 L0 7 L-6 4 Z M-6 -3 L0 0 L6 -3 M0 0 L0 7" fill="none" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
      </motion.g>
    </svg>
  );
}

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
          <RouteAnimation />
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
