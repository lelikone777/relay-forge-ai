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
    ["POST", "/api/v1/chat", t("Normalized JSON response with provider metadata.", "Normalized JSON response with provider metadata.")],
    ["POST", "/api/v1/stream", t("SSE-compatible streaming endpoint for progressive tokens.", "SSE-compatible streaming endpoint for progressive tokens.")],
    ["GET", "/api/v1/providers/status", t("Provider health snapshot and routing order.", "Provider health snapshot and routing order.")],
    ["GET", "/api/v1/logs", t("Recent request history with fallback metadata.", "Recent request history with fallback metadata.")],
    ["GET", "/api/v1/usage", t("Usage aggregates, latency and provider distribution.", "Usage aggregates, latency and provider distribution.")]
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SiteHeader />

      <main className="shell-container section-space space-y-10">
        <div className="space-y-5">
          <Badge variant="accent">{t("Developer Docs", "Developer Docs")}</Badge>
          <h1 className="font-display text-5xl font-semibold tracking-tight text-balance text-white">RelayForge AI API</h1>
          <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
            {t(
              "RelayForge AI — serverless AI gateway playground с единым request contract, free-tier-first маршрутизацией, стримингом и нормализованной обработкой ошибок.",
              "RelayForge AI is a serverless AI gateway playground with a unified request contract, free-tier-first routing, streaming transport and normalized error handling."
            )}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/app/playground">{t("Open Playground", "Open Playground")}</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/app/status">{t("View Provider Status", "View Provider Status")}</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>{t("Product overview", "Product overview")}</CardTitle>
              <CardDescription>{t("One API surface with resilient provider fallback.", "One API surface with resilient provider fallback.")}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              {t(
                "Основная маршрутизация идет в Groq Free. Free-модели OpenRouter обслуживают fallback. Mock-провайдер гарантирует работающий public demo path даже при проблемах у реальных провайдеров.",
                "Primary routing targets Groq Free. OpenRouter free models handle fallback. The mock provider guarantees a working public demo path even when real providers are unavailable."
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("Streaming behavior", "Streaming behavior")}</CardTitle>
              <CardDescription>{t("SSE events are forwarded as normalized token updates.", "SSE events are forwarded as normalized token updates.")}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              {t(
                "Если provider не может стартовать stream корректно, Worker переключает запрос на следующий приоритетный уровень до начала вывода.",
                "If a provider cannot start the stream cleanly, the Worker promotes the request to the next priority level before output begins."
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("Error model", "Error model")}</CardTitle>
              <CardDescription>{t("Consistent shape across validation and upstream failures.", "Consistent shape across validation and upstream failures.")}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              {t(
                "Поддерживаются коды validation_error, provider_timeout, provider_rate_limited, provider_unavailable, malformed_upstream_response, stream_interrupted и internal_error.",
                "Supported codes include validation_error, provider_timeout, provider_rate_limited, provider_unavailable, malformed_upstream_response, stream_interrupted and internal_error."
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("Endpoint reference", "Endpoint reference")}</CardTitle>
            <CardDescription>{t("Worker API surface exposed to the frontend.", "Worker API surface exposed to the frontend.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {endpoints.map(([method, path, description]) => (
              <div key={path} className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 md:grid-cols-[120px_220px_1fr]">
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
              <CardTitle>{t("Request example", "Request example")}</CardTitle>
              <CardDescription>{t("Typed contract shared between frontend and Worker.", "Typed contract shared between frontend and Worker.")}</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-[1.5rem] border border-white/10 bg-black/25 p-5 font-mono text-xs leading-6 text-foreground">{requestExample}</pre>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("Response example", "Response example")}</CardTitle>
              <CardDescription>{t("Every success payload returns normalized provider metadata.", "Every success payload returns normalized provider metadata.")}</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-[1.5rem] border border-white/10 bg-black/25 p-5 font-mono text-xs leading-6 text-foreground">{responseExample}</pre>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>{t("Streaming notes", "Streaming notes")}</CardTitle>
              <CardDescription>{t("POST-based streaming via fetch and text/event-stream.", "POST-based streaming via fetch and text/event-stream.")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
              <p>{t("Event types are token, meta, error and done.", "Event types are token, meta, error and done.")}</p>
              <p>{t("Metadata reports selected strategy, attempted provider, final provider, fallback activation, mode, latency and model.", "Metadata reports selected strategy, attempted provider, final provider, fallback activation, mode, latency and model.")}</p>
              <p>{t("If a stream fails before tokens begin, RelayForge retries against the next provider in priority order.", "If a stream fails before tokens begin, RelayForge retries against the next provider in priority order.")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("Fallback explanation", "Fallback explanation")}</CardTitle>
              <CardDescription>{t("Explicit orchestration designed for free-tier reliability.", "Explicit orchestration designed for free-tier reliability.")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
              <p>{t("Auto mode attempts Groq first.", "Auto mode attempts Groq first.")}</p>
              <p>{t("Timeout, rate-limit, temporary unavailability or malformed upstream responses trigger OpenRouter.", "Timeout, rate-limit, temporary unavailability or malformed upstream responses trigger OpenRouter.")}</p>
              <p>{t("If OpenRouter also fails or quota is exhausted, the request is served by the mock provider.", "If OpenRouter also fails or quota is exhausted, the request is served by the mock provider.")}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("Normalized error shape", "Normalized error shape")}</CardTitle>
            <CardDescription>{t("Errors remain human-readable and technically credible without leaking raw stacks into the UI.", "Errors remain human-readable and technically credible without leaking raw stacks into the UI.")}</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-[1.5rem] border border-white/10 bg-black/25 p-5 font-mono text-xs leading-6 text-foreground">{errorExample}</pre>
          </CardContent>
        </Card>
      </main>

      <SiteFooter />
    </div>
  );
}
