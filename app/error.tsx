"use client";

import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { StatusScreen } from "@/components/shared/status-screen";
import { useI18n } from "@/lib/i18n";

// Catches unexpected render errors below the root layout.
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { dict } = useI18n();
  useEffect(() => {
    console.error(error);
  }, [error]);
  return <StatusScreen icon={TriangleAlert} title={dict.errors.errorTitle} text={dict.errors.errorText} onRetry={reset} />;
}
