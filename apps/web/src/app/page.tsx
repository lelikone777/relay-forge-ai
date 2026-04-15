"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowRight,
  ChartNoAxesCombined,
  Cloud,
  DatabaseZap,
  GitBranch,
  ShieldCheck,
  Waves,
  Zap
} from "lucide-react";
import Link from "next/link";

import { ModePill, ProviderStatusPill } from "@/components/status-pill";
import { ProviderDistributionChart } from "@/components/charts/provider-distribution-chart";
import { UsageLatencyChart } from "@/components/charts/usage-latency-chart";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchProviderStatus, fetchUsage } from "@/lib/api";
import { demoProviderStatus, demoUsage } from "@/lib/demo-data";
import { formatDuration, formatNumber } from "@/lib/format";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45 }
};

export default function HomePage() {
  const { locale } = useI18n();
  const t = (ru: string, en: string) => pickLocale(locale, { ru, en });

  const { data: statusQuery } = useQuery({
    queryKey: ["provider-status"],
    queryFn: fetchProviderStatus
  });
  const { data: usageQuery } = useQuery({
    queryKey: ["usage"],
    queryFn: fetchUsage
  });

  const status = statusQuery?.data ?? demoProviderStatus.data;
  const usage = usageQuery?.data ?? demoUsage.data;
  const successRate =
    usage.totals.requests > 0 ? Math.round((usage.totals.successful / usage.totals.requests) * 100) : 0;
  const activeProviders = status.providers.filter((provider) => provider.available).length;
  const fallbackRate =
    usage.totals.requests > 0 ? Math.round((usage.totals.fallbackActivations / usage.totals.requests) * 100) : 0;

  const featureCards = [
    {
      icon: GitBranch,
      title: t("Единая AI API-поверхность", "One unified AI API surface"),
      description: t(
        "Один контракт запроса для разных провайдеров, без переноса ключей на клиент.",
        "One request contract across providers, without moving secrets into the client."
      )
    },
    {
      icon: Waves,
      title: t("Реальный SSE-стриминг", "Real SSE streaming"),
      description: t(
        "Токены приходят постепенно через Worker stream endpoint и отображаются без скачков layout.",
        "Tokens arrive progressively through the Worker streaming endpoint with stable UI rendering."
      )
    },
    {
      icon: ShieldCheck,
      title: t("Fallback orchestration", "Fallback orchestration"),
      description: t(
        "Groq идет первым, OpenRouter подхватывает при сбое, mock остается safety-net для публичного демо.",
        "Groq leads, OpenRouter takes over on failure, and mock remains the public-demo safety net."
      )
    },
    {
      icon: Activity,
      title: t("Нормализованные ошибки", "Normalized errors"),
      description: t(
        "UI получает единый error shape для validation, upstream failures и прерванного стрима.",
        "The UI receives one coherent error shape for validation, upstream failures and interrupted streams."
      )
    },
    {
      icon: ChartNoAxesCombined,
      title: t("Наблюдаемость поверх gateway", "Gateway observability"),
      description: t(
        "Статусы, логи и usage analytics собираются в один интерфейс и показывают реальную маршрутизацию.",
        "Status, logs and usage analytics come together in one interface and expose real routing behavior."
      )
    },
    {
      icon: Cloud,
      title: t("Serverless deployment", "Serverless deployment"),
      description: t(
        "Next.js frontend плюс Cloudflare Worker backend сохраняют архитектуру легкой и безопасной.",
        "A Next.js frontend and Cloudflare Worker backend keep the architecture lean and safe."
      )
    }
  ];

  const workflowCards = [
    {
      title: t("1. Нормализация запроса", "1. Normalize the request"),
      description: t(
        "Frontend отправляет один typed payload, а Worker валидирует стратегию, стриминг и лимиты.",
        "The frontend sends one typed payload and the Worker validates strategy, streaming and limits."
      )
    },
    {
      title: t("2. Выбор провайдера", "2. Choose a provider"),
      description: t(
        "Auto-маршрутизация идет по цепочке Groq -> OpenRouter -> Mock и фиксирует attempted/final provider.",
        "Auto routing walks the chain Groq -> OpenRouter -> Mock and records attempted/final provider."
      )
    },
    {
      title: t("3. Поток и метаданные", "3. Stream plus metadata"),
      description: t(
        "Ответ отдается через SSE или JSON fallback, а метаданные формируют status/logs/usage представление.",
        "Responses are delivered through SSE or JSON fallback while metadata powers status, logs and usage views."
      )
    }
  ];

  const architectureCards = [
    {
      title: t("Frontend", "Frontend"),
      description: t(
        "Next.js App Router, TanStack Query, Recharts и новый визуальный слой без mock-копирайта.",
        "Next.js App Router, TanStack Query, Recharts and a rebuilt visual layer without mock marketing claims."
      )
    },
    {
      title: t("Worker", "Worker"),
      description: t(
        "Секреты провайдеров и вся оркестрация остаются только на серверной стороне.",
        "Provider secrets and all orchestration remain server-side only."
      )
    },
    {
      title: t("Shared contracts", "Shared contracts"),
      description: t(
        "Типы запросов, ответов, ошибок и usage contracts используются и фронтендом, и backend-слоем.",
        "Request, response, error and usage contracts are shared by the frontend and backend."
      )
    },
    {
      title: t("State today", "State today"),
      description: t(
        "Логи и usage остаются in-memory в текущей сборке, поэтому интерфейс не обещает durable storage или SLA.",
        "Logs and usage stay in-memory in the current build, so the interface avoids promising durable storage or SLAs."
      )
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 surface-grid grid-fade opacity-50" />
          <div className="shell-container section-space relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div {...fadeIn} className="space-y-8">
              <Badge variant="accent">{t("Production-Ready AI Infrastructure", "Production-Ready AI Infrastructure")}</Badge>
              <div className="space-y-6">
                <h1 className="text-safe font-display text-5xl font-semibold tracking-tight text-balance text-white sm:text-6xl lg:text-7xl">
                  {t("Unified AI Gateway with intelligent fallback and a rebuilt product surface.", "Unified AI Gateway with intelligent fallback and a rebuilt product surface.")}
                </h1>
                <p className="text-safe max-w-2xl text-lg leading-8 text-muted-foreground">
                  {t(
                    "Этот интерфейс уже сидит на реальном backend Worker: стриминг, маршрутизация, usage и provider health идут из рабочих endpoint'ов, а секреты остаются только на стороне сервера.",
                    "This interface now sits on top of the real Worker backend: streaming, routing, usage and provider health come from working endpoints, while secrets stay server-side only."
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link href="/app/playground">
                    {t("Open Workspace", "Open Workspace")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/docs">{t("API Docs", "API Docs")}</Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Badge variant="success">{t("Live streaming", "Live streaming")}</Badge>
                <Badge variant="accent">{t("Worker-side secrets", "Worker-side secrets")}</Badge>
                <Badge variant="warning">{t("Fallback visibility", "Fallback visibility")}</Badge>
              </div>
            </motion.div>

            <motion.div {...fadeIn} className="relative">
              <div className="absolute -inset-5 animate-float rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.18),transparent_55%),radial-gradient(circle_at_bottom,rgba(124,58,237,0.18),transparent_58%)] blur-2xl" />
              <Card className="relative overflow-hidden ambient-ring">
                <div className="absolute inset-0 surface-grid opacity-40" />
                <CardHeader className="relative border-b border-white/10">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardTitle>{t("Gateway preview", "Gateway preview")}</CardTitle>
                      <CardDescription>
                        {t("Живой снимок mode, provider routing и usage telemetry.", "A live snapshot of mode, provider routing and usage telemetry.")}
                      </CardDescription>
                    </div>
                    <ModePill mode={status.mode} />
                  </div>
                </CardHeader>
                <CardContent className="relative grid gap-4 p-6">
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-sm font-medium text-white">{t("Routing order", "Routing order")}</div>
                      <Badge>{t("auto", "auto")}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      {status.routingOrder.map((provider, index) => (
                        <div key={provider} className="flex items-center gap-3">
                          <Badge variant={index === 0 ? "accent" : index === 1 ? "warning" : "success"}>
                            {provider}
                          </Badge>
                          {index < status.routingOrder.length - 1 ? <ArrowRight className="h-4 w-4" /> : null}
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-black/35 p-4 font-mono text-xs leading-6 text-muted-foreground">
                      event: meta
                      <br />
                      data:{" "}
                      {`{"strategy":"auto","attemptedProvider":"${status.providers[0]?.id ?? "groq"}","finalProvider":"${status.providers[1]?.id ?? status.providers[0]?.id ?? "groq"}","fallbackActivated":${usage.totals.fallbackActivations > 0}}`}
                      <br />
                      <br />
                      event: token
                      <br />
                      data: {`{"value":"RelayForge keeps the response moving while preserving provider visibility."}`}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                      <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Providers live", "Providers live")}</div>
                      <div className="mt-3 font-display text-3xl font-semibold text-white">{activeProviders}</div>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                      <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Avg latency", "Avg latency")}</div>
                      <div className="mt-3 font-display text-3xl font-semibold text-white">{formatDuration(usage.totals.avgLatencyMs)}</div>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                      <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Fallbacks", "Fallbacks")}</div>
                      <div className="mt-3 font-display text-3xl font-semibold text-white">{formatNumber(usage.totals.fallbackActivations)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="shell-container py-8">
          <div className="grid gap-3 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-4 text-xs uppercase tracking-[0.22em] text-muted-foreground sm:grid-cols-4 sm:text-sm">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">{t("Cloudflare Workers runtime", "Cloudflare Workers runtime")}</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">{t("Groq primary path", "Groq primary path")}</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">{t("OpenRouter fallback", "OpenRouter fallback")}</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">{t("Mock demo safety-net", "Mock demo safety-net")}</div>
          </div>
        </section>

        <section className="shell-container section-space">
          <motion.div {...fadeIn} className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="space-y-4">
              <div className="eyebrow">{t("Platform Dashboard", "Platform Dashboard")}</div>
              <h2 className="font-display text-4xl font-semibold text-balance text-white">
                {t("Real-time observability wired to the actual gateway.", "Real-time observability wired to the actual gateway.")}
              </h2>
              <p className="text-lg leading-8 text-muted-foreground">
                {t(
                  "Вместо фейковых карточек интерфейс показывает реальные provider statuses, usage totals и routing behavior из Worker API с безопасным fallback на demo data, если backend недоступен.",
                  "Instead of static showcase cards, the interface shows real provider statuses, usage totals and routing behavior from the Worker API, with demo-data fallback if the backend is unavailable."
                )}
              </p>
            </div>
            <Card className="overflow-hidden">
              <CardContent className="grid gap-4 p-6 lg:grid-cols-[0.78fr_1.22fr]">
                <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-white">{t("Provider health", "Provider health")}</div>
                    <ModePill mode={status.mode} />
                  </div>
                  {status.providers.map((provider) => (
                    <div key={provider.id} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm text-white">{provider.label}</div>
                          <div className="text-xs text-muted-foreground">{provider.model}</div>
                        </div>
                        <ProviderStatusPill status={provider.status} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-white">{t("Usage telemetry", "Usage telemetry")}</div>
                    <Badge variant="accent">{t("live snapshot", "live snapshot")}</Badge>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      [t("Requests", "Requests"), formatNumber(usage.totals.requests)],
                      [t("Success rate", "Success rate"), `${successRate}%`],
                      [t("Fallback rate", "Fallback rate"), `${fallbackRate}%`]
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{label}</div>
                        <div className="mt-3 font-display text-2xl font-semibold text-white">{value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-sm font-medium text-white">{t("Requests over time", "Requests over time")}</div>
                      <ChartNoAxesCombined className="h-4 w-4 text-accent" />
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {usage.timeseries.map((point) => (
                        <div key={point.label} className="flex h-28 items-end">
                          <div
                            className="w-full rounded-t-2xl bg-[linear-gradient(180deg,rgba(34,211,238,0.95),rgba(124,58,237,0.55))]"
                            style={{ height: `${Math.max(14, Math.round((point.requests / Math.max(...usage.timeseries.map((entry) => entry.requests))) * 100))}%` }}
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
              <div className="eyebrow">{t("Built for Resilience", "Built for Resilience")}</div>
              <h2 className="font-display text-4xl font-semibold text-balance text-white">
                {t("The new interface keeps the aesthetic from Relayforgeaiv2 and the behavior from RelayForge AI.", "The new interface keeps the aesthetic from Relayforgeaiv2 and the behavior from RelayForge AI.")}
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featureCards.map((feature) => {
                const Icon = feature.icon;

                return (
                  <Card key={feature.title} className="group overflow-hidden">
                    <CardHeader>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-accent transition group-hover:scale-105">
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
            {workflowCards.map((item, index) => (
              <Card key={item.title}>
                <CardHeader>
                  <Badge variant={index === 0 ? "accent" : index === 1 ? "warning" : "success"}>{t("Flow", "Flow")}</Badge>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </motion.div>
        </section>

        <section className="shell-container section-space">
          <motion.div {...fadeIn} className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-4">
              <div className="eyebrow">{t("Serverless Architecture", "Serverless Architecture")}</div>
              <h2 className="font-display text-4xl font-semibold text-balance text-white">
                {t("Server-side secrets, shared contracts and an honest runtime story.", "Server-side secrets, shared contracts and an honest runtime story.")}
              </h2>
              <p className="text-lg leading-8 text-muted-foreground">
                {t(
                  "Дизайн взят из нового лендинга, но продуктовая подача теперь соответствует реальной архитектуре: backend Worker оркестрирует провайдеров, frontend только потребляет API, а shared package удерживает контракты консистентными.",
                  "The design comes from the new landing concept, but the product story now matches the real architecture: the Worker orchestrates providers, the frontend consumes the API, and the shared package keeps contracts consistent."
                )}
              </p>
            </div>
            <Card>
              <CardContent className="grid gap-4 p-6 md:grid-cols-2">
                {architectureCards.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{item.title}</div>
                    <div className="mt-3 text-sm leading-6 text-foreground">{item.description}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <section className="shell-container section-space">
          <motion.div {...fadeIn} className="space-y-8">
            <div className="space-y-4">
              <div className="eyebrow">{t("Telemetry", "Telemetry")}</div>
              <h2 className="font-display text-4xl font-semibold text-balance text-white">
                {t("Real charts now replace decorative metrics.", "Real charts now replace decorative metrics.")}
              </h2>
            </div>
            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Requests and latency", "Requests and latency")}</CardTitle>
                  <CardDescription>
                    {t("Данные приходят из usage endpoint и показывают объем, fallback и задержку.", "Usage endpoint data visualizes volume, fallback activity and latency.")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UsageLatencyChart data={usage.timeseries} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t("Provider distribution", "Provider distribution")}</CardTitle>
                  <CardDescription>
                    {t("Финальный провайдер после fallback, а не маркетинговая иллюстрация.", "The final provider after fallback, not a decorative marketing chart.")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ProviderDistributionChart data={usage.providerDistribution} />
                  <div className="grid gap-2">
                    {usage.providerDistribution.map((entry) => (
                      <div key={entry.provider} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                        <span className="uppercase tracking-[0.18em] text-muted-foreground">{entry.provider}</span>
                        <span className="font-medium text-white">{formatNumber(entry.value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </section>

        <section className="shell-container pb-24 pt-6">
          <motion.div {...fadeIn}>
            <Card className="overflow-hidden">
              <CardContent className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="space-y-4">
                  <div className="eyebrow">{t("Ready to inspect", "Ready to inspect")}</div>
                  <h2 className="font-display text-4xl font-semibold text-balance text-white">
                    {t("Use the playground as the front door, then inspect how the system behaves under fallback.", "Use the playground as the front door, then inspect how the system behaves under fallback.")}
                  </h2>
                  <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                    {t(
                      "Откройте stream endpoint, проверьте provider status, посмотрите logs и usage analytics. Весь функционал уже перенесен на новый дизайн без выноса ключей во frontend.",
                      "Open the stream endpoint, inspect provider status, review logs and usage analytics. The functional surface is now migrated onto the new design without exposing provider keys in the frontend."
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link href="/app/playground">
                      {t("Launch demo", "Launch demo")}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary">
                    <Link href="/app/status">{t("Provider status", "Provider status")}</Link>
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
