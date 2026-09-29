"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, KeyRound, Mail, MailCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthBody, AuthHeading } from "@/components/auth/auth-heading";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getErrorMessage } from "@/lib/api/client";
import { authApi } from "@/lib/api/endpoints";
import { fmt, useI18n } from "@/lib/i18n";

export default function ForgotPasswordPage() {
  const { dict } = useI18n();
  const t = dict.auth;

  const schema = useMemo(() => z.object({ email: z.string().trim().min(1, t.errors.emailRequired).email(t.errors.emailInvalid) }), [t]);
  type Values = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  const send = useMutation({ mutationFn: authApi.forgotPassword });
  const email = send.variables?.email ?? getValues("email");

  return (
    <AnimatePresence mode="wait">
      {send.isSuccess ? (
        <motion.div key="sent" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
          <AuthHeading
            icon={
              <motion.span
                initial={{ scale: 0.6, rotate: -8 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 16 }}
                className="grid size-14 place-items-center rounded-2xl bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
              >
                <MailCheck className="size-7" />
              </motion.span>
            }
            title={t.forgot.sentTitle}
            subtitle={fmt(t.forgot.sentText, { email })}
          />
          <div className="space-y-3">
            <Button asChild size="xl" className="shadow-glow w-full">
              <Link href={`/reset-password?email=${encodeURIComponent(email)}`}>
                <KeyRound data-icon="inline-start" /> {t.forgot.haveCode}
              </Link>
            </Button>
            <Button variant="ghost" size="xl" className="w-full" onClick={() => send.mutate({ email })}>
              {t.forgot.resend}
            </Button>
          </div>
          <BackToLogin label={t.forgot.backToLogin} />
        </motion.div>
      ) : (
        <motion.div key="form" exit={{ opacity: 0 }}>
          <AuthHeading
            icon={
              <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                <KeyRound className="size-7" />
              </span>
            }
            title={t.forgot.title}
            subtitle={t.forgot.subtitle}
          />
          <AuthBody>
            {send.isError && (
              <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" /> {getErrorMessage(send.error)}
              </div>
            )}
            <form onSubmit={handleSubmit((v) => send.mutate({ email: v.email.trim() }))} className="space-y-5" noValidate>
              <FormField
                label={t.email}
                icon={Mail}
                type="email"
                autoComplete="email"
                placeholder={t.emailPlaceholder}
                error={errors.email?.message}
                {...register("email")}
              />
              <Button type="submit" size="xl" className="shadow-glow w-full" disabled={send.isPending}>
                {send.isPending ? <Spinner /> : null}
                {t.forgot.submit}
              </Button>
            </form>
            <BackToLogin label={t.forgot.backToLogin} />
          </AuthBody>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BackToLogin({ label }: { label: string }) {
  return (
    <p className="mt-8 text-center text-sm">
      <Link href="/login" className="inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> {label}
      </Link>
    </p>
  );
}
