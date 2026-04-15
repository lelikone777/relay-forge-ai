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
        eyebrow={t("Состояние провайдеров", "Provider Health")}
        title={t("Готовность каждого уровня цепочки", "Observe readiness across every provider tier")}
        description={t(
          "Страница показывает реальный health snapshot цепочки Groq -> SambaNova -> OpenRouter -> Mock, а не декоративный список без связи с backend.",
          "This page shows the real health snapshot for the Groq -> SambaNova -> OpenRouter -> Mock chain instead of a decorative list disconnected from the backend."
        )}
        actions={<ModePill mode={data.data.mode} />}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard
          label={t("Активные провайдеры", "Providers live")}
          value={`${data.data.providers.filter((item) => item.available).length}`}
          hint={t("Адаптеры отвечают на health check.", "Adapters responding to health checks.")}
          icon={<ShieldCheck className="h-5 w-5" />}
        />
        <MetricCard
          label={t("Порядок маршрутизации", "Routing order")}
          value={`${data.data.routingOrder.length} tiers`}
          hint="Groq -> SambaNova -> Cerebras -> Gemini -> OpenRouter -> Mock"
          icon={<ArrowRight className="h-5 w-5" />}
        />
        <MetricCard
          label={t("Потоковые пути", "Streaming paths")}
          value={`${data.data.providers.filter((item) => item.supportsStreaming).length}`}
          hint={t("Доступны провайдеры с SSE.", "SSE-capable providers available.")}
          icon={<Waves className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("Политика fallback", "Fallback policy")}</CardTitle>
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
              <Badge>SambaNova</Badge>
              <ArrowRight className="h-4 w-4" />
              <Badge>Cerebras</Badge>
              <ArrowRight className="h-4 w-4" />
              <Badge>Gemini</Badge>
              <ArrowRight className="h-4 w-4" />
              <Badge variant="warning">OpenRouter</Badge>
              <ArrowRight className="h-4 w-4" />
              <Badge variant="success">Mock / Demo</Badge>
            </div>
            <div className="panel-subtle p-5">
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>{t("Основной путь: низколатентный Groq в режиме auto.", "Primary path: low-latency Groq in auto mode.")}</div>
                <div>{t("Второй tier: SambaNova берет запрос, если Groq упирается в лимиты, таймауты или некорректный ответ апстрима.", "Second tier: SambaNova takes over when Groq hits limits, timeouts or malformed upstream output.")}</div>
                <div>{t("Третий tier: Cerebras добавляет быстрый inference path, если верхние уровни не могут обслужить запрос.", "Third tier: Cerebras adds a fast inference path if the earlier tiers cannot serve the request.")}</div>
                <div>{t("Четвертый tier: Gemini остается управляемым fallback-путем перед OpenRouter.", "Fourth tier: Gemini remains a managed fallback path before OpenRouter.")}</div>
                <div>{t("Пятый tier: OpenRouter закрывает остаточный free-tier fallback перед переходом в mock.", "Fifth tier: OpenRouter handles the last free-tier fallback before mock mode.")}</div>
                <div>{t("Страховка: mock сохраняет публичный workspace рабочим даже при ограничениях реальных провайдеров.", "Safety net: mock keeps the public workspace usable even if real providers are constrained.")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>{t("Снимок маршрутизации", "Routing snapshot")}</CardTitle>
            <CardDescription>{t("Текущий режим и порядок маршрутизации из Worker status endpoint.", "Current mode and routing order from the Worker status endpoint.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="panel-inset p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm font-medium text-foreground">{t("Режим системы", "System mode")}</div>
                <ModePill mode={data.data.mode} />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {data.data.routingOrder.map((provider, index) => (
                  <div key={provider} className="flex items-center gap-3">
                    <Badge variant={index === 0 ? "accent" : index === data.data.routingOrder.length - 1 ? "success" : index === 2 ? "warning" : "default"}>
                      {provider}
                    </Badge>
                    {index < data.data.routingOrder.length - 1 ? <ArrowRight className="h-4 w-4 text-muted-foreground" /> : null}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {data.data.providers.map((provider) => (
                <div key={provider.id} className="panel-subtle p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-foreground">{provider.label}</div>
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

      <div className="grid gap-4 xl:grid-cols-4">
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
                <div className="panel-subtle p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Модель", "Model")}</div>
                  <div className="text-safe mt-2 text-sm text-foreground break-words">{provider.model}</div>
                </div>
                <div className="panel-subtle p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Задержка", "Latency")}</div>
                  <div className="mt-2 text-sm text-foreground">{formatDuration(provider.latencyMs)}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>{provider.freeTierReady ? t("готов к free tier", "free-tier ready") : t("только платный путь", "paid only")}</Badge>
                <Badge variant={provider.supportsStreaming ? "success" : "warning"}>
                  {provider.supportsStreaming ? t("стриминг", "streaming") : t("без стриминга", "non-streaming")}
                </Badge>
                <Badge variant={provider.available ? "accent" : "danger"}>
                  {provider.available ? t("доступен", "available") : t("недоступен", "unavailable")}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
