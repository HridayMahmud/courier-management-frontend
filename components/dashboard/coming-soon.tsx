"use client";

import { Construction } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/en";

// Temporary page body until the section is built in its own step.
export function ComingSoon({ navKey }: { navKey: keyof Dictionary["nav"] }) {
  const { dict } = useI18n();
  const title = dict.nav[navKey];
  return (
    <>
      <PageHeader title={title} />
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Construction className="size-6" />
          </span>
          <p className="max-w-sm text-sm text-muted-foreground">{dict.common.comingSoon}</p>
        </CardContent>
      </Card>
    </>
  );
}
