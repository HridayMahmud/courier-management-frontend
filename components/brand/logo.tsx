import { cn } from "cn";
import { useId } from "react";
import { APP_NAME } from "@/lib/config";

// Parcel box with motion lines on a gradient tile.
export function LogoMark({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 40 40" className={cn("size-9 shrink-0", className)} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="0.55" stopColor="#4F46E5" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#${id}-bg)`} />
      <rect x="0.5" y="0.5" width="39" height="39" rx="10.5" fill="none" stroke="white" strokeOpacity="0.18" />
      {/* motion lines */}
      <g stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round">
        <path d="M5.5 17h5.5" />
        <path d="M8 21.5h4.5" opacity="0.85" />
        <path d="M5.5 26h5" opacity="0.7" />
      </g>
      {/* isometric parcel */}
      <path d="M24 9.5l8.5 4.5-8.5 4.5-8.5-4.5z" fill="#fff" />
      <path d="M15.5 14l8.5 4.5v10.5l-8.5-4.5z" fill="#fff" fillOpacity="0.82" />
      <path d="M32.5 14l-8.5 4.5v10.5l8.5-4.5z" fill="#fff" fillOpacity="0.6" />
      <path d="M19.8 11.8l8.5 4.5" stroke="#4F46E5" strokeOpacity="0.55" strokeWidth="1.6" />
    </svg>
  );
}

export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      <span className="text-lg font-semibold tracking-tight">
        Swift<span className="text-primary">Ship</span>
        <span className="sr-only"> ({APP_NAME})</span>
      </span>
    </span>
  );
}
