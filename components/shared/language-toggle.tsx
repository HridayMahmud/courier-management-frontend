"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useI18n } from "@/lib/i18n";

export function LanguageToggle() {
  const { lang, setLang, dict } = useI18n();
  const next = lang === "en" ? "bn" : "en";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" onClick={() => setLang(next)} aria-label={dict.common.language} className="gap-1.5 px-2">
          <Languages className="size-4" />
          <span className="text-xs font-semibold">{next === "bn" ? "বাংলা" : "EN"}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{dict.common.language}</TooltipContent>
    </Tooltip>
  );
}
