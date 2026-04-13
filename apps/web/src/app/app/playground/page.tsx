"use client";

import { useQuery } from "@tanstack/react-query";
import { Gauge, LoaderCircle, RotateCcw, Send, Sparkles, Square } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { StrategyId } from "@relayforge/shared";

import { PageIntro } from "@/components/page-intro";
import { ModePill, ProviderStatusPill } from "@/components/status-pill";
import { EmptyState } from "@/components/states/empty-state";
import { InlineError } from "@/components/states/inline-error";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { usePlayground } from "@/hooks/use-playground";
import { fetchProviderStatus } from "@/lib/api";
import { formatDuration, formatTimestamp } from "@/lib/format";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";
import { useSettings } from "@/providers/settings-provider";

const strategies: StrategyId[] = ["auto", "groq", "openrouter", "mock"];

export default function PlaygroundPage() {
  const { locale } = useI18n();
  const { data: statusData } = useQuery({
    queryKey: ["provider-status"],
    queryFn: fetchProviderStatus
  });
  const { defaultStrategy, streamingEnabled } = useSettings();
  const [prompt, setPrompt] = useState(
    pickLocale(locale, {
      ru: "Сформируй короткий launch-note для AI gateway, который автоматически переключается с Groq Free на OpenRouter и затем на mock-провайдера.",
      en: "Design a concise rollout note for an AI gateway that automatically falls back from Groq Free to OpenRouter and finally to a mock provider."
    })
  );
  const [strategy, setStrategy] = useState<StrategyId>(defaultStrategy);
  const { responseText, responseMeta, error, isStreaming, requestStartedAt, submit, stop, retry, clear } =
    usePlayground();

  const responseBadges = useMemo(() => {
    if (!responseMeta) {
      return [];
    }

    return [
      { label: responseMeta.finalProvider, tone: "accent" as const },
      { label: responseMeta.model, tone: "default" as const },
      {
        label: responseMeta.fallbackActivated
          ? pickLocale(locale, { ru: "fallback активирован", en: "fallback activated" })
          : pickLocale(locale, { ru: "без fallback", en: "direct hit" }),
        tone: "warning" as const
      },
      {
        label: responseMeta.demoMode
          ? pickLocale(locale, { ru: "демо режим", en: "demo mode" })
          : responseMeta.degradedMode
            ? pickLocale(locale, { ru: "режим деградации", en: "degraded mode" })
            : pickLocale(locale, { ru: "нормально", en: "normal" }),
        tone: "success" as const
      }
    ];
  }, [locale, responseMeta]);

  useEffect(() => {
    setStrategy(defaultStrategy);
  }, [defaultStrategy]);

  useEffect(() => {
    setPrompt((current) =>
      current.trim().length === 0
        ? pickLocale(locale, {
            ru: "Опиши желаемый ответ для маршрутизации через RelayForge.",
            en: "Describe the response you want routed through RelayForge."
          })
        : current
    );
  }, [locale]);

  return (
    <div className="min-w-0 space-y-8">
      <PageIntro
        eyebrow={pickLocale(locale, { ru: "Ключевой Сценарий", en: "Core Experience" })}
        title={pickLocale(locale, {
          ru: "Запускайте промпты через отказоустойчивый AI gateway",
          en: "Run prompts through a resilient AI gateway"
        })}
        description={pickLocale(locale, {
          ru: "RelayForge стримит ответ по мере генерации, показывает метаданные провайдера и сохраняет стабильный UX при проблемах апстрима.",
          en: "RelayForge streams responses progressively, surfaces provider metadata and preserves a clean UX when upstream providers degrade."
        })}
        actions={
          <>
            <Badge variant="accent">POST /api/v1/stream</Badge>
            <Badge>
              {streamingEnabled
                ? pickLocale(locale, { ru: "стриминг включен", en: "streaming on" })
                : pickLocale(locale, { ru: "стриминг выключен", en: "streaming off" })}
            </Badge>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(360px,1fr)]">
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>{pickLocale(locale, { ru: "Редактор промпта", en: "Prompt composer" })}</CardTitle>
                <CardDescription>
                  {pickLocale(locale, {
                    ru: "Единая API-поверхность и маршрутизация по стратегии.",
                    en: "One API surface. Strategy-aware provider routing."
                  })}
                </CardDescription>
              </div>
              <Badge variant="accent">{strategy}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {strategies.map((item) => (
                <Button
                  key={item}
                  variant={strategy === item ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setStrategy(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
            <Textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder={pickLocale(locale, {
                ru: "Опишите ответ, который нужно маршрутизировать через RelayForge.",
                en: "Describe the response you want routed through RelayForge."
              })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {pickLocale(locale, { ru: "Режим", en: "Mode" })}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <ModePill mode={statusData?.data.mode ?? "demo"} />
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {pickLocale(locale, { ru: "Стриминг", en: "Streaming" })}
                </div>
                <div className="text-safe mt-2 text-sm text-foreground">
                  {streamingEnabled
                    ? pickLocale(locale, { ru: "Включен по умолчанию", en: "Enabled by default" })
                    : pickLocale(locale, { ru: "Отключен в настройках", en: "Disabled by preference" })}
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {pickLocale(locale, { ru: "Порядок fallback", en: "Fallback order" })}
                </div>
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <div>1. Groq</div>
                  <div>2. OpenRouter</div>
                  <div>3. Mock</div>
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {pickLocale(locale, { ru: "Публичное демо", en: "Public demo" })}
                </div>
                <div className="text-safe mt-2 text-sm text-foreground">
                  {pickLocale(locale, {
                    ru: "Всегда тестируется через mock fallback.",
                    en: "Always testable via mock fallback."
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => void submit({ prompt, strategy, streamingEnabled })}
                disabled={isStreaming || prompt.trim().length === 0}
              >
                {isStreaming ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {pickLocale(locale, { ru: "Отправить запрос", en: "Send request" })}
              </Button>
              <Button onClick={() => void (isStreaming ? stop() : retry())} variant="secondary">
                {isStreaming ? <Square className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                {isStreaming
                  ? pickLocale(locale, { ru: "Остановить стрим", en: "Stop stream" })
                  : pickLocale(locale, { ru: "Повторить", en: "Retry" })}
              </Button>
              <Button onClick={clear} variant="ghost">
                {pickLocale(locale, { ru: "Сброс", en: "Reset" })}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="min-h-[27rem] overflow-hidden">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>{pickLocale(locale, { ru: "Стриминг ответа", en: "Streaming response" })}</CardTitle>
                  <CardDescription>
                    {pickLocale(locale, {
                      ru: "Постепенная отрисовка с нормализованными метаданными.",
                      en: "Progressive rendering with normalized metadata."
                    })}
                  </CardDescription>
                </div>
                {isStreaming ? <Badge variant="accent">{pickLocale(locale, { ru: "живой стрим", en: "live stream" })}</Badge> : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {responseText ? (
                <div className="rounded-2xl border border-border/70 bg-background/70 p-5 font-mono text-sm leading-7 text-foreground whitespace-pre-wrap break-words">
                  {responseText}
                  {isStreaming ? <span className="animate-blink">|</span> : null}
                </div>
              ) : (
                <EmptyState
                  title={pickLocale(locale, { ru: "Ответа пока нет", en: "No response yet" })}
                  description={pickLocale(locale, {
                    ru: "Запустите промпт, чтобы посмотреть токены стрима, fallback-метаданные и задержку без смены layout.",
                    en: "Run a prompt to inspect streaming tokens, fallback metadata and latency without leaving the current layout."
                  })}
                />
              )}

              {responseBadges.length ? (
                <div className="flex flex-wrap gap-2">
                  {responseBadges.map((item) => (
                    <Badge key={item.label} variant={item.tone}>
                      {item.label}
                    </Badge>
                  ))}
                </div>
              ) : null}

              {error ? (
                <InlineError
                  title={error.code.replaceAll("_", " ")}
                  description={error.message}
                  onRetry={() => {
                    void retry();
                  }}
                />
              ) : null}
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{pickLocale(locale, { ru: "Метаданные запроса", en: "Request metadata" })}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start justify-between gap-4">
                  <span>{pickLocale(locale, { ru: "Выбранная стратегия", en: "Selected strategy" })}</span>
                  <span className="text-safe text-right text-foreground break-words">{strategy}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span>{pickLocale(locale, { ru: "Старт", en: "Started at" })}</span>
                  <span className="text-safe text-right text-foreground break-words">
                    {requestStartedAt ? formatTimestamp(requestStartedAt) : pickLocale(locale, { ru: "Ожидание", en: "Idle" })}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span>{pickLocale(locale, { ru: "Транспорт", en: "Transport" })}</span>
                  <span className="text-safe text-right text-foreground break-words">{streamingEnabled ? "text/event-stream" : "json"}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{pickLocale(locale, { ru: "Метаданные ответа", en: "Response metadata" })}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start justify-between gap-4">
                  <span>{pickLocale(locale, { ru: "Изначальный провайдер", en: "Attempted provider" })}</span>
                  <span className="text-safe text-right text-foreground break-words">
                    {responseMeta?.attemptedProvider ?? pickLocale(locale, { ru: "Ожидание", en: "Pending" })}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span>{pickLocale(locale, { ru: "Финальный провайдер", en: "Final provider" })}</span>
                  <span className="text-safe text-right text-foreground break-words">
                    {responseMeta?.finalProvider ?? pickLocale(locale, { ru: "Ожидание", en: "Pending" })}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span>{pickLocale(locale, { ru: "Задержка", en: "Latency" })}</span>
                  <span className="text-safe text-right text-foreground break-words">
                    {responseMeta ? formatDuration(responseMeta.latencyMs) : pickLocale(locale, { ru: "Ожидание", en: "Pending" })}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span>{pickLocale(locale, { ru: "Fallback", en: "Fallback" })}</span>
                  <span className="text-safe text-right text-foreground break-words">
                    {responseMeta?.fallbackActivated
                      ? pickLocale(locale, { ru: "Активирован", en: "Activated" })
                      : pickLocale(locale, { ru: "Нет", en: "No" })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{pickLocale(locale, { ru: "Лента провайдеров", en: "Provider rail" })}</CardTitle>
          <CardDescription>
            {pickLocale(locale, {
              ru: "Текущий health-снимок с Worker endpoint статуса.",
              en: "Current health snapshot from the Worker status endpoint."
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          {statusData?.data.providers.map((provider) => (
            <div key={provider.id} className="rounded-2xl border border-border/70 bg-background/60 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="font-display text-lg font-semibold">{provider.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {locale === "ru"
                      ? provider.id === "groq"
                        ? "Основной low-latency путь для режима Auto."
                        : provider.id === "openrouter"
                          ? "Резервный free-tier слой, включается при проблемах Groq."
                          : "Гарантированный demo-safe провайдер с псевдо-стримингом."
                      : provider.description}
                  </div>
                </div>
                <ProviderStatusPill status={provider.status} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge>{provider.model}</Badge>
                <Badge variant="accent">
                  <Gauge className="h-3 w-3" />
                  {formatDuration(provider.latencyMs)}
                </Badge>
                {provider.supportsStreaming ? (
                  <Badge variant="success">
                    <Sparkles className="h-3 w-3" />
                    {pickLocale(locale, { ru: "стриминг", en: "streaming" })}
                  </Badge>
                ) : null}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
