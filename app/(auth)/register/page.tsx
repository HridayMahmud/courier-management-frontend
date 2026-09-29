"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, ArrowRight, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AuthBody, AuthHeading } from "@/components/auth/auth-heading";
import { FormField } from "@/components/auth/form-field";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api/client";
import { authApi } from "@/lib/api/endpoints";
import { useI18n } from "@/lib/i18n";

export default function RegisterPage() {
  const { dict } = useI18n();
  const t = dict.auth;
  const login = useLogin();

  const schema = useMemo(
    () =>
      z
        .object({
          name: z.string().trim().min(1, t.errors.nameRequired).min(2, t.errors.nameMin),
          email: z.string().trim().min(1, t.errors.emailRequired).email(t.errors.emailInvalid),
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
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", password: "", confirm: "" } });

  // create the account, then sign straight in with the same credentials
  const signup = useMutation({
    mutationFn: authApi.register,
    onSuccess: (_data, vars) => {
      toast.success(t.register.success);
      login.mutate({ email: vars.email, password: vars.password });
    },
  });

  const busy = signup.isPending || login.isPending;
  const error = signup.error ?? login.error;

  return (
    <>
      <AuthHeading title={t.register.title} subtitle={t.register.subtitle} />
      <AuthBody>
        {error && (
          <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" /> {getErrorMessage(error)}
          </div>
        )}
        <form
          onSubmit={handleSubmit(({ name, email, password }) => signup.mutate({ name: name.trim(), email: email.trim(), password }))}
          className="space-y-5"
          noValidate
        >
          <FormField label={t.name} icon={User} autoComplete="name" placeholder={t.namePlaceholder} error={errors.name?.message} {...register("name")} />
          <FormField
            label={t.email}
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder={t.emailPlaceholder}
            error={errors.email?.message}
            {...register("email")}
          />
          <FormField
            label={t.password}
            icon={Lock}
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.password?.message}
            hint={<PasswordStrength password={watch("password")} />}
            {...register("password")}
          />
          <FormField
            label={t.confirmPassword}
            icon={Lock}
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.confirm?.message}
            {...register("confirm")}
          />
          <Button type="submit" size="xl" className="shadow-glow w-full" disabled={busy}>
            {busy ? <Spinner /> : null}
            {t.register.submit}
            {!busy && <ArrowRight data-icon="inline-end" />}
          </Button>
          <p className="text-center text-xs text-muted-foreground">{t.register.terms}</p>
        </form>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t.register.haveAccount}{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            {dict.common.signIn}
          </Link>
        </p>
      </AuthBody>
    </>
  );
}
