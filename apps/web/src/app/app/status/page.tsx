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
        title={pickLocale(locale, { ru: "Статус недоступен", en: "Status unavailable" })}
        description={pickLocale(locale, {
          ru: "Не удалось загрузить состояние провайдеров.",
          en: "Provider health could not be loaded."
        })}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="min-w-0 space-y-8">
      <PageIntro
        eyebrow={pickLocale(locale, { ru: "Состояние Провайдеров", en: "Provider Health" })}
        title={pickLocale(locale, {
          ru: "Отслеживайте готовность маршрутизации по всем уровням провайдеров",
          en: "Observe routing readiness across every provider tier"
        })}
        description={pickLocale(locale, {
          ru: "Карточки статуса показывают, какой провайдер основной, какой уровень ограничен и почему RelayForge продолжает обслуживать запросы в рамках free-tier.",
          en: "Status cards expose which provider is primary, which tier is constrained and why RelayForge can still serve requests under free-tier conditions."
        })}
        actions={<ModePill mode={data.data.mode} />}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard
          label={pickLocale(locale, { ru: "Активных провайдеров", en: "Providers live" })}
          value={`${data.data.providers.filter((item) => item.available).length}`}
          hint={pickLocale(locale, { ru: "Адаптеры отвечают на health-check.", en: "Adapters responding to health checks." })}
          icon={<ShieldCheck className="h-5 w-5" />}
        />
        <MetricCard
          label={pickLocale(locale, { ru: "Порядок маршрутизации", en: "Routing order" })}
          value="3 tiers"
          hint="Groq -> OpenRouter -> Mock"
          icon={<ArrowRight className="h-5 w-5" />}
        />
        <MetricCard
          label={pickLocale(locale, { ru: "Стриминг-пути", en: "Streaming paths" })}
          value={`${data.data.providers.filter((item) => item.supportsStreaming).length}`}
          hint={pickLocale(locale, { ru: "Доступны SSE-совместимые провайдеры.", en: "SSE-capable providers available." })}
          icon={<Waves className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{pickLocale(locale, { ru: "Политика fallback", en: "Fallback policy" })}</CardTitle>
          <CardDescription>
            {pickLocale(locale, {
              ru: "Fallback активируется только когда текущий upstream-путь не может корректно обслужить запрос.",
              en: "Fallback only activates when the current upstream path cannot serve the request cleanly."
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="accent">Groq</Badge>
          <ArrowRight className="h-4 w-4" />
          <Badge variant="accent">OpenRouter</Badge>
          <ArrowRight className="h-4 w-4" />
          <Badge variant="accent">Mock / Demo</Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        {data.data.providers.map((provider) => (
          <Card key={provider.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{provider.label}</CardTitle>
                  <CardDescription>
                    {locale === "ru"
                      ? provider.id === "groq"
                        ? "Основной low-latency путь для стратегии Auto."
                        : provider.id === "openrouter"
                          ? "Вторичный free-tier путь при ограничениях Groq."
                          : "Гарантированный demo-safe провайдер с псевдо-стримингом."
                      : provider.description}
                  </CardDescription>
                </div>
                <ProviderStatusPill status={provider.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    {pickLocale(locale, { ru: "Модель", en: "Model" })}
                  </div>
                  <div className="text-safe mt-2 text-sm text-foreground break-words">{provider.model}</div>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    {pickLocale(locale, { ru: "Задержка", en: "Latency" })}
                  </div>
                  <div className="mt-2 text-sm text-foreground">{formatDuration(provider.latencyMs)}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>
                  {provider.freeTierReady
                    ? pickLocale(locale, { ru: "готов к free-tier", en: "free-tier ready" })
                    : pickLocale(locale, { ru: "только платный", en: "paid only" })}
                </Badge>
                <Badge variant={provider.supportsStreaming ? "success" : "warning"}>
                  {provider.supportsStreaming
                    ? pickLocale(locale, { ru: "стриминг", en: "streaming" })
                    : pickLocale(locale, { ru: "без стриминга", en: "non-streaming" })}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
