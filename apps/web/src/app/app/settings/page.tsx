"use client";

import { useTheme } from "next-themes";

import { PageIntro } from "@/components/page-intro";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { appConfig } from "@/lib/config";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";
import { useSettings } from "@/providers/settings-provider";

const strategies = ["auto", "groq", "openrouter", "mock"] as const;

export default function SettingsPage() {
  const { locale } = useI18n();
  const { resolvedTheme } = useTheme();
  const {
    defaultStrategy,
    streamingEnabled,
    subtleDemoHints,
    setDefaultStrategy,
    setStreamingEnabled,
    setSubtleDemoHints
  } = useSettings();

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow={pickLocale(locale, { ru: "Настройки Workspace", en: "Workspace Settings" })}
        title={pickLocale(locale, {
          ru: "Настройте стратегию по умолчанию и поведение демо-режима",
          en: "Tune default routing and explain demo behavior"
        })}
        description={pickLocale(locale, {
          ru: "Настройки намеренно легкие для надежности публичного демо: один workspace, предсказуемые дефолты и без auth-сложности.",
          en: "Settings stay intentionally lightweight to preserve public reliability: one workspace, predictable defaults and no auth complexity."
        })}
      />

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>{pickLocale(locale, { ru: "Стратегия по умолчанию", en: "Default strategy" })}</CardTitle>
            <CardDescription>
              {pickLocale(locale, {
                ru: "Определяет начальный режим маршрутизации для редактора в песочнице.",
                en: "Controls the initial routing mode for the playground composer."
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {strategies.map((strategy) => (
                <Button
                  key={strategy}
                  variant={defaultStrategy === strategy ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setDefaultStrategy(strategy)}
                >
                  {strategy}
                </Button>
              ))}
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
              <div className="font-medium text-foreground">
                {pickLocale(locale, { ru: "Auto остается рекомендованным режимом.", en: "Auto remains the recommended mode." })}
              </div>
              <div className="mt-2">
                {pickLocale(locale, {
                  ru: "Он сохраняет корректную gateway-логику: сначала Groq Free, затем OpenRouter и затем demo-safe mock-провайдер.",
                  en: "It preserves the gateway story by preferring Groq Free, then OpenRouter, then the demo-safe mock provider."
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{pickLocale(locale, { ru: "Параметры runtime", en: "Runtime preferences" })}</CardTitle>
            <CardDescription>
              {pickLocale(locale, {
                ru: "Только client-side дефолты. Секреты остаются в Worker.",
                en: "Client-side defaults only. Secrets remain on the Worker."
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 p-4">
              <div>
                <div className="font-medium text-foreground">
                  {pickLocale(locale, { ru: "Предпочтение стриминга", en: "Streaming preference" })}
                </div>
                <div className="text-sm text-muted-foreground">
                  {pickLocale(locale, {
                    ru: "Использовать `POST /api/v1/stream` по умолчанию в песочнице.",
                    en: "Use `POST /api/v1/stream` by default in the playground."
                  })}
                </div>
              </div>
              <Switch checked={streamingEnabled} onCheckedChange={setStreamingEnabled} />
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 p-4">
              <div>
                <div className="font-medium text-foreground">
                  {pickLocale(locale, { ru: "Ненавязчивые demo-подсказки", en: "Subtle demo hints" })}
                </div>
                <div className="text-sm text-muted-foreground">
                  {pickLocale(locale, {
                    ru: "Показывать индикаторы demo-режима без визуального шума.",
                    en: "Keep demo-mode indicators visible but low-noise."
                  })}
                </div>
              </div>
              <Switch checked={subtleDemoHints} onCheckedChange={setSubtleDemoHints} />
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 p-4">
              <div>
                <div className="font-medium text-foreground">{pickLocale(locale, { ru: "Тема", en: "Theme" })}</div>
                <div className="text-sm text-muted-foreground">
                  {pickLocale(locale, { ru: "Текущая тема", en: "Current theme" })}: {resolvedTheme ?? pickLocale(locale, { ru: "загрузка", en: "loading" })}
                </div>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{pickLocale(locale, { ru: "Целевая платформа frontend", en: "Frontend target" })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="font-medium text-foreground">
              {pickLocale(locale, { ru: "Cloudflare Pages + Workers", en: appConfig.environment })}
            </div>
            <div>
              {pickLocale(locale, {
                ru: "Статический Next.js export, оптимизированный под Cloudflare Pages.",
                en: "Static Next.js export optimized for Cloudflare Pages."
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{pickLocale(locale, { ru: "Базовый URL API", en: "API base URL" })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="font-mono text-xs text-foreground">{appConfig.apiBaseUrl}</div>
            <div>
              {pickLocale(locale, {
                ru: "Вставляется на этапе сборки через `NEXT_PUBLIC_API_BASE_URL`.",
                en: "Injected at build time through `NEXT_PUBLIC_API_BASE_URL`."
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{pickLocale(locale, { ru: "Архитектура демо", en: "Demo architecture" })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <Badge variant="accent">{pickLocale(locale, { ru: "Без auth-стены", en: "No auth wall" })}</Badge>
            <div>
              {pickLocale(locale, {
                ru: "Один общий workspace поддерживает надежность публичного демо при free-tier ограничениях.",
                en: "Single shared workspace keeps the public demo reliable under free-tier constraints."
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
