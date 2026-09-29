"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { LANG_COOKIE } from "@/lib/config";
import { setCookie } from "@/lib/cookies";
import { bn } from "./bn";
import { en, type Dictionary } from "./en";
import type { Lang } from "./lang";

export type { Lang } from "./lang";

const dictionaries: Record<Lang, Dictionary> = { en, bn };

interface I18nValue {
  lang: Lang;
  dict: Dictionary;
  setLang: (lang: Lang) => void;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ initialLang, children }: { initialLang: Lang; children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    setCookie(LANG_COOKIE, next, 60 * 60 * 24 * 365);
    document.documentElement.lang = next;
  }, []);

  const value = useMemo(() => ({ lang, dict: dictionaries[lang], setLang }), [lang, setLang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

// "Hello {name}" + { name: "Rahim" } -> "Hello Rahim"
export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`));
}
