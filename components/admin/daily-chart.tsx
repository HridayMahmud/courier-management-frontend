"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipContentProps } from "recharts";
import { formatNumber } from "@/lib/format";
import { fmt, useI18n } from "@/lib/i18n";

type Point = { date: string; count: number };

function dayLabel(date: string, lang: "en" | "bn", withYear = false) {
  return new Intl.DateTimeFormat(lang === "bn" ? "bn-BD" : "en-GB", { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}), timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

function ChartTooltip({ active, payload }: Pick<TooltipContentProps, "active" | "payload">) {
  const { dict, lang } = useI18n();
  const point = payload?.[0]?.payload as Point | undefined;
  if (!active || !point) return null;
  return (
    <div className="rounded-xl border bg-popover px-3 py-2 text-sm shadow-soft">
      <p className="text-xs text-muted-foreground">{dayLabel(point.date, lang, true)}</p>
      <p className="font-semibold tabular-nums">{fmt(dict.admin.dailyTooltip, { count: formatNumber(point.count, lang) })}</p>
    </div>
  );
}

// Single series (parcels booked per day), so no legend: the card title names it.
export function DailyChart({ data }: { data: Point[] }) {
  const { lang } = useI18n();
  return (
    <div className="h-64 w-full" role="img" aria-label="Parcels booked per day, last 30 days">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 20, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="daily-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tickFormatter={(d: string) => dayLabel(d, lang)}
            tickLine={false}
            axisLine={false}
            minTickGap={28}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={(v: number) => formatNumber(v, lang)}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <Tooltip content={(props) => <ChartTooltip active={props.active} payload={props.payload} />} cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "4 4" }} />
          <Area
            type="linear"
            dataKey="count"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#daily-fill)"
            activeDot={{ r: 5, stroke: "var(--card)", strokeWidth: 2, fill: "var(--primary)" }}
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
