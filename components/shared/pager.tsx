"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export function Pager({ page, pages, onChange }: { page: number; pages: number; onChange: (page: number) => void }) {
  const { lang } = useI18n();
  if (pages <= 1) return null;
  return (
    <nav className="flex items-center justify-end gap-2" aria-label="Pagination">
      <Button variant="outline" size="icon" onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
        <ChevronLeft />
      </Button>
      <span className="min-w-16 text-center text-sm text-muted-foreground tabular-nums">
        {formatNumber(page, lang)} / {formatNumber(pages, lang)}
      </span>
      <Button variant="outline" size="icon" onClick={() => onChange(page + 1)} disabled={page >= pages} aria-label="Next page">
        <ChevronRight />
      </Button>
    </nav>
  );
}
