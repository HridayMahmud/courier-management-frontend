"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowRight, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AuthBody, AuthHeading } from "@/components/auth/auth-heading";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api/client";
import { useI18n } from "@/lib/i18n";

function LoginForm() {
  const { dict } = useI18n();
  const t = dict.auth;
  const params = useSearchParams();
  const expired = params.get("expired") === "1";
  const login = useLogin();

  const schema = useMemo(
    () =>
      z.object({
        email: z.string().trim().min(1, t.errors.emailRequired).email(t.errors.emailInvalid),
        password: z.string().min(1, t.errors.passwordRequired),
      }),
    [t],
  );
  type Values = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: params.get("email") ?? "", password: "" },
  });

  const onSubmit = (values: Values) =>
    login.mutate(values, {
      onSuccess: () => toast.success(t.login.success),
    });

  return (
    <>
      <AuthHeading title={t.login.title} subtitle={t.login.subtitle} />
      <AuthBody>
        {expired && (
          <div role="status" className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-200">
            <AlertCircle className="mt-0.5 size-4 shrink-0" /> {t.login.expired}
          </div>
        )}
        {login.isError && (
          <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" /> {getErrorMessage(login.error)}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
            autoComplete="current-password"
            placeholder={t.passwordPlaceholder}
            error={errors.password?.message}
            labelAction={
              <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                {t.login.forgot}
              </Link>
            }
            {...register("password")}
          />
          <Button type="submit" size="xl" className="shadow-glow w-full" disabled={login.isPending}>
            {login.isPending ? <Spinner /> : null}
            {t.login.submit}
            {!login.isPending && <ArrowRight data-icon="inline-end" />}
          </Button>
        </form>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t.login.noAccount}{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            {t.login.createOne}
          </Link>
        </p>
      </AuthBody>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
