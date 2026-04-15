"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ShieldCheck, Waves } from "lucide-react";

import { MetricCard } from "@/components/metric-card";
import { PageIntro } from "@/components/page-intro";
import { ModePill, ProviderStatusPill } from "@/components/status-pill";
import { InlineError } from "@/components/states/inline-error";
import { PageSkeleton } from "@/components/states/page-skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchProviderStatus } from "@/lib/api";
import { formatDuration } from "@/lib/format";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

export default function StatusPage() {
  const { locale } = useI18n();
  const t = (ru: string, en: string) => pickLocale(locale, { ru, en });
  const { data, isLoading, refetch, isError } = useQuery({
    queryKey: ["provider-status"],
    queryFn: fetchProviderStatus
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (isError || !data) {
    return (
      <InlineError
        title={t("Статус недоступен", "Status unavailable")}
        description={t("Не удалось загрузить состояние провайдеров.", "Provider health could not be loaded.")}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="min-w-0 space-y-8">
      <PageIntro
        eyebrow={t("Provider Health", "Provider Health")}
        title={t("Observe readiness across every provider tier", "Observe readiness across every provider tier")}
        description={t(
          "Страница показывает реальный health snapshot цепочки Groq -> OpenRouter -> Mock, а не статический декоративный список.",
          "This page shows the real health snapshot for the Groq -> OpenRouter -> Mock chain instead of a decorative static list."
        )}
        actions={<ModePill mode={data.data.mode} />}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard
          label={t("Providers live", "Providers live")}
          value={`${data.data.providers.filter((item) => item.available).length}`}
          hint={t("Адаптеры отвечают на health check.", "Adapters responding to health checks.")}
          icon={<ShieldCheck className="h-5 w-5" />}
        />
        <MetricCard
          label={t("Routing order", "Routing order")}
          value="3 tiers"
          hint="Groq -> OpenRouter -> Mock"
          icon={<ArrowRight className="h-5 w-5" />}
        />
        <MetricCard
          label={t("Streaming paths", "Streaming paths")}
          value={`${data.data.providers.filter((item) => item.supportsStreaming).length}`}
          hint={t("SSE-capable providers available.", "SSE-capable providers available.")}
          icon={<Waves className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("Fallback policy", "Fallback policy")}</CardTitle>
            <CardDescription>
              {t(
                "Fallback активируется только когда текущий upstream path не может корректно обслужить запрос.",
                "Fallback activates only when the current upstream path cannot serve the request cleanly."
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="accent">Groq</Badge>
              <ArrowRight className="h-4 w-4" />
              <Badge variant="warning">OpenRouter</Badge>
              <ArrowRight className="h-4 w-4" />
              <Badge variant="success">Mock / Demo</Badge>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>{t("Primary path: low-latency Groq in auto mode.", "Primary path: low-latency Groq in auto mode.")}</div>
                <div>{t("Fallback tier: OpenRouter takes over on limits, timeouts or malformed upstream output.", "Fallback tier: OpenRouter takes over on limits, timeouts or malformed upstream output.")}</div>
                <div>{t("Safety net: mock keeps the public workspace usable even if real providers are constrained.", "Safety net: mock keeps the public workspace usable even if real providers are constrained.")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>{t("Routing snapshot", "Routing snapshot")}</CardTitle>
            <CardDescription>
              {t("Текущий режим и порядок маршрутизации из Worker status endpoint.", "Current mode and routing order from the Worker status endpoint.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm font-medium text-white">{t("System mode", "System mode")}</div>
                <ModePill mode={data.data.mode} />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {data.data.routingOrder.map((provider, index) => (
                  <div key={provider} className="flex items-center gap-3">
                    <Badge variant={index === 0 ? "accent" : index === 1 ? "warning" : "success"}>{provider}</Badge>
                    {index < data.data.routingOrder.length - 1 ? <ArrowRight className="h-4 w-4 text-muted-foreground" /> : null}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {data.data.providers.map((provider) => (
                <div key={provider.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-white">{provider.label}</div>
                      <div className="text-xs text-muted-foreground">{provider.model}</div>
                    </div>
                    <ProviderStatusPill status={provider.status} />
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">{formatDuration(provider.latencyMs)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {data.data.providers.map((provider) => (
          <Card key={provider.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{provider.label}</CardTitle>
                  <CardDescription>{provider.description}</CardDescription>
                </div>
                <ProviderStatusPill status={provider.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Model", "Model")}</div>
                  <div className="text-safe mt-2 text-sm text-foreground break-words">{provider.model}</div>
                </div>
                <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Latency", "Latency")}</div>
                  <div className="mt-2 text-sm text-foreground">{formatDuration(provider.latencyMs)}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>{provider.freeTierReady ? t("free-tier ready", "free-tier ready") : t("paid only", "paid only")}</Badge>
                <Badge variant={provider.supportsStreaming ? "success" : "warning"}>
                  {provider.supportsStreaming ? t("streaming", "streaming") : t("non-streaming", "non-streaming")}
                </Badge>
                <Badge variant={provider.available ? "accent" : "danger"}>
                  {provider.available ? t("available", "available") : t("unavailable", "unavailable")}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
