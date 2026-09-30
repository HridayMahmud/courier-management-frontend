"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, KeyRound, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { initials } from "@/components/admin/assign-dialog";
import { FormField } from "@/components/auth/form-field";
import { PasswordStrength } from "@/components/auth/password-strength";
import { PageHeader } from "@/components/dashboard/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useChangePassword, useMe, useUpdateMe } from "@/hooks/use-auth";
import { useMounted } from "@/hooks/use-mounted";
import { getErrorMessage } from "@/lib/api/client";
import { useI18n } from "@/lib/i18n";

function ErrorBox({ error }: { error: unknown }) {
  return (
    <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
      <AlertCircle className="mt-0.5 size-4 shrink-0" /> {getErrorMessage(error)}
    </div>
  );
}

function ProfileCard() {
  const { dict } = useI18n();
  const t = dict.account;
  const mounted = useMounted();
  const { data } = useMe();
  const me = mounted ? data : undefined;
  const update = useUpdateMe();
  const schema = useMemo(() => z.object({ name: z.string().trim().min(1, dict.auth.errors.nameRequired).min(2, dict.auth.errors.nameMin) }), [dict]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<{ name: string }>({ resolver: zodResolver(schema), defaultValues: { name: "" } });

  // fill the form once the profile has loaded
  useEffect(() => {
    if (me) reset({ name: me.name });
  }, [me, reset]);

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle>{t.profileTitle}</CardTitle>
        <CardDescription>{t.profileText}</CardDescription>
      </CardHeader>
      <CardContent>
        {!me ? (
          <Skeleton className="h-56 rounded-xl" />
        ) : (
          <form
            noValidate
            className="space-y-5"
            onSubmit={handleSubmit((v) =>
              update.mutate({ name: v.name.trim() }, { onSuccess: (res) => (toast.success(t.nameSaved), reset({ name: res.user.name })) }),
            )}
          >
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarFallback className="bg-gradient-to-br from-primary to-chart-5 text-lg font-semibold text-white">{initials(me.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-medium">{me.name}</p>
                <p className="text-sm text-muted-foreground">
                  {t.role}: <span className="font-medium text-foreground">{dict.roles[me.role]}</span>
                </p>
              </div>
            </div>
            <FormField label={dict.auth.name} icon={User} autoComplete="name" error={errors.name?.message} {...register("name")} />
            <FormField
              label={dict.auth.email}
              icon={Mail}
              value={me.email}
              readOnly
              disabled
              hint={<p className="text-xs text-muted-foreground">{t.emailLocked}</p>}
            />
            {update.isError && <ErrorBox error={update.error} />}
            <Button type="submit" size="lg" disabled={!isDirty || update.isPending}>
              {update.isPending && <Spinner />} {dict.common.save}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function PasswordCard() {
  const { dict } = useI18n();
  const t = dict.account;
  const change = useChangePassword();
  const schema = useMemo(
    () =>
      z
        .object({
          currentPassword: z.string().min(1, t.errors.currentRequired),
          newPassword: z.string().min(6, dict.auth.errors.passwordMin),
          confirm: z.string(),
        })
        .refine((v) => v.newPassword === v.confirm, { path: ["confirm"], message: dict.auth.errors.mismatch })
        .refine((v) => v.newPassword !== v.currentPassword, { path: ["newPassword"], message: t.errors.same }),
    [t, dict],
  );
  type Values = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { currentPassword: "", newPassword: "", confirm: "" } });

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" /> {t.passwordTitle}
        </CardTitle>
        <CardDescription>{t.passwordText}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          className="space-y-5"
          onSubmit={handleSubmit((v) =>
            change.mutate(
              { currentPassword: v.currentPassword, newPassword: v.newPassword },
              {
                onSuccess: () => {
                  toast.success(t.passwordSaved);
                  reset();
                },
              },
            ),
          )}
        >
          <FormField
            label={t.currentPassword}
            icon={Lock}
            type="password"
            autoComplete="current-password"
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />
          <FormField
            label={t.newPassword}
            icon={KeyRound}
            type="password"
            autoComplete="new-password"
            error={errors.newPassword?.message}
            hint={<PasswordStrength password={watch("newPassword")} />}
            {...register("newPassword")}
          />
          <FormField
            label={dict.auth.confirmPassword}
            icon={KeyRound}
            type="password"
            autoComplete="new-password"
            error={errors.confirm?.message}
            {...register("confirm")}
          />
          {change.isError && <ErrorBox error={change.error} />}
          <Button type="submit" size="lg" disabled={change.isPending}>
            {change.isPending && <Spinner />} {t.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AccountPage() {
  const { dict } = useI18n();
  return (
    <>
      <PageHeader title={dict.account.title} description={dict.account.subtitle} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProfileCard />
        <PasswordCard />
      </div>
    </>
  );
}
