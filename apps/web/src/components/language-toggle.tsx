"use client";

import { Languages } from "lucide-react";

import { HeaderActionButton, HeaderActionGroup } from "@/components/header-action-button";
import { useI18n } from "@/providers/i18n-provider";

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <HeaderActionGroup>
      <div className="hidden px-2 text-muted-foreground min-[380px]:block">
        <Languages className="h-4 w-4" />
      </div>
      <HeaderActionButton size="compact" variant={locale === "ru" ? "active" : "subtle"} onClick={() => setLocale("ru")}>
        RU
      </HeaderActionButton>
      <HeaderActionButton size="compact" variant={locale === "en" ? "active" : "subtle"} onClick={() => setLocale("en")}>
        EN
      </HeaderActionButton>
    </HeaderActionGroup>
  );
}
