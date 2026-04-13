"use client";

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
    <div className="shell-container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="eyebrow">{pickLocale(locale, { ru: "Ошибка маршрута", en: "Route Error" })}</div>
      <h1 className="font-display text-4xl font-semibold">
        {pickLocale(locale, {
          ru: "Интерфейс не смог корректно отрисоваться.",
          en: "UI failed to render cleanly."
        })}
      </h1>
      <p className="max-w-2xl text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>{pickLocale(locale, { ru: "Повторить рендер", en: "Retry render" })}</Button>
    </div>
  );
}
