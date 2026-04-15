"use client";

import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

export default function NotFound() {
  const { locale } = useI18n();

  return (
    <>
      <SiteHeader />
      <div className="shell-container flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
        <div className="eyebrow">404</div>
        <h1 className="font-display text-5xl font-semibold text-white">
          {pickLocale(locale, { ru: "Маршрут не найден", en: "Route not found" })}
        </h1>
        <p className="max-w-xl text-muted-foreground">
          {pickLocale(locale, {
            ru: "Эта страница не существует в текущей сборке RelayForge.",
            en: "This page does not exist in the current RelayForge build."
          })}
        </p>
        <Button asChild>
          <Link href="/app/playground">{pickLocale(locale, { ru: "Открыть Playground", en: "Open Playground" })}</Link>
        </Button>
      </div>
    </>
  );
}
