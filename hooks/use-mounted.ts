"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// false during SSR and hydration, true afterwards: keeps browser-only values out of the first render
export function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
