"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/states/empty-state";
import { PageIntro } from "@/components/page-intro";
import { ProviderStatusPill } from "@/components/status-pill";
import { InlineError } from "@/components/states/inline-error";
import { PageSkeleton } from "@/components/states/page-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchLogs } from "@/lib/api";
import { formatDuration, formatTimestamp } from "@/lib/format";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

const filters = ["all", "success", "fallback", "error"] as const;

export default function LogsPage() {
  const { locale } = useI18n();
  const t = (ru: string, en: string) => pickLocale(locale, { ru, en });
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const { data, isLoading, refetch, isError } = useQuery({
    queryKey: ["logs"],
    queryFn: fetchLogs
  });

  const items = useMemo(() => {
    if (!data) {
      return [];
    }

    if (filter === "all") {
      return data.data.items;
    }

    return data.data.items.filter((item) => item.status === filter);
  }, [data, filter]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (isError || !data) {
    return (
      <InlineError
        title={t("Логи недоступны", "Logs unavailable")}
        description={t("Не удалось загрузить историю последних запросов.", "Recent request history could not be loaded.")}
        onRetry={() => void refetch()}
      />
    );
  }

  const filterLabel = (value: (typeof filters)[number]) =>
    value === "all"
      ? t("все", "all")
      : value === "success"
        ? t("успех", "success")
        : value === "fallback"
          ? "fallback"
          : t("ошибка", "error");

  return (
    <div className="min-w-0 space-y-8">
      <PageIntro
        eyebrow={t("Наблюдаемость", "Observability")}
        title={t("История запросов и поведение fallback", "Inspect request history and fallback behavior")}
        description={t(
          "Логи нормализуются в компактный gateway-view, где видно стратегию, провайдеров, latency и degraded mode без сырого upstream шума.",
          "Logs are normalized into a compact gateway view that surfaces strategy, providers, latency and degraded mode without raw upstream noise."
        )}
        actions={<Badge>{data.data.total} {t("запросов в истории", "captured requests")}</Badge>}
      />

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <Button key={item} variant={filter === item ? "default" : "secondary"} size="sm" onClick={() => setFilter(item)}>
            {filterLabel(item)}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("Текущий фильтр", "Current filter")}</CardTitle>
            <CardDescription>{t("Используйте фильтр, чтобы быстро посмотреть ошибки, fallback или успешные проходы.", "Use the filter to isolate errors, fallback events or successful passes.")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="accent">{filterLabel(filter)}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("Видимые записи", "Visible items")}</CardTitle>
            <CardDescription>{t("Количество строк после текущей фильтрации.", "Number of rows after current filtering.")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="font-display text-4xl font-semibold text-foreground">{items.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("Источник данных", "Data source")}</CardTitle>
            <CardDescription>{t("Worker API отдает компактную историю последних запросов.", "The Worker API returns a compact history of recent requests.")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge>GET /api/v1/logs</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
        <CardTitle>{t("Последняя активность", "Recent activity")}</CardTitle>
          <CardDescription>{t("Каждая строка показывает prompt preview, routing path, статус и продолжительность запроса.", "Each row shows prompt preview, routing path, status and request duration.")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 overflow-x-hidden">
          {items.length ? (
            items.map((item) => (
              <div
                key={item.id}
                className="grid gap-4 rounded-[1.5rem] border border-border/70 bg-[hsl(var(--panel)/0.72)] p-4 dark:border-white/10 dark:bg-white/[0.05] lg:grid-cols-[1.1fr_0.5fr_0.45fr_0.45fr_0.4fr]"
              >
                <div className="min-w-0 space-y-2">
                  <div className="text-safe text-sm font-medium text-foreground">{item.promptPreview}</div>
                  <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{formatTimestamp(item.timestamp)}</div>
                </div>
                <div className="min-w-0 space-y-2">
                  <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Маршрут", "Routing")}</div>
                  <div className="text-safe text-sm text-foreground break-words">
                    {item.attemptedProvider} {"->"} {item.finalProvider}
                  </div>
                </div>
                <div className="min-w-0 space-y-2">
                  <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Статус", "Status")}</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={item.fallbackActivated ? "warning" : item.status === "error" ? "danger" : "success"}>
                      {item.status}
                    </Badge>
                    <ProviderStatusPill status={item.degradedMode ? "degraded" : "live"} />
                  </div>
                </div>
                <div className="min-w-0 space-y-2">
                  <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Длительность", "Duration")}</div>
                  <div className="text-sm text-foreground">{formatDuration(item.durationMs)}</div>
                </div>
                <div className="min-w-0 space-y-2">
                  <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t("Стратегия", "Strategy")}</div>
                  <div className="text-safe text-sm text-foreground break-words">{item.strategy}</div>
                  {item.errorCode ? <Badge variant="danger">{item.errorCode}</Badge> : null}
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title={t("Для этого фильтра логов нет", "No logs for this filter")}
              description={t("Смените фильтр или запустите новый запрос в playground, чтобы создать свежие записи.", "Change the filter or run a new playground request to generate fresh log entries.")}
              action={
                <Button asChild>
                  <Link href="/app/playground">{t("Открыть песочницу", "Open playground")}</Link>
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
