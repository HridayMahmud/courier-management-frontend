"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Hash, Lock, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AuthBody, AuthHeading } from "@/components/auth/auth-heading";
import { FormField } from "@/components/auth/form-field";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getErrorMessage } from "@/lib/api/client";
import { authApi } from "@/lib/api/endpoints";
import { useI18n } from "@/lib/i18n";

function ResetForm() {
  const { dict } = useI18n();
  const t = dict.auth;
  const params = useSearchParams();
  const router = useRouter();

  const schema = useMemo(
    () =>
      z
        .object({
          email: z.string().trim().min(1, t.errors.emailRequired).email(t.errors.emailInvalid),
          token: z.string().trim().min(1, t.errors.tokenRequired),
          password: z.string().min(6, t.errors.passwordMin),
          confirm: z.string(),
        })
        .refine((v) => v.password === v.confirm, { path: ["confirm"], message: t.errors.mismatch }),
    [t],
  );
  type Values = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: params.get("email") ?? "", token: params.get("token") ?? "", password: "", confirm: "" },
  });

  const reset = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (_d, vars) => {
      toast.success(t.reset.success);
      router.push(`/login?email=${encodeURIComponent(vars.email)}`);
    },
  });

  return (
    <>
      <AuthHeading
        icon={
          <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="size-7" />
          </span>
        }
        title={t.reset.title}
        subtitle={t.reset.subtitle}
      />
      <AuthBody>
        {reset.isError && (
          <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" /> {getErrorMessage(reset.error)}
          </div>
        )}
        <form
          onSubmit={handleSubmit(({ email, token, password }) => reset.mutate({ email: email.trim(), token: token.trim(), password }))}
          className="space-y-5"
          noValidate
        >
          <FormField label={t.email} icon={Mail} type="email" autoComplete="email" placeholder={t.emailPlaceholder} error={errors.email?.message} {...register("email")} />
          <FormField
            label={t.reset.token}
            icon={Hash}
            autoComplete="one-time-code"
            placeholder={t.reset.tokenPlaceholder}
            className="font-mono"
            error={errors.token?.message}
            labelAction={
              <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                {t.reset.needCode}
              </Link>
            }
            {...register("token")}
          />
          <FormField
            label={t.reset.newPassword}
            icon={Lock}
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.password?.message}
            hint={<PasswordStrength password={watch("password")} />}
            {...register("password")}
          />
          <FormField label={t.confirmPassword} icon={Lock} type="password" autoComplete="new-password" placeholder="••••••••" error={errors.confirm?.message} {...register("confirm")} />
          <Button type="submit" size="xl" className="shadow-glow w-full" disabled={reset.isPending}>
            {reset.isPending ? <Spinner /> : null}
            {t.reset.submit}
          </Button>
        </form>
        <p className="mt-8 text-center text-sm">
          <Link href="/login" className="inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> {t.forgot.backToLogin}
          </Link>
        </p>
      </AuthBody>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
