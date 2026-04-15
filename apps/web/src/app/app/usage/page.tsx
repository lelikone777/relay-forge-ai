"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, ArrowRightLeft, Clock3, Waves } from "lucide-react";

import { ProviderDistributionChart } from "@/components/charts/provider-distribution-chart";
import { UsageLatencyChart } from "@/components/charts/usage-latency-chart";
import { MetricCard } from "@/components/metric-card";
import { PageIntro } from "@/components/page-intro";
import { ModePill } from "@/components/status-pill";
import { InlineError } from "@/components/states/inline-error";
import { PageSkeleton } from "@/components/states/page-skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUsage } from "@/lib/api";
import { formatDuration, formatNumber } from "@/lib/format";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

export default function UsagePage() {
  const { locale } = useI18n();
  const t = (ru: string, en: string) => pickLocale(locale, { ru, en });
  const { data, isLoading, refetch, isError } = useQuery({
    queryKey: ["usage"],
    queryFn: fetchUsage
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (isError || !data) {
    return (
      <InlineError
        title={t("Статистика недоступна", "Usage unavailable")}
        description={t("Не удалось загрузить аналитику из gateway.", "Analytics could not be loaded from the gateway.")}
        onRetry={() => void refetch()}
      />
    );
  }

  const successRate =
    data.data.totals.requests > 0 ? Math.round((data.data.totals.successful / data.data.totals.requests) * 100) : 0;

  return (
    <div className="min-w-0 space-y-8">
      <PageIntro
        eyebrow={t("Аналитика", "Analytics")}
        title={t("Объем, задержка и распределение провайдеров", "Track volume, latency and provider distribution")}
        description={t(
          "Экран аналитики использует живые usage contracts и показывает реальное распределение финального провайдера после fallback.",
          "The analytics screen uses live usage contracts and shows the real final-provider distribution after fallback."
        )}
        actions={<ModePill mode={data.data.mode} />}
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <MetricCard label={t("Всего запросов", "Total requests")} value={formatNumber(data.data.totals.requests)} hint={t("Трафик, прошедший через Worker.", "Traffic handled by the Worker.")} icon={<Activity className="h-5 w-5" />} />
        <MetricCard label={t("Успешные", "Successful")} value={formatNumber(data.data.totals.successful)} hint={t("Запросы завершились без UI-сбоя.", "Requests completed without UI failure.")} icon={<Waves className="h-5 w-5" />} />
        <MetricCard label={t("Fallback-срабатывания", "Fallbacks")} value={formatNumber(data.data.totals.fallbackActivations)} hint={t("Переключения провайдера оркестратором.", "Provider promotions triggered by orchestration.")} icon={<ArrowRightLeft className="h-5 w-5" />} />
        <MetricCard label={t("Средняя задержка", "Avg latency")} value={formatDuration(data.data.totals.avgLatencyMs)} hint={t("По всем завершенным запросам.", "Across all completed requests.")} icon={<Clock3 className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("Запросы и задержка", "Requests and latency")}</CardTitle>
            <CardDescription>{t("Объем, fallback и latency drift во времени.", "Volume, fallback activity and latency drift over time.")}</CardDescription>
          </CardHeader>
          <CardContent>
            <UsageLatencyChart data={data.data.timeseries} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("Доля провайдеров", "Provider share")}</CardTitle>
            <CardDescription>{t("Финальное распределение провайдеров после fallback.", "Final provider distribution after fallback.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProviderDistributionChart data={data.data.providerDistribution} />
            <div className="grid gap-2">
              {data.data.providerDistribution.map((entry) => (
                <div key={entry.provider} className="panel-subtle flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <span className="text-safe break-words uppercase tracking-[0.18em] text-muted-foreground">{entry.provider}</span>
                  <span className="font-medium text-foreground">{formatNumber(entry.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("Успешность", "Success rate")}</CardTitle>
            <CardDescription>{t("Соотношение успешных запросов к общему объему.", "Ratio of successful requests to total volume.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="font-display text-4xl font-semibold text-foreground">{successRate}%</div>
            <div className="h-2 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/5">
              <div className="h-full rounded-full bg-[linear-gradient(90deg,rgba(16,185,129,1),rgba(34,211,238,1))]" style={{ width: `${successRate}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("Неуспешные запросы", "Failed requests")}</CardTitle>
            <CardDescription>{t("Ошибки остаются отдельной метрикой и не маскируются fallback успехом.", "Failures remain visible and are not hidden by fallback success.")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="font-display text-4xl font-semibold text-foreground">{formatNumber(data.data.totals.failed)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("Источник данных", "Data source")}</CardTitle>
            <CardDescription>{t("Usage metrics приходят из Worker usage endpoint.", "Usage metrics come from the Worker usage endpoint.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge variant="accent">GET /api/v1/usage</Badge>
            <div className="text-sm text-muted-foreground">
              {t("Логи и usage in-memory в текущей сборке, поэтому дашборд показывает реальное состояние без обещаний durable storage.", "Logs and usage are in-memory in the current build, so the dashboard shows the real state without promising durable storage.")}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
