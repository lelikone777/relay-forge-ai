"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  ChartNoAxesCombined,
  CloudCog,
  Cpu,
  Layers3,
  ShieldCheck,
  Sparkles,
  Waves,
  Zap
} from "lucide-react";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

const fadeIn = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.45 }
};

export default function HomePage() {
  const { locale } = useI18n();
  const t = (ru: string, en: string) => pickLocale(locale, { ru, en });

  const featureCards = [
    {
      title: t("Единая AI API-поверхность", "Unified AI API surface"),
      description: t(
        "Отправляйте промпты в едином формате запроса, а RelayForge нормализует поведение разных провайдеров.",
        "Send prompts through one consistent request shape while RelayForge normalizes provider-specific behavior."
      ),
      icon: Layers3
    },
    {
      title: t("Стриминг в реальном времени", "Real-time streaming"),
      description: t(
        "Постепенная отрисовка токенов через SSE-совместимые стримы со стабильным layout и аккуратной обработкой прерываний.",
        "Progressive token rendering over SSE-compatible streams with stable layout and clean interruption handling."
      ),
      icon: Waves
    },
    {
      title: t("Автоматический fallback", "Automatic fallback"),
      description: t(
        "Основной путь: Groq Free. При проблемах включаются free-модели OpenRouter, а mock-режим гарантирует рабочее публичное демо.",
        "Groq Free is preferred, OpenRouter free models take over when needed, and mock mode guarantees a working public demo."
      ),
      icon: ArrowRight
    },
    {
      title: t("Нормализованные ошибки", "Normalized errors"),
      description: t(
        "Ошибки валидации, rate-limit, timeout и некорректный upstream-ответ возвращаются в едином контракте.",
        "Validation, rate-limit, timeout and upstream-shape failures are returned through one coherent contract."
      ),
      icon: ShieldCheck
    },
    {
      title: t("Видимость провайдеров", "Provider visibility"),
      description: t(
        "Показывайте порядок маршрутизации, режим системы, задержку и готовность провайдеров в observability-стиле.",
        "Expose routing order, current mode, latency and provider readiness in a dashboard that feels operational, not decorative."
      ),
      icon: Activity
    },
    {
      title: t("Архитектура free-tier-first", "Free-tier-first architecture"),
      description: t(
        "Статический frontend на Pages и API на Worker дают публичный, дешевый и устойчивый деплой при ограниченных квотах.",
        "Static Pages frontend plus Worker API keeps deployment public, cheap and resilient under constrained quotas."
      ),
      icon: CloudCog
    }
  ];

  const providerCards = [
    {
      title: "Groq Free",
      subtitle: t("Основной путь", "Primary path"),
      detail: t("Низкая задержка по умолчанию для лучшего real-time UX.", "Low-latency default for the best real-time UX."),
      badge: "primary"
    },
    {
      title: "OpenRouter Free",
      subtitle: t("Fallback-уровень", "Fallback tier"),
      detail: t(
        "Включается, когда Groq ограничен, временно недоступен или возвращает некорректный ответ.",
        "Activated when Groq is rate-limited, unavailable or malformed."
      ),
      badge: "secondary"
    },
    {
      title: "Mock / Demo",
      subtitle: t("Страховочный слой", "Safety net"),
      detail: t(
        "Псевдо-стриминг, который гарантирует тестируемость публичного демо.",
        "Pseudo-streaming provider that guarantees the public demo remains testable."
      ),
      badge: "demo"
    }
  ];

  const workflowCards = [
    {
      title: t("Как это работает", "How it works"),
      description: t("1. Валидация и нормализация запроса.", "1. Validate and normalize the request."),
      icon: Cpu
    },
    {
      title: t("Стриминг-путь", "Streaming path"),
      description: t(
        "2. Открывается provider-stream и токены отдаются постепенно.",
        "2. Open a provider stream and surface tokens progressively."
      ),
      icon: Waves
    },
    {
      title: t("Resilience-путь", "Resilience path"),
      description: t(
        "3. При ошибке upstream запрос поднимается на следующий уровень.",
        "3. Promote to the next tier when the upstream path fails cleanly."
      ),
      icon: ShieldCheck
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="shell-container section-space grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div {...fadeIn} className="space-y-8">
              <Badge variant="accent">{t("Unified AI Gateway на Free-Tier Infrastructure", "Unified AI Gateway on Free-Tier Infrastructure")}</Badge>
              <div className="space-y-6">
                <h1 className="text-safe font-display text-4xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                  {t(
                    "RelayForge AI маршрутизирует, стримит и восстанавливается как реальный AI infrastructure продукт.",
                    "RelayForge AI routes, streams and recovers like a real AI infrastructure product."
                  )}
                </h1>
                <p className="text-safe max-w-2xl text-lg leading-8 text-muted-foreground">
                  {t(
                    "Одна API-поверхность, несколько провайдеров, нормализованные ошибки и устойчивый fallback от Groq Free к OpenRouter Free и далее к demo-safe mock-провайдеру.",
                    "One API surface, multiple providers, normalized errors and resilient fallback from Groq Free to OpenRouter free models to a demo-safe mock provider."
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/app/playground">
                    {t("Открыть песочницу", "Open Playground")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/docs">{t("Открыть API docs", "View API Docs")}</Link>
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardContent className="p-5">
                    <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Стриминг", "Streaming")}</div>
                    <div className="mt-3 font-display text-3xl font-semibold">SSE</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {t("Постепенная выдача токенов со стабильным UX.", "Progressive token delivery with stable UX.")}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Fallback</div>
                    <div className="mt-3 font-display text-3xl font-semibold">3-tier</div>
                    <div className="mt-2 text-sm text-muted-foreground">{"Groq -> OpenRouter -> Mock."}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Деплой", "Deploy")}</div>
                    <div className="mt-3 font-display text-3xl font-semibold">{t("Публично", "Public")}</div>
                    <div className="mt-2 text-sm text-muted-foreground">Cloudflare Pages + Workers.</div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            <motion.div {...fadeIn} className="relative">
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 surface-grid opacity-50" />
                <CardHeader className="relative border-b border-border/70">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardTitle>{t("Превью gateway", "Gateway preview")}</CardTitle>
                      <CardDescription>
                        {t(
                          "Playground UI коммерческого уровня с видимостью маршрутизации.",
                          "Commercial-grade playground UI with routing visibility."
                        )}
                      </CardDescription>
                    </div>
                    <Badge variant="accent">{t("live оркестрация", "live orchestration")}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative grid gap-4 p-6">
                  <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-sm font-medium">{t("Поток запроса", "Request flow")}</div>
                      <Badge>auto</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <Badge variant="accent">Groq</Badge>
                      <ArrowRight className="h-4 w-4" />
                      <Badge variant="warning">OpenRouter</Badge>
                      <ArrowRight className="h-4 w-4" />
                      <Badge variant="success">Mock</Badge>
                    </div>
                    <div className="mt-4 rounded-2xl border border-border/70 bg-panel/70 p-4 font-mono text-xs leading-6 text-muted-foreground">
                      event: meta
                      <br />
                      data: {`{"strategy":"auto","attemptedProvider":"groq","finalProvider":"openrouter","fallbackActivated":true}`}
                      <br />
                      <br />
                      event: token
                      <br />
                      data: {`{"value":"RelayForge keeps the response moving..."}`}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-border/70 bg-background/70 p-5">
                      <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Задержка", "Latency")}</div>
                      <div className="mt-3 flex items-center gap-3">
                        <Zap className="h-5 w-5 text-accent" />
                        <span className="font-display text-2xl font-semibold">428 ms</span>
                      </div>
                    </div>
                    <div className="rounded-3xl border border-border/70 bg-background/70 p-5">
                      <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Режим", "Mode")}</div>
                      <div className="mt-3 flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-secondary" />
                        <span className="font-display text-2xl font-semibold">{t("Деградация", "Degraded")}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="shell-container py-8">
          <div className="grid gap-3 rounded-3xl border border-border/60 bg-panel/50 p-4 text-xs uppercase tracking-[0.22em] text-muted-foreground sm:grid-cols-4 sm:text-sm">
            <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">{t("Runtime Cloudflare Workers", "Cloudflare Workers runtime")}</div>
            <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">{t("Основной путь Groq Free", "Groq Free primary path")}</div>
            <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">{t("Fallback на OpenRouter Free", "OpenRouter free fallback")}</div>
            <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">{t("Гарантия демо через mock", "Mock demo guarantee")}</div>
          </div>
        </section>

        <section className="shell-container section-space">
          <motion.div {...fadeIn} className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-4">
              <div className="eyebrow">{t("Превью Продукта", "Product Preview")}</div>
              <h2 className="font-display text-4xl font-semibold text-balance">
                {t(
                  "Премиальный dashboard UI для скриншотов и интервью.",
                  "A premium dashboard UI built for screenshots and interviews."
                )}
              </h2>
              <p className="text-lg leading-8 text-muted-foreground">
                {t(
                  "Продуктовая поверхность объединяет streaming UX, статусы провайдеров и observability-аналитику в цельное демо developer-инфраструктуры.",
                  "The product surface combines streaming UX, provider health visibility and observability-style analytics into one credible developer infrastructure demo."
                )}
              </p>
            </div>
            <Card className="overflow-hidden">
              <CardContent className="grid gap-4 p-6 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="space-y-4 rounded-3xl border border-border/70 bg-background/75 p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{t("Статус провайдеров", "Provider status")}</div>
                    <Badge variant="accent">{t("деградация", "degraded")}</Badge>
                  </div>
                  {["Groq Free", "OpenRouter Free", "Mock / Demo"].map((label, index) => (
                    <div key={label} className="flex items-center justify-between rounded-2xl border border-border/70 bg-panel/70 px-4 py-3">
                      <span className="text-sm">{label}</span>
                      <Badge variant={index === 0 ? "warning" : index === 1 ? "accent" : "success"}>
                        {index === 0 ? t("ограничен", "limited") : index === 1 ? "fallback" : "demo-ready"}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 rounded-3xl border border-border/70 bg-background/75 p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{t("Телеметрия использования", "Usage telemetry")}</div>
                    <Badge>{t("наблюдаемость", "observability")}</Badge>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      [t("Запросы", "Requests"), "128"],
                      ["Fallback", "19"],
                      [t("Средняя задержка", "Avg latency"), "544 ms"]
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-border/70 bg-panel/70 p-4">
                        <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{label}</div>
                        <div className="mt-3 font-display text-2xl font-semibold">{value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-panel/70 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-sm font-medium">{t("Запросы по времени", "Requests over time")}</div>
                      <ChartNoAxesCombined className="h-4 w-4 text-accent" />
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {[28, 34, 48, 62, 44, 36, 52].map((height, index) => (
                        <div key={index} className="flex h-28 items-end">
                          <div
                            className="w-full rounded-t-2xl bg-[linear-gradient(180deg,rgba(79,125,255,0.95),rgba(127,99,255,0.55))]"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <section className="shell-container section-space">
          <motion.div {...fadeIn} className="space-y-10">
            <div className="space-y-4 text-center">
              <div className="eyebrow">{t("Ключевые Функции", "Core Features")}</div>
              <h2 className="font-display text-4xl font-semibold text-balance">
                {t("Один интерфейс, несколько провайдеров, устойчивость по дизайну.", "One interface, multiple providers, resilient by design.")}
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featureCards.map((feature) => {
                const Icon = feature.icon;

                return (
                  <Card key={feature.title}>
                    <CardHeader>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </section>

        <section className="shell-container section-space">
          <motion.div {...fadeIn} className="grid gap-6 lg:grid-cols-3">
            {workflowCards.map((item) => {
              const Icon = item.icon;

              return (
                <Card key={item.title}>
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-background/70">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </motion.div>
        </section>

        <section className="shell-container section-space">
          <motion.div {...fadeIn} className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>{t("Стримьте ответы в реальном времени", "Stream responses in real time")}</CardTitle>
                <CardDescription>
                  {t(
                    "Держите output-панель активной с прогрессивной выдачей токенов и стабильной версткой.",
                    "Keep the output panel alive with progressive tokens and a calm, stable layout."
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-3xl border border-border/70 bg-background/80 p-5 font-mono text-sm leading-7 text-foreground">
                  {t(
                    "RelayForge стримит частичный вывод параллельно с трекингом provider-метаданных.",
                    "RelayForge streams partial output while tracking provider metadata in parallel."
                  )}
                  <span className="animate-blink">|</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t("Fallback без драмы", "Fallback without drama")}</CardTitle>
                <CardDescription>
                  {t(
                    "Маршрутизация остается явной: пользователь видит, что пытались вызвать и кто реально отдал ответ.",
                    "Routing stays explicit: users always know what was attempted and what actually served the response."
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  t("timeout -> переход на OpenRouter", "timeout -> promote to OpenRouter"),
                  t("rate limit -> сохранение UX и retry ниже по цепочке", "rate limit -> preserve UX and retry downstream"),
                  t("исчерпание квоты -> переключение в demo-ready mock mode", "quota exhaustion -> switch into demo-ready mock mode")
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm text-muted-foreground">
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <section className="shell-container section-space">
          <motion.div {...fadeIn} className="space-y-10">
            <div className="space-y-4">
              <div className="eyebrow">{t("Маршрутизация Провайдеров", "Provider Routing")}</div>
              <h2 className="font-display text-4xl font-semibold text-balance">
                {t("Спроектировано под free-tier ограничения, а не вопреки им.", "Designed for free-tier constraints, not in spite of them.")}
              </h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {providerCards.map((provider) => (
                <Card key={provider.title}>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle>{provider.title}</CardTitle>
                      <Badge variant={provider.badge === "primary" ? "success" : provider.badge === "secondary" ? "warning" : "accent"}>
                        {provider.subtitle}
                      </Badge>
                    </div>
                    <CardDescription>{provider.detail}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="shell-container section-space">
          <motion.div {...fadeIn} className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <div className="eyebrow">{t("Free-Tier Архитектура", "Free-Tier Architecture")}</div>
              <h2 className="font-display text-4xl font-semibold text-balance">
                {t("Статический frontend. Serverless gateway. Секреты только на edge.", "Static frontend. Serverless gateway. Secrets only on the edge.")}
              </h2>
              <p className="text-lg leading-8 text-muted-foreground">
                {t(
                  "Cloudflare Pages хостит премиальный UI как статический export. Cloudflare Workers обрабатывают оркестрацию провайдеров, стриминг, нормализованные ошибки и телеметрию без платной backend-инфраструктуры.",
                  "Cloudflare Pages hosts the premium UI as a static export. Cloudflare Workers handle provider orchestration, streaming, normalized errors and telemetry without introducing paid backend infrastructure."
                )}
              </p>
            </div>
            <Card>
              <CardContent className="grid gap-4 p-6 md:grid-cols-2">
                {[
                  [t("Frontend", "Frontend"), "Next.js + Tailwind + TanStack Query + Recharts"],
                  [t("Backend", "Backend"), t("Cloudflare Worker с модульными provider-адаптерами", "Cloudflare Worker with modular provider adapters")],
                  [t("Контракты", "Contracts"), t("Общие Zod-схемы и типизированные response-shape", "Shared Zod schemas and typed response shapes")],
                  [t("Надежность", "Reliability"), t("Demo-safe mock mode для публичной доступности", "Demo-safe mock mode for public availability")]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{label}</div>
                    <div className="mt-3 text-sm leading-6 text-foreground">{value}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <section className="shell-container pb-24 pt-8">
          <motion.div {...fadeIn}>
            <Card className="overflow-hidden">
              <CardContent className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="space-y-4">
                  <div className="eyebrow">{t("Готово к исследованию", "Ready to explore")}</div>
                  <h2 className="font-display text-4xl font-semibold text-balance">
                    {t("Портфолио-проект, который ведет себя как реальный AI infra продукт.", "A portfolio project that behaves like a real AI infra product.")}
                  </h2>
                  <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                    {t(
                      "Откройте песочницу, проверьте маршрутизацию провайдеров, изучите docs и используйте dashboard как практический архитектурный walkthrough на интервью.",
                      "Open the playground, inspect provider routing, review the docs and use the dashboard as a concrete architecture walkthrough in interviews."
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link href="/app/playground">
                      {t("Запустить демо", "Launch demo")}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary">
                    <Link href="/docs">{t("Читать docs", "Read docs")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
