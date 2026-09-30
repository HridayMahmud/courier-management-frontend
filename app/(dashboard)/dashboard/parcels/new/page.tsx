"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "cn";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Copy, Home, MapPin, Package, PackageCheck, Pencil, Phone, Scale, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/auth/form-field";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useCreateParcel } from "@/hooks/use-parcels";
import { getErrorMessage } from "@/lib/api/client";
import { formatNumber, toAsciiDigits } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { EMPTY_PARCEL_FORM, parcelSchema, toParcelInput, type ParcelFormValues } from "@/lib/parcel-schema";
import type { Parcel } from "@/lib/types";

const STEP_FIELDS: (keyof ParcelFormValues)[][] = [["pickupAddress"], ["receiverName", "receiverPhone", "address"], ["title", "weight"], []];

function StepIndicator({ step, labels }: { step: number; labels: string[] }) {
  return (
    <ol className="mb-8 grid grid-cols-4 gap-2">
      {labels.map((label, i) => (
        <li key={label} className="space-y-2">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div className="h-full rounded-full bg-primary" initial={false} animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
          </div>
          <p className={cn("flex items-center gap-1.5 text-xs font-medium", i <= step ? "text-foreground" : "text-muted-foreground")}>
            <span
              className={cn(
                "grid size-5 place-items-center rounded-full text-[10px]",
                i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-primary/15 text-primary" : "bg-muted",
              )}
            >
              {i < step ? <Check className="size-3" /> : i + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </p>
        </li>
      ))}
    </ol>
  );
}

function ReviewRow({ icon: Icon, label, value, onEdit }: { icon: typeof MapPin; label: string; value: string; onEdit: () => void }) {
  const { dict } = useI18n();
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-muted/30 p-3.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-words">{value || "—"}</p>
      </div>
      <Button type="button" variant="ghost" size="xs" onClick={onEdit}>
        <Pencil data-icon="inline-start" /> {dict.customer.wizard.editInfo}
      </Button>
    </div>
  );
}

function Success({ parcel, onAnother }: { parcel: Parcel; onAnother: () => void }) {
  const { dict } = useI18n();
  const t = dict.customer.wizard;
  const [copied, setCopied] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-lg py-6 text-center">
      <motion.span
        initial={{ scale: 0.4, rotate: -12 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 14 }}
        className="mx-auto grid size-20 place-items-center rounded-3xl bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
      >
        <PackageCheck className="size-10" />
      </motion.span>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">{t.successTitle}</h1>
      <p className="mt-2 text-muted-foreground">{t.successText}</p>
      <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border bg-card p-4 shadow-soft">
        <span className="font-mono text-2xl font-semibold tracking-wider">{parcel.trackingId}</span>
        <Button
          variant="ghost"
          size="icon"
          aria-label={dict.track.copy}
          onClick={async () => {
            await navigator.clipboard?.writeText(parcel.trackingId ?? "").catch(() => {});
            setCopied(true);
            toast.success(dict.track.copied);
          }}
        >
          {copied ? <Check className="text-emerald-500" /> : <Copy />}
        </Button>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="xl" className="shadow-glow">
          <Link href={`/dashboard/parcels/${parcel._id}`}>
            {t.viewParcel} <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
        <Button size="xl" variant="outline" onClick={onAnother}>
          {t.sendAnother}
        </Button>
      </div>
    </motion.div>
  );
}

export default function NewParcelPage() {
  const { dict, lang } = useI18n();
  const t = dict.customer.wizard;
  const p = dict.parcel;
  const schema = useMemo(() => parcelSchema(dict), [dict]);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const create = useCreateParcel();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    reset,
    formState: { errors },
  } = useForm<ParcelFormValues>({ resolver: zodResolver(schema), defaultValues: EMPTY_PARCEL_FORM, mode: "onTouched" });
  const values = watch();

  const go = async (next: number) => {
    if (next > step) {
      const ok = await trigger(STEP_FIELDS[step], { shouldFocus: true });
      if (!ok) return;
    }
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  if (create.isSuccess) {
    return (
      <Success
        parcel={create.data.parcel}
        onAnother={() => {
          create.reset();
          reset(EMPTY_PARCEL_FORM);
          setStep(0);
        }}
      />
    );
  }

  const weightNum = Number(toAsciiDigits(values.weight));
  const summary = [
    { icon: Home, label: p.pickupAddress, value: values.pickupAddress },
    { icon: User, label: p.receiverName, value: values.receiverName },
    { icon: Phone, label: p.receiverPhone, value: values.receiverPhone },
    { icon: MapPin, label: p.address, value: values.address },
    { icon: Package, label: p.title, value: values.title },
    { icon: Scale, label: p.weight, value: values.weight && Number.isFinite(weightNum) ? `${formatNumber(weightNum, lang)} ${dict.common.kg}` : "" },
  ];

  return (
    <>
      <PageHeader title={t.title} description={t.subtitle} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="shadow-soft">
          <CardContent className="p-5 sm:p-8">
            <StepIndicator step={step} labels={t.steps} />
            <form
              onSubmit={handleSubmit((v) => create.mutate(toParcelInput(v)))}
              onKeyDown={(e) => {
                // Enter moves to the next step instead of submitting early
                if (e.key === "Enter" && step < 3 && (e.target as HTMLElement).tagName === "INPUT") {
                  e.preventDefault();
                  go(step + 1);
                }
              }}
              noValidate
            >
              <div className="mb-6">
                <h2 className="text-lg font-semibold">{t.steps[step]}</h2>
                <p className="text-sm text-muted-foreground">{t.stepHints[step]}</p>
              </div>
              <div className="relative min-h-56 overflow-hidden">
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  <motion.div
                    key={step}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -28 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-5"
                  >
                    {step === 0 && (
                      <FormField label={p.pickupAddress} icon={Home} placeholder={p.pickupPlaceholder} autoFocus error={errors.pickupAddress?.message} {...register("pickupAddress")} />
                    )}
                    {step === 1 && (
                      <>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                          <FormField label={p.receiverName} icon={User} placeholder={p.receiverNamePlaceholder} autoFocus error={errors.receiverName?.message} {...register("receiverName")} />
                          <FormField
                            label={p.receiverPhone}
                            icon={Phone}
                            type="tel"
                            inputMode="tel"
                            placeholder={p.receiverPhonePlaceholder}
                            error={errors.receiverPhone?.message}
                            {...register("receiverPhone")}
                          />
                        </div>
                        <FormField label={p.address} icon={MapPin} placeholder={p.addressPlaceholder} error={errors.address?.message} {...register("address")} />
                      </>
                    )}
                    {step === 2 && (
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_180px]">
                        <FormField label={p.title} icon={Package} placeholder={p.titlePlaceholder} autoFocus error={errors.title?.message} {...register("title")} />
                        <FormField label={p.weight} icon={Scale} inputMode="decimal" placeholder={p.weightPlaceholder} error={errors.weight?.message} {...register("weight")} />
                      </div>
                    )}
                    {step === 3 && (
                      <div className="space-y-2.5">
                        {summary.map((row, i) => (
                          <ReviewRow key={row.label} {...row} onEdit={() => go(i === 0 ? 0 : i <= 3 ? 1 : 2)} />
                        ))}
                        {create.isError && (
                          <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                            <AlertCircle className="mt-0.5 size-4 shrink-0" /> {getErrorMessage(create.error)}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-8 flex items-center justify-between gap-3 border-t pt-6">
                <Button type="button" variant="ghost" size="xl" onClick={() => go(step - 1)} disabled={step === 0} className={step === 0 ? "invisible" : ""}>
                  <ArrowLeft data-icon="inline-start" /> {dict.common.back}
                </Button>
                {/* separate keys: reusing one <button> and flipping it to type="submit" mid-click would submit the form */}
                {step < 3 ? (
                  <Button key="next" type="button" size="xl" onClick={() => go(step + 1)}>
                    {dict.common.next} <ArrowRight data-icon="inline-end" />
                  </Button>
                ) : (
                  <Button key="submit" type="submit" size="xl" className="shadow-glow" disabled={create.isPending}>
                    {create.isPending ? <Spinner /> : <PackageCheck data-icon="inline-start" />}
                    {t.submit}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* live summary */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 overflow-hidden rounded-2xl border bg-card shadow-soft">
            <div className="h-1.5 bg-gradient-to-r from-primary via-chart-5 to-highlight" />
            <div className="space-y-4 p-5">
              <p className="text-sm font-semibold">{t.steps[3]}</p>
              {summary.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-3">
                  <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className={cn("truncate text-sm", value ? "font-medium" : "text-muted-foreground/60")}>{value || "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
