"use client";

import type { ModeId, ProviderStatus } from "@relayforge/shared";

import { Badge } from "@/components/ui/badge";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

const providerVariantMap: Record<ProviderStatus["status"], "accent" | "success" | "warning" | "danger"> = {
  live: "success",
  limited: "warning",
  degraded: "danger",
  fallback: "accent",
  "demo-ready": "accent"
};

const modeVariantMap: Record<ModeId, "accent" | "success" | "warning"> = {
  normal: "success",
  degraded: "warning",
  demo: "accent"
};

export function ProviderStatusPill({ status }: { status: ProviderStatus["status"] }) {
  const { locale } = useI18n();

  return (
    <Badge variant={providerVariantMap[status]}>
      {pickLocale(locale, {
        ru:
          status === "live"
            ? "активен"
            : status === "limited"
              ? "ограничен"
              : status === "degraded"
                ? "деградация"
                : status === "fallback"
                  ? "fallback"
                  : "demo-ready",
        en: status
      })}
    </Badge>
  );
}

export function ModePill({ mode }: { mode: ModeId }) {
  const { locale } = useI18n();

  return (
    <Badge variant={modeVariantMap[mode]}>
      {pickLocale(locale, {
        ru: mode === "normal" ? "нормально" : mode === "degraded" ? "деградация" : "демо",
        en: mode
      })}
    </Badge>
  );
}
