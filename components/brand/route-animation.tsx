"use client";

import { cn } from "cn";
import { motion } from "motion/react";
import { useId } from "react";

// Route drawn across the panel; a parcel travels along it on a loop.
const ROUTE = "M 40 300 C 140 120, 260 380, 360 200 S 520 60, 600 140";

// pin pulse, scaled around each pin's own centre
const PULSE = "animate-ping origin-center [transform-box:fill-box] [animation-duration:2s]";

export function RouteAnimation({ className }: { className?: string }) {
  const gradientId = `route-grad-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 640 360" className={cn("h-full w-full", className)} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1">
          <stop offset="0" stopColor="#818CF8" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <path d={ROUTE} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="14" strokeLinecap="round" />
      <motion.path
        d={ROUTE}
        fill="none"
        stroke={`url(#${gradientId})`}
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
