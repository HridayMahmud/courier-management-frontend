"use client";

import { RotateCcw, WifiOff } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/api/client";
import { useI18n } from "@/lib/i18n";

// Shown instead of an empty state when data failed to load, so "no data" never masks "no connection".
export function ErrorState({ error, onRetry, className }: { error: unknown; onRetry: () => void; className?: string }) {
  const { dict } = useI18n();
  return (
    <EmptyState
      icon={WifiOff}
      title={dict.errors.errorTitle}
      text={getErrorMessage(error)}
      className={className}
      action={
        <Button variant="outline" onClick={onRetry}>
          <RotateCcw data-icon="inline-start" /> {dict.common.retry}
        </Button>
      }
    />
  );
}
