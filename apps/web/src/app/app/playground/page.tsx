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
        label: responseMeta.fallbackActivated ? t("fallback активирован", "fallback activated") : t("без fallback", "direct hit"),
        tone: "warning" as const
      },
      {
        label: responseMeta.demoMode
          ? t("demo mode", "demo mode")
          : responseMeta.degradedMode
            ? t("degraded mode", "degraded mode")
            : t("normal", "normal"),
        tone: "success" as const
      }
    ];
  }, [responseMeta, locale]);

  useEffect(() => {
    setStrategy(defaultStrategy);
  }, [defaultStrategy]);

  useEffect(() => {
    setPrompt((current) =>
      current.trim().length === 0
        ? t(
            "Опиши ответ, который нужно маршрутизировать через RelayForge.",
            "Describe the response you want routed through RelayForge."
          )
        : current
    );
  }, [locale]);

  return (
    <div className="min-w-0 space-y-8">
      <PageIntro
        eyebrow={t("Core Experience", "Core Experience")}
        title={t("Run prompts through the rebuilt gateway workspace", "Run prompts through the rebuilt gateway workspace")}
        description={t(
          "Этот экран использует реальные endpoints чата и стриминга: ответ приходит из Worker, а UI показывает метаданные маршрутизации, fallback и latency в новом интерфейсе.",
          "This screen uses the real chat and streaming endpoints: the response comes from the Worker while the UI exposes routing metadata, fallback and latency inside the rebuilt interface."
        )}
        actions={
          <>
            <Badge variant="accent">POST /api/v1/stream</Badge>
            <Badge>{streamingEnabled ? t("streaming on", "streaming on") : t("streaming off", "streaming off")}</Badge>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.95fr)]">
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>{t("Prompt composer", "Prompt composer")}</CardTitle>
                <CardDescription>
                  {t("Один payload, несколько стратегий маршрутизации и реальный stream transport.", "One payload, multiple routing strategies and a real streaming transport.")}
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
              placeholder={t(
                "Опишите ответ, который должен пройти через gateway.",
                "Describe the response that should pass through the gateway."
              )}
              className="min-h-[18rem]"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Mode", "Mode")}</div>
                <div className="mt-3 flex items-center gap-2">
                  <ModePill mode={statusData?.data.mode ?? "demo"} />
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Streaming", "Streaming")}</div>
                <div className="mt-3 text-sm text-foreground">
                  {streamingEnabled ? t("Enabled by default", "Enabled by default") : t("Disabled in settings", "Disabled in settings")}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Fallback order", "Fallback order")}</div>
                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <div>1. Groq</div>
                  <div>2. OpenRouter</div>
                  <div>3. Mock</div>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Public demo", "Public demo")}</div>
                <div className="mt-3 text-sm text-foreground">
                  {t("Если upstream недоступен, mock сохраняет тестируемость интерфейса.", "If upstream providers fail, mock keeps the interface testable.")}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => void submit({ prompt, strategy, streamingEnabled })}
                disabled={isStreaming || prompt.trim().length === 0}
              >
                {isStreaming ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {t("Send request", "Send request")}
              </Button>
              <Button onClick={() => void (isStreaming ? stop() : retry())} variant="secondary">
                {isStreaming ? <Square className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                {isStreaming ? t("Stop stream", "Stop stream") : t("Retry", "Retry")}
              </Button>
              <Button onClick={clear} variant="ghost">
                {t("Reset", "Reset")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="min-h-[30rem] overflow-hidden">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>{t("Streaming response", "Streaming response")}</CardTitle>
                  <CardDescription>
                    {t("Живой вывод токенов, метаданных и ошибок без смены layout.", "Live token output, metadata and errors without forcing a layout change.")}
                  </CardDescription>
                </div>
                {isStreaming ? <Badge variant="accent">{t("live stream", "live stream")}</Badge> : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {responseText ? (
                <div className="min-h-[18rem] rounded-[1.5rem] border border-white/10 bg-black/30 p-5 font-mono text-sm leading-7 text-foreground whitespace-pre-wrap break-words">
                  {responseText}
                  {isStreaming ? <span className="animate-blink">|</span> : null}
                </div>
              ) : (
                <EmptyState
                  title={t("No response yet", "No response yet")}
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
                <CardTitle className="text-base">{t("Request metadata", "Request metadata")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start justify-between gap-4">
                  <span>{t("Selected strategy", "Selected strategy")}</span>
                  <span className="text-safe text-right text-foreground break-words">{strategy}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span>{t("Started at", "Started at")}</span>
                  <span className="text-safe text-right text-foreground break-words">
                    {requestStartedAt ? formatTimestamp(requestStartedAt) : t("Idle", "Idle")}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span>{t("Transport", "Transport")}</span>
                  <span className="text-safe text-right text-foreground break-words">
                    {streamingEnabled ? "text/event-stream" : "json"}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("Response metadata", "Response metadata")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start justify-between gap-4">
                  <span>{t("Attempted provider", "Attempted provider")}</span>
                  <span className="text-safe text-right text-foreground break-words">{responseMeta?.attemptedProvider ?? t("Pending", "Pending")}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span>{t("Final provider", "Final provider")}</span>
                  <span className="text-safe text-right text-foreground break-words">{responseMeta?.finalProvider ?? t("Pending", "Pending")}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span>{t("Latency", "Latency")}</span>
                  <span className="text-safe text-right text-foreground break-words">
                    {responseMeta ? formatDuration(responseMeta.latencyMs) : t("Pending", "Pending")}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span>{t("Fallback", "Fallback")}</span>
                  <span className="text-safe text-right text-foreground break-words">
                    {responseMeta?.fallbackActivated ? t("Activated", "Activated") : t("No", "No")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("Provider rail", "Provider rail")}</CardTitle>
          <CardDescription>
            {t("Текущий snapshot берется из Worker status endpoint и помогает проверить готовность цепочки.", "The current snapshot comes from the Worker status endpoint and verifies readiness across the provider chain.")}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          {statusData?.data.providers.map((provider) => (
            <div key={provider.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="font-display text-lg font-semibold text-white">{provider.label}</div>
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
                    {t("streaming", "streaming")}
                  </Badge>
                ) : null}
                {provider.freeTierReady ? (
                  <Badge variant="warning">
                    <Sparkles className="h-3 w-3" />
                    {t("free-tier ready", "free-tier ready")}
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
