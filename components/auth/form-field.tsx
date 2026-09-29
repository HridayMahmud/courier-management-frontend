"use client";

import { cn } from "cn";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { forwardRef, useId, useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";

type InputProps = React.ComponentProps<"input"> & {
  label: string;
  icon?: LucideIcon;
  error?: string;
  hint?: React.ReactNode;
  labelAction?: React.ReactNode;
};

// Labelled input with a leading icon and an inline error, sized for auth forms.
export const FormField = forwardRef<HTMLInputElement, InputProps>(function FormField(
  { label, icon: Icon, error, hint, labelAction, className, id, type, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const { dict } = useI18n();
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <Field data-invalid={!!error}>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
        {labelAction}
      </div>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />}
        <Input
          ref={ref}
          id={inputId}
          type={isPassword && visible ? "text" : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn("h-11 rounded-xl bg-card text-sm", Icon && "pl-10", isPassword && "pr-11", className)}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? dict.auth.hidePassword : dict.auth.showPassword}
            className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {hint}
      <FieldError id={`${inputId}-error`}>{error}</FieldError>
    </Field>
  );
});
