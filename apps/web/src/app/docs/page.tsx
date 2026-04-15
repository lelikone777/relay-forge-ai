"use client";

import { BookOpen, FileCode2, GitBranch, RadioTower, ShieldAlert, Waves } from "lucide-react";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

const requestExample = `{
  "prompt": "Explain the fallback strategy in RelayForge",
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
    "text": "RelayForge first tries Groq...",
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

  const endpointCards = [
    {
      method: "POST",
      path: "/api/v1/chat",
      description: t("Нормализованный JSON-ответ с provider metadata.", "Normalized JSON response with provider metadata.")
    },
    {
      method: "POST",
      path: "/api/v1/stream",
      description: t("SSE-совместимый streaming endpoint для токенов и meta-событий.", "SSE-compatible streaming endpoint for tokens and meta events.")
    },
    {
      method: "GET",
      path: "/api/v1/providers/status",
      description: t("Снимок состояния провайдеров и routing order.", "Provider health snapshot and routing order.")
    },
    {
      method: "GET",
      path: "/api/v1/logs",
      description: t("Последняя история запросов с fallback metadata.", "Recent request history with fallback metadata.")
    },
    {
      method: "GET",
      path: "/api/v1/usage",
      description: t("Агрегаты usage, latency и распределение провайдеров.", "Usage aggregates, latency and provider distribution.")
    }
  ];

  const overviewCards = [
    {
      icon: BookOpen,
      title: t("Единый контракт", "Unified contract"),
      description: t(
        "Frontend и Worker разделяют типы запросов, ответов и ошибок через shared-пакет.",
        "Frontend and Worker share request, response and error types through the shared package."
      )
    },
    {
      icon: RadioTower,
      title: t("Потоковый транспорт", "Streaming transport"),
      description: t(
        "Стриминг идет через POST + text/event-stream, а UI получает token, meta, error и done.",
        "Streaming runs through POST + text/event-stream while the UI receives token, meta, error and done events."
      )
    },
    {
      icon: GitBranch,
      title: t("Fallback-логика", "Fallback logic"),
      description: t(
        "Auto mode начинает с Groq, затем переключается на OpenRouter и при необходимости на mock provider.",
        "Auto mode starts with Groq, then promotes to SambaNova, Cerebras, Gemini, OpenRouter and finally the mock provider when needed."
      )
    },
    {
      icon: ShieldAlert,
      title: t("Модель ошибок", "Error model"),
      description: t(
        "UI получает читаемые коды и сообщения без утечки сырых stack trace в интерфейс.",
        "The UI receives readable codes and messages without leaking raw stack traces into the interface."
      )
    }
  ];

  return (
    <div className="min-h-screen text-foreground">
      <SiteHeader />

      <main className="pb-10">
        <section className="landing-section pt-20 lg:pt-24">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-cyan-500/12 blur-[120px] dark:bg-cyan-500/20" />
            <div className="absolute right-0 top-28 h-[520px] w-[520px] rounded-full bg-violet-500/10 blur-[120px] dark:bg-violet-500/16" />
            <div className="absolute inset-0 surface-grid opacity-50 grid-fade" />
          </div>

          <div className="shell-container space-y-8">
            <div className="grid gap-8">
              <div className="space-y-6">
                <div className="eyebrow">
                  <FileCode2 className="h-3.5 w-3.5" />
                  {t("Документация разработчика", "Developer documentation")}
                </div>
                <div className="space-y-4">
                  <h1 className="text-balance font-display text-5xl font-semibold tracking-tight sm:text-6xl">
                    {t("API и контракты RelayForge", "RelayForge API and contracts")}
                  </h1>
                  <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                    {t(
                      "Документация описывает реальный слой Worker API: chat, stream, status, logs и usage. Здесь нет фиктивных SDK-обещаний, только текущие контракты проекта.",
                      "This documentation describes the real Worker API layer: chat, stream, status, logs and usage. No fictional SDK promises, only the current project contracts."
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link href="/app/playground">{t("Открыть песочницу", "Open playground")}</Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary">
                    <Link href="/app/status">{t("Статус провайдеров", "Provider status")}</Link>
                  </Button>
                </div>
              </div>

              <Card className="p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{t("Поверхность API", "API surface")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t("Пять ключевых endpoint'ов, к которым привязан интерфейс.", "Five core endpoints backing the interface.")}
                    </p>
                  </div>
                  <Badge variant="accent">5 routes</Badge>
                </div>
                <div className="space-y-3">
                  {endpointCards.map((endpoint) => (
                    <div key={endpoint.path} className="panel-subtle p-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant={endpoint.method === "GET" ? "success" : "accent"}>{endpoint.method}</Badge>
                        <div className="font-mono text-sm text-foreground">{endpoint.path}</div>
                      </div>
                      <div className="mt-3 text-sm leading-7 text-muted-foreground">{endpoint.description}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {overviewCards.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} className="p-6">
                    <div className="mb-4 inline-flex rounded-[1rem] border border-border/70 bg-[hsl(var(--panel)/0.72)] p-3 dark:border-white/10 dark:bg-white/[0.05]">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="landing-section">
          <div className="shell-container space-y-6">
            <div className="space-y-3">
              <Badge>{t("Справочник endpoint'ов", "Endpoint reference")}</Badge>
              <h2 className="text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                {t("Что именно вызывает frontend", "What the frontend actually calls")}
              </h2>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                {t(
                  "Эти маршруты составляют реальную API-поверхность между Next.js интерфейсом и Worker.",
                  "These routes form the real API surface between the Next.js interface and the Worker."
                )}
              </p>
            </div>

            <Card className="p-6">
              <div className="space-y-3">
                {endpointCards.map((endpoint) => (
                  <div key={endpoint.path} className="grid gap-3 rounded-[1.25rem] border border-border/70 bg-[hsl(var(--panel)/0.72)] p-4 dark:border-white/10 dark:bg-white/[0.05] md:grid-cols-[120px_240px_1fr]">
                    <Badge variant={endpoint.method === "GET" ? "success" : "accent"}>{endpoint.method}</Badge>
                    <div className="font-mono text-sm text-foreground break-all">{endpoint.path}</div>
                    <div className="text-sm text-muted-foreground">{endpoint.description}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="landing-section">
          <div className="shell-container grid gap-4">
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle>{t("Пример запроса", "Request example")}</CardTitle>
                <CardDescription>{t("Типизированный payload, общий для frontend и Worker.", "A typed payload shared by frontend and Worker.")}</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <pre className="panel-inset overflow-x-auto p-5 font-mono text-xs leading-6 text-foreground">{requestExample}</pre>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle>{t("Пример успешного ответа", "Successful response example")}</CardTitle>
                <CardDescription>{t("Каждый успешный ответ возвращает нормализованную provider metadata.", "Every successful response returns normalized provider metadata.")}</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <pre className="panel-inset overflow-x-auto p-5 font-mono text-xs leading-6 text-foreground">{responseExample}</pre>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="landing-section">
          <div className="shell-container grid gap-4">
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle>{t("Потоковые заметки", "Streaming notes")}</CardTitle>
                <CardDescription>{t("Как устроен потоковый transport-слой.", "How the streaming transport layer behaves.")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 px-0 pb-0 text-sm leading-7 text-muted-foreground">
                <div className="panel-subtle p-4">
                  <div className="font-medium text-foreground">{t("События", "Events")}</div>
                  <div className="mt-2">{t("Поддерживаются token, meta, error и done.", "Supported event types are token, meta, error and done.")}</div>
                </div>
                <div className="panel-subtle p-4">
                  <div className="font-medium text-foreground">{t("Метаданные", "Metadata")}</div>
                  <div className="mt-2">
                    {t(
                      "Интерфейс получает strategy, attempted provider, final provider, факт fallback, mode, latency и model.",
                      "The interface receives strategy, attempted provider, final provider, fallback state, mode, latency and model."
                    )}
                  </div>
                </div>
                <div className="panel-subtle p-4">
                  <div className="font-medium text-foreground">{t("Поведение при сбое", "Failure behavior")}</div>
                  <div className="mt-2">
                    {t(
                      "Если стрим не успел чисто стартовать, Worker переводит запрос на следующий приоритетный tier.",
                      "If the stream cannot start cleanly, the Worker promotes the request to the next priority tier."
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle>{t("Нормализованная ошибка", "Normalized error shape")}</CardTitle>
                <CardDescription>{t("Читаемая ошибка для UI и техничная информация для диагностики.", "A readable error for the UI with technical details for diagnostics.")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-0 pb-0">
                <pre className="panel-inset overflow-x-auto p-5 font-mono text-xs leading-6 text-foreground">{errorExample}</pre>
                <div className="panel-subtle flex items-start gap-3 p-4 text-sm leading-7 text-muted-foreground">
                  <Waves className="mt-1 h-4 w-4 shrink-0 text-accent" />
                  <span>
                    {t(
                      "Ошибки остаются единообразными для chat и stream, чтобы UI не разъезжался по разным провайдерам.",
                      "Errors stay consistent across chat and stream so the UI does not fragment across providers."
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
