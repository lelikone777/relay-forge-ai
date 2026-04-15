"use client";

import { ArrowRight, FileText, Shield, Waves } from "lucide-react";
import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

export function SiteFooter() {
  const { locale } = useI18n();

  return (
    <footer className="relative overflow-hidden px-6 py-24 lg:px-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 h-[420px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-t from-cyan-500/12 via-violet-500/10 to-transparent blur-[110px] dark:from-cyan-500/16 dark:via-violet-500/14" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="landing-card relative mb-16 overflow-hidden p-8 shadow-2xl sm:p-12 lg:p-16">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/6 via-violet-500/6 to-blue-500/6" />

          <div className="relative space-y-6 text-center">
            <Badge variant="accent">{pickLocale(locale, { ru: "Следующий шаг", en: "Next step" })}</Badge>
            <h2 className="text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {pickLocale(locale, {
                ru: "Перейти от лендинга к рабочему workspace",
                en: "Move from the landing page into the working workspace"
              })}
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">
              {pickLocale(locale, {
                ru: "Интерфейс уже подключен к Worker: можно отправлять запросы, смотреть статус провайдеров, usage и историю fallback в живом режиме.",
                en: "The interface is already connected to the Worker, so you can send requests and inspect provider status, usage and fallback history live."
              })}
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button asChild size="lg">
                <Link href="/app/playground">
                  {pickLocale(locale, { ru: "Открыть workspace", en: "Open workspace" })}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/docs">
                  <FileText className="h-4 w-4" />
                  {pickLocale(locale, { ru: "Документация API", en: "API documentation" })}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr_0.75fr_0.9fr]">
          <div className="space-y-4">
            <BrandMark />
            <p className="max-w-sm text-sm leading-7 text-muted-foreground">
              {pickLocale(locale, {
                ru: "Единый AI gateway с потоковым выводом, fallback-оркестрацией и реальной наблюдаемостью поверх Worker API.",
                en: "A unified AI gateway with streaming, fallback orchestration and real observability on top of the Worker API."
              })}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success">
                <Waves className="h-3.5 w-3.5" />
                SSE
              </Badge>
              <Badge>
                <Shield className="h-3.5 w-3.5" />
                {pickLocale(locale, { ru: "секреты в Worker", en: "Worker-held secrets" })}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              {pickLocale(locale, { ru: "Продукт", en: "Product" })}
            </h4>
            <div className="space-y-3">
              {[
                ["/#features", pickLocale(locale, { ru: "Возможности", en: "Features" })],
                ["/#architecture", pickLocale(locale, { ru: "Архитектура", en: "Architecture" })],
                ["/docs", pickLocale(locale, { ru: "Документация", en: "Documentation" })],
                ["/app/playground", pickLocale(locale, { ru: "Workspace", en: "Workspace" })]
              ].map(([href, label]) => (
                <Link key={href} href={href} className="block text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              {pickLocale(locale, { ru: "Рантайм", en: "Runtime" })}
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>Next.js App Router</div>
              <div>Cloudflare Worker</div>
              <div>TanStack Query</div>
              <div>@relayforge/shared</div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              {pickLocale(locale, { ru: "Границы системы", en: "System boundaries" })}
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>{pickLocale(locale, { ru: "Публичный env только для API base URL", en: "Public env only for the API base URL" })}</div>
              <div>{pickLocale(locale, { ru: "Логи и usage хранятся in-memory в текущей сборке", en: "Logs and usage are in-memory in the current build" })}</div>
              <div>{pickLocale(locale, { ru: "Mock-провайдер сохраняет рабочий demo-path", en: "The mock provider preserves a working demo path" })}</div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/70 pt-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between dark:border-white/10">
          <div>© 2026 RelayForge AI</div>
          <div>
            {pickLocale(locale, {
              ru: "Дизайн привязан к живому продуктовому слою: routing, streaming, status, logs и usage.",
              en: "The design is now bound to the live product layer: routing, streaming, status, logs and usage."
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
