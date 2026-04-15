"use client";

import { useTheme } from "next-themes";

import { PageIntro } from "@/components/page-intro";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { appConfig, getApiBaseUrl } from "@/lib/config";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";
import { useSettings } from "@/providers/settings-provider";

const strategies = ["auto", "groq", "openrouter", "mock"] as const;

export default function SettingsPage() {
  const { locale } = useI18n();
  const t = (ru: string, en: string) => pickLocale(locale, { ru, en });
  const { resolvedTheme } = useTheme();
  const apiBaseUrl = getApiBaseUrl();
  const {
    defaultStrategy,
    streamingEnabled,
    subtleDemoHints,
    setDefaultStrategy,
    setStreamingEnabled,
    setSubtleDemoHints
  } = useSettings();

  return (
    <div className="min-w-0 space-y-8">
      <PageIntro
        eyebrow={t("Настройки workspace", "Workspace Settings")}
        title={t("Настройка маршрутизации без переноса секретов в клиент", "Tune routing defaults without moving secrets to the client")}
        description={t(
          "Эти настройки меняют только клиентское поведение и UI-предпочтения. Ключи провайдеров и реальная оркестрация остаются внутри Worker.",
          "These settings only change client behavior and UI preferences. Provider secrets and real orchestration remain inside the Worker."
        )}
      />

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("Стратегия по умолчанию", "Default strategy")}</CardTitle>
            <CardDescription>{t("Определяет стартовый routing mode для playground composer.", "Controls the initial routing mode for the playground composer.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {strategies.map((strategy) => (
                <Button key={strategy} variant={defaultStrategy === strategy ? "default" : "secondary"} size="sm" onClick={() => setDefaultStrategy(strategy)}>
                  {strategy}
                </Button>
              ))}
            </div>
            <div className="panel-subtle p-4 text-sm text-muted-foreground">
              <div className="font-medium text-foreground">{t("Auto остается рекомендуемым режимом.", "Auto remains the recommended mode.")}</div>
              <div className="mt-2">
                {t(
                  "Он отражает реальную историю gateway: сначала Groq Free, затем OpenRouter и затем demo-safe mock provider.",
                  "It preserves the real gateway story by preferring Groq Free, then OpenRouter, then the demo-safe mock provider."
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("Параметры рантайма", "Runtime preferences")}</CardTitle>
            <CardDescription>{t("Только клиентские дефолты. Секреты остаются в Worker.", "Client-side defaults only. Secrets remain on the Worker.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="panel-subtle flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="font-medium text-foreground">{t("Предпочтение стриминга", "Streaming preference")}</div>
                <div className="text-sm text-muted-foreground">{t("Использовать POST /api/v1/stream по умолчанию в playground.", "Use POST /api/v1/stream by default in the playground.")}</div>
              </div>
              <Switch checked={streamingEnabled} onCheckedChange={setStreamingEnabled} />
            </div>
            <div className="panel-subtle flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="font-medium text-foreground">{t("Ненавязчивые demo-подсказки", "Subtle demo hints")}</div>
                <div className="text-sm text-muted-foreground">{t("Показывать индикаторы demo-режима, но без визуального шума.", "Keep demo-mode indicators visible but low-noise.")}</div>
              </div>
              <Switch checked={subtleDemoHints} onCheckedChange={setSubtleDemoHints} />
            </div>
            <div className="panel-subtle flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="font-medium text-foreground">{t("Тема", "Theme")}</div>
                <div className="text-sm text-muted-foreground">
                  {t("Текущая тема", "Current theme")}:{" "}
                  {resolvedTheme === "dark"
                    ? t("темная", "dark")
                    : resolvedTheme === "light"
                      ? t("светлая", "light")
                      : t("загрузка", "loading")}
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
            <CardTitle>{t("Целевой frontend", "Frontend target")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="font-medium text-foreground">{appConfig.environment}</div>
            <div>{t("Статический export Next.js, оптимизированный под Cloudflare Pages.", "Static Next.js export optimized for Cloudflare Pages.")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("Базовый URL API", "API base URL")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="font-mono text-xs text-foreground break-all">{apiBaseUrl}</div>
            <div>{t("Подставляется на этапе сборки через NEXT_PUBLIC_API_BASE_URL.", "Injected at build time through NEXT_PUBLIC_API_BASE_URL.")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("Граница безопасности", "Security boundary")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <Badge variant="accent">{t("Только Worker", "Worker only")}</Badge>
            <div>{t("Ключи Groq и OpenRouter не попадают во frontend env. Клиент знает только публичный API base URL.", "Groq and OpenRouter keys never move into frontend env. The client only knows the public API base URL.")}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
