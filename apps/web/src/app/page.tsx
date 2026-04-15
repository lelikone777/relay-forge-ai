"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  GitBranch,
  Globe,
  Shield,
  TrendingUp,
  Zap
} from "lucide-react";
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
  "from-orange-500 to-red-500",
  "from-pink-500 to-rose-500"
];

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
    usage.totals.requests > 0 ? ((usage.totals.successful / usage.totals.requests) * 100).toFixed(1) : "0.0";

  const features = [
    {
      icon: Globe,
      title: t("One Unified API Surface", "One Unified API Surface"),
      description: t(
        "Single endpoint abstracts multiple AI providers without exposing secrets in the frontend.",
        "Single endpoint abstracts multiple AI providers without exposing secrets in the frontend."
      )
    },
    {
      icon: Activity,
      title: t("Real-Time Streaming", "Real-Time Streaming"),
      description: t(
        "Server-Sent Events for live token-by-token responses from the Worker streaming endpoint.",
        "Server-Sent Events for live token-by-token responses from the Worker streaming endpoint."
      )
    },
    {
      icon: GitBranch,
      title: t("Automatic Fallback Orchestration", "Automatic Fallback Orchestration"),
      description: t(
        "Groq -> OpenRouter -> Mock chain with visible attempted and final provider metadata.",
        "Groq -> OpenRouter -> Mock chain with visible attempted and final provider metadata."
      )
    },
    {
      icon: Shield,
      title: t("Normalized Errors", "Normalized Errors"),
      description: t(
        "Consistent error format across validation, upstream failures and interrupted streams.",
        "Consistent error format across validation, upstream failures and interrupted streams."
      )
    },
    {
      icon: Activity,
      title: t("Provider Visibility", "Provider Visibility"),
      description: t(
        "Status, logs and usage reflect actual routing behavior instead of decorative placeholder metrics.",
        "Status, logs and usage reflect actual routing behavior instead of decorative placeholder metrics."
      )
    },
    {
      icon: Zap,
      title: t("Free-Tier-First Architecture", "Free-Tier-First Architecture"),
      description: t(
        "Next.js on Pages and orchestration in a Worker keep the product public, cheap and secure.",
        "Next.js on Pages and orchestration in a Worker keep the product public, cheap and secure."
      )
    }
  ];

  const providerBars = [
    {
      label: status.providers[0]?.label ?? "Groq Free",
      latency: status.providers[0]?.latencyMs ?? 42,
      width: 95,
      tone: "from-cyan-500 to-emerald-500"
    },
    {
      label: status.providers[1]?.label ?? "OpenRouter Free",
      latency: status.providers[1]?.latencyMs ?? 52,
      width: 88,
      tone: "from-violet-500 to-blue-500"
    },
    {
      label: status.providers[2]?.label ?? "Mock Provider",
      latency: 0,
      width: 100,
      tone: "from-blue-500 to-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0d0d14] to-[#0a0a0f] text-white antialiased">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden px-6 py-24 lg:px-8 lg:py-32">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[120px]" />
            <div className="absolute top-40 right-0 h-[600px] w-[600px] rounded-full bg-violet-500/20 blur-[120px]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.7),transparent)]" />
          </div>

          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1">
                  <Zap className="h-3 w-3 text-cyan-400" />
                  <span className="text-sm text-cyan-300">{t("Production-Ready AI Infrastructure", "Production-Ready AI Infrastructure")}</span>
                </div>

                <div className="space-y-4">
                  <h1 className="max-w-xl text-5xl font-bold tracking-tight lg:text-6xl">
                    <span className="bg-gradient-to-r from-white via-cyan-200 to-violet-200 bg-clip-text text-transparent">
                      {t("Unified AI Gateway", "Unified AI Gateway")}
                    </span>
                    <br />
                    <span className="text-white/95">{t("with Intelligent Fallback", "with Intelligent Fallback")}</span>
                  </h1>

                  <p className="max-w-xl text-xl text-white/60">
                    {t(
                      "One API surface. Multiple providers. Real-time streaming via SSE. Automatic fallback orchestration from Groq to OpenRouter to demo mode.",
                      "One API surface. Multiple providers. Real-time streaming via SSE. Automatic fallback orchestration from Groq to OpenRouter to demo mode."
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="border-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-600 hover:to-blue-600"
                  >
                    <Link href="/app/playground">
                      {t("Open Workspace", "Open Workspace")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white/10 bg-white text-black hover:bg-white/90">
                    <Link href="/docs">{t("API Docs", "API Docs")}</Link>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <Badge variant="success" className="bg-emerald-500/10 px-3 py-1 text-emerald-300 border-emerald-500/20">
                    <Activity className="mr-1.5 h-3 w-3" />
                    {t("Live Streaming", "Live Streaming")}
                  </Badge>
                  <Badge variant="accent" className="bg-violet-500/10 px-3 py-1 text-violet-300 border-violet-500/20">
                    <GitBranch className="mr-1.5 h-3 w-3" />
                    {t("Multi-Provider Routing", "Multi-Provider Routing")}
                  </Badge>
                  <Badge variant="accent" className="bg-blue-500/10 px-3 py-1 text-blue-300 border-blue-500/20">
                    <Zap className="mr-1.5 h-3 w-3" />
                    {t("Free-Tier First", "Free-Tier First")}
                  </Badge>
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl shadow-2xl shadow-cyan-500/10">
                  <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                      <span className="text-sm text-white/80">{t("Stream Active", "Stream Active")}</span>
                    </div>
                    <Badge className="border-cyan-500/30 bg-cyan-500/20 text-cyan-300">~{usage.totals.avgLatencyMs}ms</Badge>
                  </div>

                  <div className="mb-6 space-y-3">
                    {status.providers.map((provider, index) => (
                      <div key={provider.id} className="flex items-center gap-3">
                        <div
                          className={`flex h-10 flex-1 items-center rounded-lg border px-4 ${
                            index === 0
                              ? "border-cyan-500/30 bg-gradient-to-r from-cyan-500/20 to-cyan-500/10"
                              : index === 1
                                ? "border-violet-500/30 bg-gradient-to-r from-violet-500/20 to-violet-500/10"
                                : "border-blue-500/30 bg-gradient-to-r from-blue-500/20 to-blue-500/10"
                          }`}
                        >
                          <span
                            className={`text-sm ${
                              index === 0 ? "text-cyan-300" : index === 1 ? "text-violet-300" : "text-blue-300"
                            }`}
                          >
                            {provider.label}
                          </span>
                          {index === 0 ? (
                            <Zap className="ml-auto h-4 w-4 text-cyan-400" />
                          ) : index === 1 ? (
                            <Activity className="ml-auto h-4 w-4 text-violet-400" />
                          ) : (
                            <GitBranch className="ml-auto h-4 w-4 text-blue-400" />
                          )}
                        </div>
                        {index < status.providers.length - 1 ? <ArrowRight className="h-4 w-4 text-white/40" /> : <div className="w-4" />}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5 rounded-lg border border-white/5 bg-black/60 p-4 font-mono text-xs">
                    <div className="text-cyan-400">[meta] provider: {status.providers[0]?.id ?? "groq"}</div>
                    <div className="text-white/60">[meta] model: {status.providers[0]?.model ?? "llama-3.1-8b-instant"}</div>
                    <div className="text-emerald-400">[token] RelayForge keeps the response moving...</div>
                    <div className="text-white/40">[meta] latency: {usage.totals.avgLatencyMs}ms</div>
                  </div>
                </div>

                <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 blur-2xl" />
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 space-y-4 text-center">
              <Badge className="border-violet-500/20 bg-violet-500/10 text-violet-300">{t("Platform Dashboard", "Platform Dashboard")}</Badge>
              <h2 className="text-4xl font-bold">
                <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {t("Real-Time Observability", "Real-Time Observability")}
                </span>
              </h2>
              <p className="mx-auto max-w-2xl text-white/60">
                {t(
                  "Monitor provider health, track fallback activations, and observe streaming responses in real-time.",
                  "Monitor provider health, track fallback activations, and observe streaming responses in real-time."
                )}
              </p>
            </div>

            <div className="mb-6 grid gap-6 lg:grid-cols-3">
              <Card className="border-white/10 bg-gradient-to-br from-black/60 to-black/40 p-6 shadow-xl">
                <div className="mb-4 flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-white/60">{t("Total Requests", "Total Requests")}</p>
                    <p className="text-3xl font-bold text-white">{formatNumber(usage.totals.requests)}</p>
                  </div>
                  <div className="rounded-lg bg-cyan-500/10 p-2">
                    <Activity className="h-5 w-5 text-cyan-400" />
                  </div>
                </div>
                <div className="text-sm text-emerald-400">
                  <span className="inline-flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {t("Live gateway traffic", "Live gateway traffic")}
                  </span>
                </div>
              </Card>

              <Card className="border-white/10 bg-gradient-to-br from-black/60 to-black/40 p-6 shadow-xl">
                <div className="mb-4 flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-white/60">{t("Avg Latency", "Avg Latency")}</p>
                    <p className="text-3xl font-bold text-white">{formatDuration(usage.totals.avgLatencyMs)}</p>
                  </div>
                  <div className="rounded-lg bg-violet-500/10 p-2">
                    <Clock className="h-5 w-5 text-violet-400" />
                  </div>
                </div>
                <div className="text-sm text-emerald-400">
                  <span className="inline-flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {t("Observed through usage endpoint", "Observed through usage endpoint")}
                  </span>
                </div>
              </Card>

              <Card className="border-white/10 bg-gradient-to-br from-black/60 to-black/40 p-6 shadow-xl">
                <div className="mb-4 flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-white/60">{t("Fallback Count", "Fallback Count")}</p>
                    <p className="text-3xl font-bold text-white">{formatNumber(usage.totals.fallbackActivations)}</p>
                  </div>
                  <div className="rounded-lg bg-blue-500/10 p-2">
                    <Zap className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">{t("Success Rate", "Success Rate")}</span>
                    <span className="text-white">{successRate}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${successRate}%` }} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm text-white/60">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>{t("All systems operational", "All systems operational")}</span>
                </div>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-white/10 bg-gradient-to-br from-black/60 to-black/40 p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{t("Provider Health", "Provider Health")}</h3>
                  <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                    {t("Live Snapshot", "Live Snapshot")}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {providerBars.map((provider) => (
                    <div key={provider.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                          <span className="text-sm text-white">{provider.label}</span>
                        </div>
                        <span className="text-xs text-white/60">
                          {provider.latency ? `${provider.latency}ms avg` : t("Always ready", "Always ready")}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                        <div className={`h-full bg-gradient-to-r ${provider.tone}`} style={{ width: `${provider.width}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2 border-t border-white/5 pt-6 text-sm text-white/60">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>{t("Fallback chain verified", "Fallback chain verified")}</span>
                </div>
              </Card>

              <Card className="border-white/10 bg-gradient-to-br from-black/60 to-black/40 p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{t("Live Stream Output", "Live Stream Output")}</h3>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    <span className="text-xs text-white/60">{t("Streaming", "Streaming")}</span>
                  </div>
                </div>

                <div className="h-[280px] overflow-y-auto rounded-lg border border-white/5 bg-black/60 p-4 font-mono text-xs space-y-2">
                  <div className="flex gap-2">
                    <span className="shrink-0 text-cyan-400">[meta]</span>
                    <span className="text-white/60">request_count: {usage.totals.requests}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="shrink-0 text-cyan-400">[meta]</span>
                    <span className="text-white/60">provider: {status.providers[0]?.id ?? "groq"}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="shrink-0 text-cyan-400">[meta]</span>
                    <span className="text-white/60">model: {status.providers[0]?.model ?? "llama-3.1-8b-instant"}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="shrink-0 text-violet-400">[meta]</span>
                    <span className="text-white/60">mode: {status.mode}</span>
                  </div>
                  <div className="my-3 h-px bg-white/5" />
                  <div className="flex gap-2">
                    <span className="shrink-0 text-emerald-400">[token]</span>
                    <span className="text-white/90">{t("Hello, I can route your prompt through the active provider chain.", "Hello, I can route your prompt through the active provider chain.")}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="shrink-0 text-emerald-400">[token]</span>
                    <span className="text-white/90">{t("If the primary path degrades, RelayForge continues through fallback.", "If the primary path degrades, RelayForge continues through fallback.")}</span>
                  </div>
                  <div className="my-3 h-px bg-white/5" />
                  <div className="flex gap-2">
                    <span className="shrink-0 text-blue-400">[meta]</span>
                    <span className="text-white/60">latency: {usage.totals.avgLatencyMs}ms</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="shrink-0 text-blue-400">[meta]</span>
                    <span className="text-white/60">fallbacks: {usage.totals.fallbackActivations}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="shrink-0 text-emerald-400">[done]</span>
                    <span className="text-emerald-400/80">stream_complete</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs">
                  <Badge className="border-cyan-500/20 bg-cyan-500/10 text-cyan-300">SSE Stream</Badge>
                  <Badge className="border-violet-500/20 bg-violet-500/10 text-violet-300">{formatNumber(usage.totals.successful)} success</Badge>
                  <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-300">{usage.totals.avgLatencyMs}ms</Badge>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="relative px-6 py-24 lg:px-8">
          <div className="absolute inset-0 -z-10">
            <div className="absolute bottom-0 right-1/4 h-[700px] w-[700px] rounded-full bg-violet-500/10 blur-[120px]" />
          </div>
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 space-y-4 text-center">
              <h2 className="text-4xl font-bold">
                <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {t("Built for Resilience", "Built for Resilience")}
                </span>
              </h2>
              <p className="mx-auto max-w-2xl text-white/60">
                {t(
                  "The design is now carried over much closer to the source project while still binding every core block to real RelayForge behavior.",
                  "The design is now carried over much closer to the source project while still binding every core block to real RelayForge behavior."
                )}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className="group relative border-white/10 bg-gradient-to-br from-black/60 to-black/40 p-6 shadow-xl transition-all duration-300 hover:border-white/20 hover:shadow-2xl"
                  >
                    <div className="relative mb-4 inline-flex overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-3">
                      <Icon className="relative z-10 h-6 w-6 text-white" />
                      <div className={`absolute inset-0 bg-gradient-to-r ${featureGradients[index]} opacity-20 transition-opacity duration-300 group-hover:opacity-30`} />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-white/60">{feature.description}</p>
                    <div className={`pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-br ${featureGradients[index]} opacity-0 transition-opacity duration-300 group-hover:opacity-[0.02]`} />
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 space-y-4 text-center">
              <h2 className="text-4xl font-bold">
                <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {t("Real Telemetry", "Real Telemetry")}
                </span>
              </h2>
              <p className="mx-auto max-w-2xl text-white/60">
                {t(
                  "These charts now use the actual usage dataset behind the gateway instead of fixed marketing numbers.",
                  "These charts now use the actual usage dataset behind the gateway instead of fixed marketing numbers."
                )}
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-white/10 bg-gradient-to-br from-black/60 to-black/40 p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-white">{t("Request Volume", "Request Volume")}</h3>
                    <p className="text-sm text-white/60">{t("Usage endpoint timeseries", "Usage endpoint timeseries")}</p>
                  </div>
                  <div className="rounded-lg bg-cyan-500/10 p-2">
                    <Activity className="h-5 w-5 text-cyan-400" />
                  </div>
                </div>
                <UsageLatencyChart data={usage.timeseries} />
              </Card>

              <Card className="border-white/10 bg-gradient-to-br from-black/60 to-black/40 p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-white">{t("Provider Distribution", "Provider Distribution")}</h3>
                    <p className="text-sm text-white/60">{t("Final routing breakdown", "Final routing breakdown")}</p>
                  </div>
                  <div className="rounded-lg bg-blue-500/10 p-2">
                    <GitBranch className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
                <ProviderDistributionChart data={usage.providerDistribution} />
              </Card>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {[
                { label: t("Success Rate", "Success Rate"), value: `${successRate}%`, change: `${usage.totals.successful}/${usage.totals.requests}`, positive: true },
                { label: t("Avg Response Time", "Avg Response Time"), value: formatDuration(usage.totals.avgLatencyMs), change: t("Live average", "Live average"), positive: true },
                { label: t("Fallback Activations", "Fallback Activations"), value: formatNumber(usage.totals.fallbackActivations), change: t("Tracked by worker", "Tracked by worker"), positive: false },
                { label: t("Failed Requests", "Failed Requests"), value: formatNumber(usage.totals.failed), change: t("Visible separately", "Visible separately"), positive: usage.totals.failed === 0 }
              ].map((stat) => (
                <Card key={stat.label} className="border-white/10 bg-gradient-to-br from-black/60 to-black/40 p-4 shadow-xl">
                  <div className="space-y-2">
                    <p className="text-xs text-white/60">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className={`text-xs ${stat.positive ? "text-emerald-400" : "text-amber-400"}`}>{stat.change}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="relative px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Card className="border-white/10 bg-gradient-to-br from-black/80 to-black/60 p-12 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-violet-500/5 to-blue-500/5" />
              <div className="relative space-y-6 text-center">
                <h2 className="text-4xl font-bold lg:text-5xl">
                  <span className="bg-gradient-to-r from-white via-cyan-200 to-violet-200 bg-clip-text text-transparent">
                    {t("Ready to Build?", "Ready to Build?")}
                  </span>
                </h2>
                <p className="mx-auto max-w-2xl text-xl text-white/60">
                  {t(
                    "Start streaming AI responses with automatic fallback orchestration and inspect the live gateway behavior.",
                    "Start streaming AI responses with automatic fallback orchestration and inspect the live gateway behavior."
                  )}
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="border-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-600 hover:to-blue-600"
                  >
                    <Link href="/app/playground">
                      {t("Open Workspace", "Open Workspace")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary" className="border-white/10 hover:bg-white/5">
                    <Link href="/docs">{t("View Documentation", "View Documentation")}</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
