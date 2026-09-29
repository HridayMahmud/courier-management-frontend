"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

// Counts up from 0 the first time it scrolls into view (digits follow the UI language).
export function Counter({ value, suffix = "", duration = 1.4 }: { value: number; suffix?: string; duration?: number }) {
  const { lang } = useI18n();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, { duration, ease: "easeOut", onUpdate: (v) => setCurrent(Math.round(v)) });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {formatNumber(current, lang)}
      {suffix}
    </span>
  );
}
