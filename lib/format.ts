import type { Lang } from "@/lib/i18n/lang";

const localeFor = (lang: Lang) => (lang === "bn" ? "bn-BD" : "en-GB");

export function formatDateTime(iso: string | Date, lang: Lang) {
  return new Intl.DateTimeFormat(localeFor(lang), {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatDate(iso: string | Date, lang: Lang) {
  return new Intl.DateTimeFormat(localeFor(lang), { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

export function formatNumber(value: number, lang: Lang, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(localeFor(lang), options).format(value);
}

// "3 hours ago" / "৩ ঘণ্টা আগে"
export function formatRelative(iso: string | Date, lang: Lang) {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(localeFor(lang), { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, seconds] of units) {
    if (Math.abs(diff) >= seconds) return rtf.format(Math.round(diff / seconds), unit);
  }
  return rtf.format(Math.round(diff), "second");
}

// "১.৫" -> "1.5" so Bangla keyboards work in number fields
export function toAsciiDigits(value: string) {
  return value.replace(/[০-৯]/g, (d) => String(d.charCodeAt(0) - 0x09e6));
}

export function normalizeTrackingId(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}
