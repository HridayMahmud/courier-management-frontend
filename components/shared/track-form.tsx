"use client";

import { cn } from "cn";
import { PackageSearch, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { normalizeTrackingId } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export function TrackForm({ defaultValue = "", className, size = "lg" }: { defaultValue?: string; className?: string; size?: "lg" | "md" }) {
  const { dict } = useI18n();
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const id = normalizeTrackingId(value);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (id) router.push(`/track/${encodeURIComponent(id)}`);
      }}
      className={cn(
        "flex items-center gap-2 rounded-2xl border bg-card p-1.5 shadow-soft transition-shadow focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30",
        className,
      )}
    >
      <label htmlFor="track-input" className="sr-only">
        {dict.track.trackingId}
      </label>
      <PackageSearch className="ml-2.5 size-5 shrink-0 text-muted-foreground" />
      <input
        id="track-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={dict.landing.trackPlaceholder}
        autoComplete="off"
        spellCheck={false}
        className={cn(
          "min-w-0 flex-1 bg-transparent font-mono text-sm tracking-wide uppercase outline-none placeholder:font-sans placeholder:tracking-normal placeholder:normal-case placeholder:text-muted-foreground",
          size === "lg" ? "h-11" : "h-9",
        )}
      />
      <Button type="submit" size={size === "lg" ? "xl" : "lg"} disabled={!id} className="shrink-0">
        <Search data-icon="inline-start" />
        {dict.landing.trackButton}
      </Button>
    </form>
  );
}
