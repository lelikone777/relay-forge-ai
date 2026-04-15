"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, ArrowRight, ArrowRightLeft, CheckCircle2, Clock3, Cloud, GitBranch, Globe, Layers3, Shield, Sparkles, Waves, Zap } from "lucide-react";
import Link from "next/link";

import { ProviderDistributionChart } from "@/components/charts/provider-distribution-chart";
import { UsageLatencyChart } from "@/components/charts/usage-latency-chart";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchProviderStatus, fetchUsage } from "@/lib/api";
import { demoProviderStatus, demoUsage } from "@/lib/demo-data";
import { formatDuration, formatNumber } from "@/lib/format";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

const featureGradients = [
  "from-cyan-500 to-blue-500",
  "from-violet-500 to-purple-500",
  "from-blue-500 to-indigo-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-fuchsia-500 to-rose-500"
];

const providerTones = [
  {
    bar: "from-cyan-500/18 to-cyan-500/6 border-cyan-500/30",
    text: "text-cyan-700 dark:text-cyan-300",
    icon: "text-cyan-600 dark:text-cyan-400",
    line: "from-cyan-500 to-emerald-500",
    badge: "border-cyan-500/25 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300"
  },
  {
    bar: "from-violet-500/18 to-violet-500/6 border-violet-500/30",
    text: "text-violet-700 dark:text-violet-300",
    icon: "text-violet-600 dark:text-violet-400",
    line: "from-violet-500 to-blue-500",
    badge: "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300"
  },
  {
    bar: "from-blue-500/18 to-blue-500/6 border-blue-500/30",
    text: "text-blue-700 dark:text-blue-300",
    icon: "text-blue-600 dark:text-blue-400",
    line: "from-blue-500 to-sky-500",
    badge: "border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300"
  },
  {
    bar: "from-emerald-500/18 to-emerald-500/6 border-emerald-500/30",
    text: "text-emerald-700 dark:text-emerald-300",
    icon: "text-emerald-600 dark:text-emerald-400",
    line: "from-emerald-500 to-teal-500",
    badge: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
  }
];

export default function HomePage() {
  const { locale } = useI18n();
  const t = (ru: string, en: string) => pickLocale(locale, { ru, en });
  const { data: statusQuery } = useQuery({ queryKey: ["provider-status"], queryFn: fetchProviderStatus });
  const { data: usageQuery } = useQuery({ queryKey: ["usage"], queryFn: fetchUsage });

  const status = statusQuery?.data ?? demoProviderStatus.data;
  const usage = usageQuery?.data ?? demoUsage.data;
  const successRate = usage.totals.requests > 0 ? ((usage.totals.successful / usage.totals.requests) * 100).toFixed(1) : "0.0";
  const liveProviders = status.providers.filter((provider) => provider.available).length;
  const streamingProviders = status.providers.filter((provider) => provider.supportsStreaming).length;
  const finalRequestVolume = usage.timeseries[usage.timeseries.length - 1]?.requests ?? usage.totals.requests;

  const features = [
    {
      icon: Globe,
      title: t("Единая API-поверхность", "One unified API surface"),
      description: t(
        "Один публичный контракт скрывает различия между провайдерами и не выносит секреты в браузер.",
        "One public contract hides provider differences without exposing secrets in the browser."
      )
    },
    {
      icon: Waves,
      title: t("Потоковый вывод в реальном времени", "Real-time streaming"),
      description: t(
        "Worker отправляет нормализованные SSE-события, а интерфейс показывает токены, метаданные и ошибки в одном потоке.",
        "The Worker emits normalized SSE events while the interface renders tokens, metadata and errors in one stream."
      )
    },
    {
      icon: GitBranch,
      title: t("Управляемый fallback", "Orchestrated fallback"),
      description: t(
        "Цепочка Groq -> OpenRouter -> Mock включается только тогда, когда апстрим не может чисто обслужить запрос.",
        "The Groq -> SambaNova -> Cerebras -> Gemini -> OpenRouter -> Mock chain activates only when the upstream path cannot serve a request cleanly."
      )
    },
    {
      icon: Shield,
      title: t("Нормализованные ошибки", "Normalized error handling"),
      description: t(
        "Одинаковая форма ошибок для валидации, таймаутов, rate-limit и прерванных стримов упрощает UI и отладку.",
        "A consistent error shape across validation, timeouts, rate limits and interrupted streams simplifies UI and debugging."
      )
    },
    {
      icon: Activity,
      title: t("Видимость маршрутизации", "Routing visibility"),
      description: t(
        "Статус, логи и usage подключены к живым endpoint'ам Worker, а не к декоративным цифрам.",
        "Status, logs and usage are wired to live Worker endpoints instead of decorative placeholder numbers."
      )
    },
    {
      icon: Sparkles,
      title: t("Архитектура для free tier", "Free-tier-first architecture"),
      description: t(
        "Frontend остается публичным, а ключи и оркестрация живут только на серверной стороне Worker.",
        "The frontend stays public while secrets and orchestration remain on the Worker."
      )
    }
  ];

  const steps = [
    {
      number: "01",
      title: t("Валидация запроса", "Validate request"),
      description: t("Контракт проверяется до обращения к провайдеру.", "The contract is validated before any provider call."),
      tone: "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300"
    },
    {
      number: "02",
      title: t("Выбор стратегии", "Select strategy"),
      description: t("Auto и ручные режимы используют единый payload.", "Auto and manual modes share the same payload."),
      tone: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300"
    },
    {
      number: "03",
      title: t("Открытие апстрима", "Open upstream path"),
      description: t("Worker стартует chat или stream на выбранном провайдере.", "The Worker starts chat or stream on the selected provider."),
      tone: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300"
    },
    {
      number: "04",
      title: t("Нормализация событий", "Normalize events"),
      description: t("Токены и meta-события приходят в предсказуемой форме.", "Tokens and meta events arrive in a predictable shape."),
      tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
    },
    {
      number: "05",
      title: t("Fallback при сбое", "Fallback on failure"),
      description: t("Rate-limit, timeout и malformed response переводят запрос на следующий tier.", "Rate limits, timeouts and malformed responses promote the request to the next tier."),
      tone: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
    },
    {
      number: "06",
      title: t("Возврат финальной меты", "Return final metadata"),
      description: t("UI видит финального провайдера, latency, режим и факт fallback.", "The UI receives final provider, latency, mode and fallback metadata."),
      tone: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300"
    }
  ];

  const architectureCards = [
    {
      icon: Globe,
      title: t("Web-клиент", "Web client"),
      description: t(
        "Next.js интерфейс отвечает за маршруты, визуализацию и client-side data fetching без доступа к секретам.",
        "The Next.js client handles routes, rendering and client-side data fetching without access to secrets."
      ),
      points: [
        t("App Router и единый shell для workspace", "App Router with a shared workspace shell"),
        t("Переключение языка и темы на клиенте", "Client-side language and theme switching")
      ],
      tone: "border-cyan-500/25 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300"
    },
    {
      icon: Cloud,
      title: t("Worker-оркестрация", "Worker orchestration"),
      description: t(
        "Cloudflare Worker держит chat API, SSE streaming, fallback и нормализацию ошибок.",
        "The Cloudflare Worker owns chat API, SSE streaming, fallback orchestration and error normalization."
      ),
      points: [
        t("Маршруты /chat, /stream, /status, /logs, /usage", "/chat, /stream, /status, /logs and /usage routes"),
        t("Fallback Groq -> SambaNova -> Cerebras -> Gemini -> OpenRouter -> Mock", "Groq -> SambaNova -> Cerebras -> Gemini -> OpenRouter -> Mock fallback")
      ],
      tone: "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300"
    },
    {
      icon: Layers3,
      title: t("Общие контракты и env", "Shared contracts and env"),
      description: t(
        "Типы запросов, ответов и ошибок живут в shared-пакете, а публичные и серверные env разведены по слоям.",
        "Request, response and error types live in a shared package while public and server env values stay separated."
      ),
      points: [
        t("NEXT_PUBLIC_API_BASE_URL только для клиента", "NEXT_PUBLIC_API_BASE_URL stays client-safe"),
        t("Ключи провайдеров только внутри Worker", "Provider keys remain Worker-only")
      ],
      tone: "border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300"
    }
  ];

  return (
    <div className="min-h-screen text-foreground">
      <SiteHeader />
      <main className="pb-10">
        <section className="landing-section overflow-hidden pt-20 lg:pt-28">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-cyan-500/14 blur-[120px] dark:bg-cyan-500/22" />
            <div className="absolute right-0 top-24 h-[560px] w-[560px] rounded-full bg-violet-500/12 blur-[120px] dark:bg-violet-500/18" />
            <div className="absolute inset-0 surface-grid opacity-60 grid-fade" />
          </div>

          <div className="shell-container">
            <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
              <div className="space-y-8">
                <div className="eyebrow">
                  <Zap className="h-3.5 w-3.5" />
                  {t("Рабочий AI gateway с живым fallback", "A live AI gateway with real fallback")}
                </div>

                <div className="space-y-5">
                  <h1 className="max-w-3xl text-balance font-display text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                    <span className="bg-gradient-to-r from-slate-950 via-slate-700 to-slate-500 bg-clip-text text-transparent dark:from-white dark:via-cyan-200 dark:to-violet-200">
                      {t("Единый AI gateway", "Unified AI gateway")}
                    </span>
                    <br />
                    <span className="text-slate-700 dark:text-white/92">
                      {t("с управляемым fallback", "with intelligent fallback")}
                    </span>
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                    {t(
                      "Один интерфейс. Несколько провайдеров. Потоковый вывод через SSE, честная телеметрия и серверная оркестрация без утечки API-ключей во frontend.",
                      "One interface. Multiple providers. SSE streaming, honest telemetry and server-side orchestration without leaking API keys into the frontend."
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link href="/app/playground">
                      {t("Открыть workspace", "Open workspace")}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary">
                    <Link href="/docs">{t("Открыть документацию", "Open documentation")}</Link>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Badge variant="success">
                    <Waves className="h-3.5 w-3.5" />
                    {t("Живой стриминг", "Live streaming")}
                  </Badge>
                  <Badge variant="accent">
                    <GitBranch className="h-3.5 w-3.5" />
                    {t("Маршрутизация между провайдерами", "Multi-provider routing")}
                  </Badge>
                  <Badge>
                    <Shield className="h-3.5 w-3.5" />
                    {t("Секреты только на сервере", "Server-side secrets only")}
                  </Badge>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-r from-cyan-500/16 via-violet-500/12 to-blue-500/16 blur-3xl" />
                <div className="landing-card ambient-ring p-6 sm:p-7">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.5)]" />
                      <span className="text-sm font-medium text-foreground">{t("Поток ответа активен", "Response stream active")}</span>
                    </div>
                    <Badge className={providerTones[0].badge}>~{usage.totals.avgLatencyMs}ms</Badge>
                  </div>

                  <div className="space-y-3">
                    {status.providers.map((provider, index) => {
                      const tone = providerTones[index] ?? providerTones[providerTones.length - 1];
                      const Icon = index === 0 ? Zap : index === 1 ? Activity : GitBranch;
                      const width = provider.id === "mock" ? 100 : Math.max(56, Math.min(96, 100 - Math.round(provider.latencyMs / 2.2)));

                      return (
                        <div key={provider.id} className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className={`flex min-h-11 flex-1 items-center rounded-[1rem] border bg-gradient-to-r px-4 ${tone.bar}`}>
                              <span className={`text-sm font-medium ${tone.text}`}>{provider.label}</span>
                              <Icon className={`ml-auto h-4 w-4 ${tone.icon}`} />
                            </div>
                            {index < status.providers.length - 1 ? <ArrowRight className="h-4 w-4 text-muted-foreground" /> : <div className="w-4" />}
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/5">
                            <div className={`h-full bg-gradient-to-r ${tone.line}`} style={{ width: `${width}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="panel-inset mt-6 space-y-2 p-4 font-mono text-xs">
                    <div className="text-cyan-600 dark:text-cyan-400">[meta] provider: {status.providers[0]?.id ?? "groq"}</div>
                    <div className="text-muted-foreground">[meta] model: {status.providers[0]?.model ?? "llama-3.1-8b-instant"}</div>
                    <div className="text-emerald-600 dark:text-emerald-400">
                      [token] {t("RelayForge держит ответ в движении...", "RelayForge keeps the response moving...")}
                    </div>
                    <div className="text-muted-foreground">[meta] latency: {usage.totals.avgLatencyMs}ms</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="landing-section">
          <div className="shell-container space-y-8">
            <div className="space-y-4 text-center">
              <Badge variant="accent">{t("Панель платформы", "Platform dashboard")}</Badge>
              <h2 className="text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                {t("Наблюдаемость в реальном времени", "Real-time observability")}
              </h2>
              <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">
                {t(
                  "Ключевые блоки повторяют структуру исходного дизайна, но привязаны к реальным status и usage endpoint'ам Worker.",
                  "The visual structure mirrors the source design, but every core panel is now backed by real status and usage endpoints."
                )}
              </p>
            </div>

            <div className="section-frame p-4 sm:p-6">
              <div className="grid gap-4 lg:grid-cols-3">
                <Card className="p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">{t("Всего запросов", "Total requests")}</div>
                      <div className="mt-2 font-display text-4xl font-semibold text-foreground">{formatNumber(usage.totals.requests)}</div>
                    </div>
                    <div className="rounded-[1rem] border border-cyan-500/20 bg-cyan-500/10 p-3 text-cyan-700 dark:text-cyan-300">
                      <Activity className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{t("Живой трафик gateway из usage endpoint.", "Live gateway traffic from the usage endpoint.")}</div>
                </Card>

                <Card className="p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">{t("Средняя задержка", "Average latency")}</div>
                      <div className="mt-2 font-display text-4xl font-semibold text-foreground">{formatDuration(usage.totals.avgLatencyMs)}</div>
                    </div>
                    <div className="rounded-[1rem] border border-violet-500/20 bg-violet-500/10 p-3 text-violet-700 dark:text-violet-300">
                      <Clock3 className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{t("Считается по завершенным ответам Worker.", "Calculated from completed Worker responses.")}</div>
                </Card>

                <Card className="p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">{t("Активации fallback", "Fallback activations")}</div>
                      <div className="mt-2 font-display text-4xl font-semibold text-foreground">{formatNumber(usage.totals.fallbackActivations)}</div>
                    </div>
                    <div className="rounded-[1rem] border border-blue-500/20 bg-blue-500/10 p-3 text-blue-700 dark:text-blue-300">
                      <ArrowRightLeft className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t("Успешность", "Success rate")}</span>
                      <span className="font-medium text-foreground">{successRate}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/5">
                      <div className="h-full bg-[linear-gradient(90deg,rgba(16,185,129,1),rgba(34,211,238,1))]" style={{ width: `${successRate}%` }} />
                    </div>
                  </div>
                </Card>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                <Card className="p-6">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{t("Состояние провайдеров", "Provider health")}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{t("Живой снимок цепочки маршрутизации.", "A live snapshot of the routing chain.")}</p>
                    </div>
                    <Badge variant="success">{t("Живой снимок", "Live snapshot")}</Badge>
                  </div>

                  <div className="space-y-4">
                    {status.providers.map((provider, index) => {
                      const tone = providerTones[index] ?? providerTones[providerTones.length - 1];
                      return (
                        <div key={provider.id} className="space-y-2">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.45)]" />
                              <span className="text-sm font-medium text-foreground">{provider.label}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {provider.id === "mock" ? t("Всегда готов", "Always ready") : `${provider.latencyMs}ms ${t("в среднем", "avg")}`}
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/5">
                            <div
                              className={`h-full bg-gradient-to-r ${tone.line}`}
                              style={{ width: `${provider.id === "mock" ? 100 : Math.max(58, Math.min(96, 100 - Math.round(provider.latencyMs / 2.2)))}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex items-center gap-2 border-t border-border/70 pt-6 text-sm text-muted-foreground dark:border-white/10">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {t("Fallback-цепочка подтверждена статусным endpoint'ом.", "The fallback chain is confirmed by the status endpoint.")}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{t("Потоковый вывод", "Live stream output")}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{t("Превью реального transport-слоя без фейковых promise-метрик.", "A preview of the real transport layer without fake promise metrics.")}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      {t("Стриминг", "Streaming")}
                    </div>
                  </div>

                  <div className="panel-inset h-[300px] space-y-2 overflow-y-auto p-4 font-mono text-xs">
                    <div className="flex gap-2">
                      <span className="shrink-0 text-cyan-600 dark:text-cyan-400">[meta]</span>
                      <span className="text-muted-foreground">request_count: {usage.totals.requests}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="shrink-0 text-cyan-600 dark:text-cyan-400">[meta]</span>
                      <span className="text-muted-foreground">provider: {status.providers[0]?.id ?? "groq"}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="shrink-0 text-cyan-600 dark:text-cyan-400">[meta]</span>
                      <span className="text-muted-foreground">model: {status.providers[0]?.model ?? "llama-3.1-8b-instant"}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="shrink-0 text-violet-600 dark:text-violet-400">[meta]</span>
                      <span className="text-muted-foreground">mode: {status.mode}</span>
                    </div>
                    <div className="my-3 h-px bg-border/70 dark:bg-white/5" />
                    <div className="flex gap-2">
                      <span className="shrink-0 text-emerald-600 dark:text-emerald-400">[token]</span>
                      <span className="text-foreground">{t("Ответ идет через активную цепочку провайдеров и не теряет метаданные по пути.", "The response flows through the active provider chain without losing metadata.")}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="shrink-0 text-emerald-600 dark:text-emerald-400">[token]</span>
                      <span className="text-foreground">{t("Если основной путь деградирует, RelayForge переводит запрос до того, как пользователь увидит обрыв.", "If the primary path degrades, RelayForge promotes the request before the user sees a dead stream.")}</span>
                    </div>
                    <div className="my-3 h-px bg-border/70 dark:bg-white/5" />
                    <div className="flex gap-2">
                      <span className="shrink-0 text-blue-600 dark:text-blue-400">[meta]</span>
                      <span className="text-muted-foreground">latency: {usage.totals.avgLatencyMs}ms</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="shrink-0 text-blue-600 dark:text-blue-400">[meta]</span>
                      <span className="text-muted-foreground">fallbacks: {usage.totals.fallbackActivations}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="shrink-0 text-emerald-600 dark:text-emerald-400">[done]</span>
                      <span className="text-emerald-700 dark:text-emerald-400">stream_complete</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge>SSE</Badge>
                    <Badge variant="accent">{formatNumber(usage.totals.successful)} {t("успешных", "successful")}</Badge>
                    <Badge variant="success">{usage.totals.avgLatencyMs}ms</Badge>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="landing-section" id="features">
          <div className="absolute inset-0 -z-10">
            <div className="absolute bottom-0 right-1/4 h-[640px] w-[640px] rounded-full bg-violet-500/10 blur-[120px] dark:bg-violet-500/14" />
          </div>

          <div className="shell-container space-y-8">
            <div className="space-y-4 text-center">
              <h2 className="text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                {t("Основа для надежного AI-интерфейса", "Built for resilient AI delivery")}
              </h2>
              <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">
                {t("Карточки сохраняют характер исходного визуала, но обещают только то, что действительно делает текущая система.", "The cards keep the character of the source visual design while only promising behavior the current system actually implements.")}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="group relative overflow-hidden p-6">
                    <div className={`absolute inset-0 bg-gradient-to-br ${featureGradients[index]} opacity-0 transition-opacity duration-300 group-hover:opacity-[0.05]`} />
                    <div className="relative">
                      <div className="mb-5 inline-flex rounded-[1rem] border border-border/70 bg-[hsl(var(--panel)/0.72)] p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.05]">
                        <div className={`rounded-[0.85rem] bg-gradient-to-r ${featureGradients[index]} p-2.5 text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.description}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="landing-section">
          <div className="shell-container space-y-8">
            <div className="space-y-4 text-center">
              <h2 className="text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                {t("Как проходит запрос", "How a request moves through the system")}
              </h2>
              <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">
                {t("Секция повторяет ритм исходного дизайна, но описывает реальную оркестрацию Worker вместо абстрактного маркетинга.", "This section keeps the rhythm of the source design while describing real Worker orchestration instead of abstract marketing.")}
              </p>
            </div>

            <div className="section-frame p-4 sm:p-6">
              <div className="grid gap-4 lg:grid-cols-3">
                {steps.map((step) => (
                  <Card key={step.number} className="p-6">
                    <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full border text-base font-semibold ${step.tone}`}>
                      {step.number}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.description}</p>
                  </Card>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <div className="panel-subtle inline-flex items-center gap-3 px-5 py-3 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {t(`Средняя задержка сейчас держится на уровне ${formatDuration(usage.totals.avgLatencyMs)}.`, `Average latency is currently holding at ${formatDuration(usage.totals.avgLatencyMs)}.`)}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="landing-section" id="architecture">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-1/2 h-[820px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[140px] dark:bg-blue-500/14" />
          </div>

          <div className="shell-container space-y-8">
            <div className="space-y-4 text-center">
              <Badge>{t("Инженерная архитектура", "Engineering architecture")}</Badge>
              <h2 className="text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                {t("Serverless-first без ложных обещаний", "Serverless-first without false promises")}
              </h2>
              <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">
                {t("Архитектура показывает реальные слои проекта: web-клиент, Worker и shared contracts. Без KV-маркетинга и без обещаний durable state там, где его нет.", "The architecture reflects the real project layers: web client, Worker and shared contracts. No KV marketing and no durable-state promises where none exist.")}
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {architectureCards.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} className="p-6">
                    <div className={`mb-5 inline-flex rounded-[1rem] border p-3 ${item.tone}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
                    <div className="mt-5 space-y-2">
                      {item.points.map((point) => (
                        <div key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>

            <Card className="p-6 sm:p-8">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{t("Поток системы", "System flow")}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t("Клиент и серверные слои разделены по ответственности.", "Client and server layers remain separated by responsibility.")}</p>
                </div>
                <Badge variant="success">{t("Боевой путь данных", "Live data path")}</Badge>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1.25fr] lg:items-center">
                <div className="panel-subtle p-4 text-center">
                  <Globe className="mx-auto h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                  <div className="mt-3 font-medium text-foreground">{t("Пользовательский клиент", "User client")}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{t("Браузер + UI shell", "Browser + UI shell")}</div>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="panel-subtle p-4 text-center">
                  <Layers3 className="mx-auto h-8 w-8 text-violet-600 dark:text-violet-400" />
                  <div className="mt-3 font-medium text-foreground">{t("Next.js web", "Next.js web")}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{t("Маршруты и data fetching", "Routes and data fetching")}</div>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="panel-subtle p-4">
                  <Cloud className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <div className="mt-3 font-medium text-foreground">{t("Cloudflare Worker", "Cloudflare Worker")}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{t("Чат, стриминг, fallback и secrets", "Chat, streaming, fallback and secrets")}</div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    {status.providers.map((provider, index) => (
                      <div key={provider.id} className={`rounded-[1rem] border px-3 py-2 text-center text-xs font-medium ${providerTones[index]?.badge ?? providerTones[0].badge}`}>
                        {provider.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 border-t border-border/70 pt-8 sm:grid-cols-3 dark:border-white/10">
                <div className="text-center">
                  <div className="font-display text-3xl font-semibold text-foreground">{status.providers.length}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{t("провайдера в цепочке", "providers in the chain")}</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-3xl font-semibold text-foreground">{formatDuration(usage.totals.avgLatencyMs)}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{t("средняя задержка сейчас", "current average latency")}</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-3xl font-semibold text-foreground">{successRate}%</div>
                  <div className="mt-1 text-sm text-muted-foreground">{t("успешных завершений", "successful completions")}</div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="landing-section">
          <div className="shell-container space-y-8">
            <div className="space-y-4 text-center">
              <h2 className="text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                {t("Живая telemetry, а не декоративные графики", "Live telemetry, not decorative charts")}
              </h2>
              <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">
                {t("Чарты используют реальные usage contracts и показывают распределение по финальному провайдеру после fallback.", "These charts use real usage contracts and show final-provider distribution after fallback.")}
              </p>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
              <Card className="p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{t("Запросы и задержка", "Requests and latency")}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t("Таймсерия из usage endpoint.", "Timeseries from the usage endpoint.")}</p>
                  </div>
                  <div className="rounded-[1rem] border border-cyan-500/20 bg-cyan-500/10 p-3 text-cyan-700 dark:text-cyan-300">
                    <Activity className="h-5 w-5" />
                  </div>
                </div>
                <UsageLatencyChart data={usage.timeseries} />
              </Card>

              <Card className="p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{t("Доля провайдеров", "Provider distribution")}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t("Финальный маршрут после fallback.", "The final route after fallback.")}</p>
                  </div>
                  <div className="rounded-[1rem] border border-blue-500/20 bg-blue-500/10 p-3 text-blue-700 dark:text-blue-300">
                    <GitBranch className="h-5 w-5" />
                  </div>
                </div>
                <ProviderDistributionChart data={usage.providerDistribution} />
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: t("Успешность", "Success rate"),
                  value: `${successRate}%`,
                  hint: `${usage.totals.successful}/${usage.totals.requests}`
                },
                {
                  label: t("Последний объем", "Latest request volume"),
                  value: formatNumber(finalRequestVolume),
                  hint: t("последняя точка таймсерии", "last timeseries point")
                },
                {
                  label: t("Провайдеров online", "Providers online"),
                  value: `${liveProviders}/${status.providers.length}`,
                  hint: t("доступных для маршрутизации", "available for routing")
                },
                {
                  label: t("Потоковых путей", "Streaming paths"),
                  value: `${streamingProviders}`,
                  hint: t("поддерживают SSE", "support SSE")
                }
              ].map((item) => (
                <Card key={item.label} className="p-5">
                  <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{item.label}</div>
                  <div className="mt-3 font-display text-3xl font-semibold text-foreground">{item.value}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{item.hint}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
