"use client";

import { AlertTriangle } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale } = useI18n();

  return (
    <>
      <SiteHeader />
      <section className="landing-section pt-20">
        <div className="shell-container">
          <div className="mx-auto max-w-3xl">
            <div className="landing-card p-8 text-center sm:p-10">
              <div className="mx-auto inline-flex rounded-full border border-amber-500/25 bg-amber-500/10 p-4 text-amber-700 dark:text-amber-300">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="mt-6 space-y-4">
                <div className="eyebrow">{pickLocale(locale, { ru: "Ошибка интерфейса", en: "Interface error" })}</div>
                <h1 className="text-balance font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  {pickLocale(locale, {
                    ru: "Экран не смог корректно отрисоваться.",
                    en: "This screen failed to render cleanly."
                  })}
                </h1>
                <p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  {pickLocale(locale, {
                    ru: "Логика продукта не потеряна: можно повторить рендер и заново запросить данные.",
                    en: "The product flow is still recoverable. You can retry the render and request the data again."
                  })}
                </p>
              </div>

              <div className="panel-inset mt-6 p-4 text-left text-sm text-muted-foreground">
                <div className="font-medium text-foreground">Error</div>
                <div className="mt-2 break-words">{error.message}</div>
                {error.digest ? <div className="mt-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">{error.digest}</div> : null}
              </div>

              <div className="mt-6 flex justify-center">
                <Button onClick={reset}>{pickLocale(locale, { ru: "Повторить рендер", en: "Retry render" })}</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
