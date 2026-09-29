"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider, type Lang } from "@/lib/i18n";

export function Providers({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30 * 1000, refetchOnWindowFocus: false, retry: 1 },
        },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <I18nProvider initialLang={lang}>
        <QueryClientProvider client={queryClient}>
          {/* respects the OS "reduce motion" setting for every animation */}
          <MotionConfig reducedMotion="user">
            <TooltipProvider delayDuration={200}>
              {children}
              <Toaster richColors position="top-right" closeButton />
            </TooltipProvider>
          </MotionConfig>
        </QueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
