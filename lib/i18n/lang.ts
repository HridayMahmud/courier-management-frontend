// Shared by server (root layout) and client code, so it must not be a client module.
export type Lang = "en" | "bn";
export const LANGS: Lang[] = ["en", "bn"];

export function isLang(value: unknown): value is Lang {
  return value === "en" || value === "bn";
}
