"use client";

import { useQuery } from "@tanstack/react-query";
import { Gauge, LoaderCircle, RotateCcw, Send, Sparkles, Square, Waves } from "lucide-react";
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
  const t = (ru: string, en: string) => pickLocale(locale, { ru, en });
  const { data: statusData } = useQuery({
    queryKey: ["provider-status"],
    queryFn: fetchProviderStatus
  });
  const { defaultStrategy, streamingEnabled } = useSettings();
  const [prompt, setPrompt] = useState(
    pickLocale(locale, {
      ru: "Сформируй короткий launch note для AI gateway, который автоматически переключается с Groq Free на OpenRouter и затем на mock-провайдера.",
      en: "Draft a short launch note for an AI gateway that automatically falls back from Groq Free to OpenRouter and finally to a mock provider."
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
        label: responseMeta.fallbackActivated ? t("fallback активирован", "fallback activated") : t("без fallback", "direct hit"),
        tone: "warning" as const
      },
      {
        label: responseMeta.demoMode
          ? t("демо режим", "demo mode")
          : responseMeta.degradedMode
            ? t("режим деградации", "degraded mode")
            : t("нормально", "normal"),
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
        ? t("Опиши ответ, который должен пройти через RelayForge.", "Describe the response you want routed through RelayForge.")
        : current
    );
  }, [locale]);

  return (
    <div className="min-w-0 space-y-8">
      <PageIntro
        eyebrow={t("Ключевой сценарий", "Core Experience")}
        title={t("Запуск промптов через рабочий gateway workspace", "Run prompts through the live gateway workspace")}
        description={t(
          "Экран использует реальные chat и streaming endpoints. Ответ приходит из Worker, а интерфейс показывает strategy, fallback, final provider и latency в одном месте.",
          "This screen uses the real chat and streaming endpoints. The Worker returns the response while the interface surfaces strategy, fallback, final provider and latency in one place."
        )}
        actions={
          <>
            <Badge variant="accent">POST /api/v1/stream</Badge>
            <Badge>{streamingEnabled ? t("стриминг включен", "streaming on") : t("стриминг выключен", "streaming off")}</Badge>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.95fr)]">
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>{t("Редактор запроса", "Prompt composer")}</CardTitle>
                <CardDescription>
                  {t("Один payload, несколько стратегий маршрутизации и реальный streaming transport.", "One payload, multiple routing strategies and a real streaming transport.")}
                </CardDescription>
              </div>
              <Badge variant="accent">{strategy}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {strategies.map((item) => (
                <Button key={item} variant={strategy === item ? "default" : "secondary"} size="sm" onClick={() => setStrategy(item)}>
                  {item}
                </Button>
              ))}
            </div>

            <Textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder={t("Опишите ответ, который должен пройти через gateway.", "Describe the response that should pass through the gateway.")}
              className="min-h-[18rem]"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="panel-subtle p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Режим", "Mode")}</div>
                <div className="mt-3 flex items-center gap-2">
                  <ModePill mode={statusData?.data.mode ?? "demo"} />
                </div>
              </div>
              <div className="panel-subtle p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Стриминг", "Streaming")}</div>
                <div className="mt-3 text-sm text-foreground">
                  {streamingEnabled ? t("Включен по умолчанию", "Enabled by default") : t("Отключен в настройках", "Disabled in settings")}
                </div>
              </div>
              <div className="panel-subtle p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Порядок fallback", "Fallback order")}</div>
                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <div>1. Groq</div>
                  <div>2. OpenRouter</div>
                  <div>3. Mock</div>
                </div>
              </div>
              <div className="panel-subtle p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Публичное демо", "Public demo")}</div>
                <div className="mt-3 text-sm text-foreground">
                  {t("Если upstream недоступен, mock сохраняет тестируемость публичного интерфейса.", "If upstream providers fail, mock keeps the public interface testable.")}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => void submit({ prompt, strategy, streamingEnabled })} disabled={isStreaming || prompt.trim().length === 0}>
                {isStreaming ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {t("Отправить запрос", "Send request")}
              </Button>
              <Button onClick={() => void (isStreaming ? stop() : retry())} variant="secondary">
                {isStreaming ? <Square className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                {isStreaming ? t("Остановить стрим", "Stop stream") : t("Повторить", "Retry")}
              </Button>
              <Button onClick={clear} variant="ghost">
                {t("Сброс", "Reset")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="min-h-[30rem] overflow-hidden">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>{t("Потоковый ответ", "Streaming response")}</CardTitle>
                  <CardDescription>
                    {t("Живой вывод токенов, метаданных и ошибок без смены layout.", "Live token output, metadata and errors without forcing a layout change.")}
                  </CardDescription>
                </div>
                {isStreaming ? <Badge variant="accent">{t("живой стрим", "live stream")}</Badge> : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {responseText ? (
                <div className="panel-inset min-h-[18rem] p-5 font-mono text-sm leading-7 text-foreground whitespace-pre-wrap break-words">
                  {responseText}
                  {isStreaming ? <span className="animate-blink">|</span> : null}
                </div>
              ) : (
                <EmptyState
                  title={t("Ответа пока нет", "No response yet")}
                  description={t(
                    "Запустите запрос, чтобы увидеть stream tokens, provider metadata и нормализованные fallback-события.",
                    "Run a request to inspect stream tokens, provider metadata and normalized fallback events."
                  )}
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

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("Метаданные запроса", "Request metadata")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start justify-between gap-4">
                  <span>{t("Выбранная стратегия", "Selected strategy")}</span>
                  <span className="text-safe text-right text-foreground break-words">{strategy}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span>{t("Запущено", "Started at")}</span>
                  <span className="text-safe text-right text-foreground break-words">
                    {requestStartedAt ? formatTimestamp(requestStartedAt) : t("Ожидание", "Idle")}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span>{t("Транспорт", "Transport")}</span>
                  <span className="text-safe text-right text-foreground break-words">{streamingEnabled ? "text/event-stream" : "json"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("Метаданные ответа", "Response metadata")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start justify-between gap-4">
                  <span>{t("Провайдер попытки", "Attempted provider")}</span>
                  <span className="text-safe text-right text-foreground break-words">{responseMeta?.attemptedProvider ?? t("В ожидании", "Pending")}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span>{t("Финальный провайдер", "Final provider")}</span>
                  <span className="text-safe text-right text-foreground break-words">{responseMeta?.finalProvider ?? t("В ожидании", "Pending")}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span>{t("Задержка", "Latency")}</span>
                  <span className="text-safe text-right text-foreground break-words">{responseMeta ? formatDuration(responseMeta.latencyMs) : t("В ожидании", "Pending")}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span>{t("Fallback", "Fallback")}</span>
                  <span className="text-safe text-right text-foreground break-words">{responseMeta?.fallbackActivated ? t("Активирован", "Activated") : t("Нет", "No")}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("Лента провайдеров", "Provider rail")}</CardTitle>
          <CardDescription>
            {t(
              "Текущий snapshot берется из Worker status endpoint и помогает проверить готовность цепочки провайдеров.",
              "The current snapshot comes from the Worker status endpoint and verifies readiness across the provider chain."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          {statusData?.data.providers.map((provider) => (
            <div key={provider.id} className="panel-subtle p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="font-display text-lg font-semibold text-foreground">{provider.label}</div>
                  <div className="text-sm text-muted-foreground">{provider.description}</div>
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
                    <Waves className="h-3 w-3" />
                    {t("стриминг", "streaming")}
                  </Badge>
                ) : null}
                {provider.freeTierReady ? (
                  <Badge variant="warning">
                    <Sparkles className="h-3 w-3" />
                    {t("готов к free tier", "free-tier ready")}
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
