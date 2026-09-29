"use client";

import { cn } from "cn";
import { useI18n } from "@/lib/i18n";

// 0..4 from length and character variety
export function passwordScore(password: string) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

const COLORS = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-emerald-500"];

export function PasswordStrength({ password }: { password: string }) {
  const { dict } = useI18n();
  const score = passwordScore(password);
  if (!password) return null;
  const labels = [dict.auth.strength.weak, dict.auth.strength.weak, dict.auth.strength.fair, dict.auth.strength.good, dict.auth.strength.strong];
  return (
    <div className="space-y-1.5" aria-live="polite">
      <div className="flex gap-1.5" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn("h-1.5 flex-1 rounded-full bg-muted transition-colors duration-300", i < score && COLORS[Math.max(score - 1, 0)])}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {dict.auth.strength.label}: <span className="font-medium text-foreground">{labels[score]}</span>
      </p>
    </div>
  );
}
