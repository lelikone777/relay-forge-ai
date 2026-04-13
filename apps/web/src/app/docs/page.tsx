"use client";

import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

const requestExample = `{
  "prompt": "Explain free-tier fallback strategy",
  "options": {
    "strategy": "auto",
    "stream": true,
    "maxTokens": 512,
    "temperature": 0.35
  },
  "metadata": {
    "source": "relayforge-web"
  }
}`;

const responseExample = `{
  "success": true,
  "data": {
    "text": "RelayForge first tries Groq Free...",
    "meta": {
      "strategy": "auto",
      "attemptedProvider": "groq",
      "finalProvider": "openrouter",
      "fallbackActivated": true,
      "degradedMode": true,
      "demoMode": false,
      "latencyMs": 842,
      "model": "meta-llama/llama-3.2-3b-instruct:free",
      "timestamp": "2025-01-01T12:00:00.000Z"
    }
  }
}`;

const errorExample = `{
  "success": false,
  "error": {
    "code": "provider_rate_limited",
    "message": "Groq Free returned a rate-limit response.",
    "technicalDetails": "HTTP 429 from upstream provider",
    "provider": "groq",
    "fallbackActivated": true,
    "timestamp": "2025-01-01T12:00:00.000Z"
  }
}`;

export default function DocsPage() {
  const { locale } = useI18n();
  const t = (ru: string, en: string) => pickLocale(locale, { ru, en });

  const endpoints = [
    ["POST", "/api/v1/chat", t("Нормализованный JSON-ответ с provider-метаданными.", "Normalized JSON response with provider metadata.")],
    ["POST", "/api/v1/stream", t("SSE-совместимый endpoint для прогрессивного стриминга токенов.", "SSE-compatible streaming endpoint for progressive tokens.")],
    ["GET", "/api/v1/providers/status", t("Health-снимок провайдеров и порядок маршрутизации.", "Provider health snapshot and routing order.")],
    ["GET", "/api/v1/logs", t("История последних запросов с fallback-метаданными.", "Recent request history with fallback metadata.")],
    ["GET", "/api/v1/usage", t("Агрегаты использования, задержка и распределение провайдеров.", "Usage aggregates, latency and provider distribution.")]
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SiteHeader />

      <main className="shell-container section-space space-y-10">
        <div className="space-y-5">
          <Badge variant="accent">{t("Документация Для Разработчиков", "Developer Docs")}</Badge>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">RelayForge AI API</h1>
          <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
            {t(
              "RelayForge AI — это serverless AI gateway playground с единым request-контрактом, free-tier-first маршрутизацией провайдеров, стримингом и нормализованной обработкой ошибок.",
              "RelayForge AI is a serverless AI gateway playground with a unified request contract, free-tier-first provider routing, streaming transport and normalized error handling."
            )}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/app/playground">{t("Открыть песочницу", "Open Playground")}</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/app/status">{t("Открыть статус провайдеров", "View Provider Status")}</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>{t("Обзор продукта", "Product overview")}</CardTitle>
              <CardDescription>{t("Одна API-поверхность с устойчивым fallback провайдеров.", "One API surface with resilient provider fallback.")}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              {t(
                "Основная маршрутизация идет в Groq Free. Free-модели OpenRouter обслуживают fallback. Mock-провайдер гарантирует работоспособность публичного демо даже при недоступности реальных провайдеров.",
                "Primary routing targets Groq Free. OpenRouter free models handle fallback. The mock provider guarantees a functioning public demo even when real providers are unavailable."
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("Поведение стриминга", "Streaming behavior")}</CardTitle>
              <CardDescription>{t("SSE-события проксируются как нормализованные token-обновления.", "SSE events are forwarded as normalized token updates.")}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              {t(
                "Стриминг остается прогрессивным и безопасным для UI. Если провайдер не может корректно стартовать stream, RelayForge переключает запрос на следующий приоритетный уровень до начала вывода.",
                "Streaming remains progressive and UI-safe. If a provider cannot start the stream cleanly, RelayForge promotes the request to the next provider before output begins."
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("Модель ошибок", "Error model")}</CardTitle>
              <CardDescription>{t("Единая форма для ошибок валидации и апстрима.", "Consistent shape across validation and upstream failures.")}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              {t(
                "Поддерживаются коды: `validation_error`, `provider_timeout`, `provider_rate_limited`, `provider_unavailable`, `malformed_upstream_response`, `stream_interrupted`, `internal_error`, `fallback_activated`.",
                "Supported codes include `validation_error`, `provider_timeout`, `provider_rate_limited`, `provider_unavailable`, `malformed_upstream_response`, `stream_interrupted`, `internal_error` and `fallback_activated`."
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("Справочник endpoint-ов", "Endpoint reference")}</CardTitle>
            <CardDescription>{t("API-поверхность Worker, доступная статическому frontend.", "Worker API surface exposed to the static frontend.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {endpoints.map(([method, path, description]) => (
              <div key={path} className="grid gap-3 rounded-2xl border border-border/70 bg-background/60 p-4 md:grid-cols-[120px_220px_1fr]">
                <Badge variant={method === "GET" ? "success" : "accent"}>{method}</Badge>
                <div className="font-mono text-sm text-foreground break-all">{path}</div>
                <div className="text-sm text-muted-foreground">{description}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("Пример запроса", "Request example")}</CardTitle>
              <CardDescription>{t("Типизированный контракт, общий для frontend и Worker.", "Typed contract shared between frontend and Worker.")}</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-3xl border border-border/70 bg-background/80 p-5 font-mono text-xs leading-6 text-foreground">
                {requestExample}
              </pre>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("Пример ответа", "Response example")}</CardTitle>
              <CardDescription>{t("Каждый успешный ответ содержит нормализованные provider-метаданные.", "Every success payload returns normalized provider metadata.")}</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-3xl border border-border/70 bg-background/80 p-5 font-mono text-xs leading-6 text-foreground">
                {responseExample}
              </pre>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>{t("Примечания по стримингу", "Streaming notes")}</CardTitle>
              <CardDescription>{t("POST-стриминг через `fetch` и `text/event-stream`.", "POST-based streaming via `fetch` and `text/event-stream`.")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
              <p>{t("Типы событий: `token`, `meta`, `error`, `done`.", "Event types are `token`, `meta`, `error` and `done`.")}</p>
              <p>
                {t(
                  "Метаданные включают выбранную стратегию, изначальный и финальный провайдер, факт fallback, degraded/demo режим, задержку и модель.",
                  "Metadata reports selected strategy, originally attempted provider, final provider, fallback activation, degraded mode, demo mode, latency and model."
                )}
              </p>
              <p>
                {t(
                  "Если stream ломается до первого токена, RelayForge пытается следующий провайдер по приоритету.",
                  "If a stream fails before tokens begin, RelayForge retries against the next provider in the configured priority order."
                )}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("Объяснение fallback", "Fallback explanation")}</CardTitle>
              <CardDescription>{t("Явная оркестрация для надежности на free-tier.", "Explicit orchestration designed for free-tier reliability.")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
              <p>{t("В режиме Auto сначала вызывается Groq.", "Auto mode attempts Groq first.")}</p>
              <p>{t("Timeout, rate-limit, временная недоступность и malformed upstream-ответ переключают запрос на OpenRouter.", "Timeout, rate-limit, temporary unavailability or malformed upstream responses trigger OpenRouter.")}</p>
              <p>{t("Если OpenRouter тоже недоступен или квота закончилась, ответ отдает mock/demo провайдер.", "If OpenRouter also fails or quota is exhausted, the request is served by the mock/demo provider.")}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("Нормализованный формат ошибки", "Normalized error shape")}</CardTitle>
            <CardDescription>{t("Ошибки остаются человекочитаемыми и технически корректными без утечки raw stack-trace в UI.", "Errors remain human-readable and technically credible without leaking raw stacks into the UI.")}</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-3xl border border-border/70 bg-background/80 p-5 font-mono text-xs leading-6 text-foreground">
              {errorExample}
            </pre>
          </CardContent>
        </Card>
      </main>

      <SiteFooter />
    </div>
  );
}
