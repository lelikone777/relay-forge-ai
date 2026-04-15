"use client";

import { SearchSlash } from "lucide-react";
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
      <section className="landing-section pt-20">
        <div className="shell-container">
          <div className="mx-auto max-w-3xl">
            <div className="landing-card p-8 text-center sm:p-10">
              <div className="mx-auto inline-flex rounded-full border border-blue-500/25 bg-blue-500/10 p-4 text-blue-700 dark:text-blue-300">
                <SearchSlash className="h-6 w-6" />
              </div>
              <div className="mt-6 space-y-4">
                <div className="eyebrow">404</div>
                <h1 className="text-balance font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  {pickLocale(locale, { ru: "Маршрут не найден", en: "Route not found" })}
                </h1>
                <p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  {pickLocale(locale, {
                    ru: "Эта страница не входит в текущую сборку RelayForge. Вернитесь в рабочий workspace или на главную.",
                    en: "This page is not part of the current RelayForge build. Return to the workspace or the landing page."
                  })}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link href="/app/playground">{pickLocale(locale, { ru: "Открыть песочницу", en: "Open playground" })}</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/">{pickLocale(locale, { ru: "На главную", en: "Back to home" })}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
