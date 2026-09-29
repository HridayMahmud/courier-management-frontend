"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "cn";
import { AlertCircle, CalendarDays, Lock, Mail, User, UserPlus, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { initials } from "@/components/admin/assign-dialog";
import { FormField } from "@/components/auth/form-field";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { Reveal } from "@/components/shared/reveal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useCouriers, useCreateCourier } from "@/hooks/use-parcels";
import { getErrorMessage } from "@/lib/api/client";
import { formatDate, formatNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

function workload(count: number) {
  if (count === 0) return { key: "free", className: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" } as const;
  if (count < 5) return { key: "busy", className: "bg-blue-500/12 text-blue-700 dark:text-blue-300" } as const;
  return { key: "heavy", className: "bg-amber-500/15 text-amber-800 dark:text-amber-300" } as const;
}

function AddCourierDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { dict } = useI18n();
  const a = dict.auth;
  const create = useCreateCourier();
  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(1, a.errors.nameRequired).min(2, a.errors.nameMin),
        email: z.string().trim().min(1, a.errors.emailRequired).email(a.errors.emailInvalid),
        password: z.string().min(6, a.errors.passwordMin),
      }),
    [a],
  );
  type Values = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", password: "" } });

  const close = (v: boolean) => {
    if (!v) {
      reset();
      create.reset();
    }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dict.admin.addCourier}</DialogTitle>
          <DialogDescription>{dict.admin.addCourierText}</DialogDescription>
        </DialogHeader>
        <form
          id="add-courier"
          noValidate
          className="space-y-4"
          onSubmit={handleSubmit((v) =>
            create.mutate(
              { name: v.name.trim(), email: v.email.trim(), password: v.password },
              {
                onSuccess: () => {
                  toast.success(dict.admin.courierCreated);
                  close(false);
                },
              },
            ),
          )}
        >
          <FormField label={a.name} icon={User} placeholder={a.namePlaceholder} error={errors.name?.message} {...register("name")} />
          <FormField label={a.email} icon={Mail} type="email" placeholder={a.emailPlaceholder} error={errors.email?.message} {...register("email")} />
          <FormField label={a.password} icon={Lock} type="password" autoComplete="new-password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
          {create.isError && (
            <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" /> {getErrorMessage(create.error)}
            </div>
          )}
        </form>
        <DialogFooter>
          <Button variant="outline" size="lg" onClick={() => close(false)}>
            {dict.common.cancel}
          </Button>
          <Button type="submit" form="add-courier" size="lg" disabled={create.isPending}>
            {create.isPending && <Spinner />} {dict.admin.addCourier}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function CouriersPage() {
  const { dict, lang } = useI18n();
  const t = dict.admin;
  const { data, isPending, isError, error, refetch } = useCouriers();
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        title={t.couriersTitle}
        description={t.couriersSubtitle}
        actions={
          <Button size="xl" className="shadow-glow" onClick={() => setOpen(true)}>
            <UserPlus data-icon="inline-start" /> {t.addCourier}
          </Button>
        }
      />

      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : !data?.length ? (
        <EmptyState
          icon={Users}
          title={t.noCouriers}
          text={t.noCouriersText}
          action={
            <Button size="lg" onClick={() => setOpen(true)}>
              <UserPlus data-icon="inline-start" /> {t.addCourier}
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((c, i) => {
            const load = workload(c.activeParcels);
            return (
              <Reveal key={c._id} delay={i * 0.05}>
                <div className="rounded-2xl border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-11">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-chart-5 text-sm font-semibold text-white">{initials(c.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{c.name}</p>
                      <p className="truncate text-sm text-muted-foreground">{c.email}</p>
                    </div>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", load.className)}>{t.workload[load.key]}</span>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{t.activeParcels}</p>
                      <p className="text-xl font-semibold tabular-nums">{formatNumber(c.activeParcels, lang)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t.joined}</p>
                      <p className="flex items-center gap-1.5 text-sm font-medium">
                        <CalendarDays className="size-3.5 text-muted-foreground" /> {formatDate(c.createdAt, lang)}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}

      <AddCourierDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
