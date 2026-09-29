"use client";

import { MapPinOff } from "lucide-react";
import { StatusScreen } from "@/components/shared/status-screen";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { dict } = useI18n();
  return <StatusScreen code={dict.errors.notFoundCode} icon={MapPinOff} title={dict.errors.notFoundTitle} text={dict.errors.notFoundText} />;
}
