"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

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
        title={pickLocale(locale, { ru: "Логи недоступны", en: "Logs unavailable" })}
        description={pickLocale(locale, {
          ru: "Не удалось загрузить историю последних запросов.",
          en: "Recent request history could not be loaded."
        })}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="min-w-0 space-y-8">
      <PageIntro
        eyebrow={pickLocale(locale, { ru: "Наблюдаемость", en: "Observability" })}
        title={pickLocale(locale, {
          ru: "Проверяйте историю запросов и поведение fallback",
          en: "Inspect request history and fallback behavior"
        })}
        description={pickLocale(locale, {
          ru: "Логи нормализуются в компактный gateway-вид, чтобы решения по надежности были понятны без сырого шума апстрима.",
          en: "Logs are normalized into a compact gateway view so reliability decisions remain understandable without raw upstream noise."
        })}
        actions={
          <Badge>
            {data.data.total} {pickLocale(locale, { ru: "запросов записано", en: "captured requests" })}
          </Badge>
        }
      />

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <Button key={item} variant={filter === item ? "default" : "secondary"} size="sm" onClick={() => setFilter(item)}>
            {pickLocale(locale, {
              ru: item === "all" ? "все" : item === "success" ? "успех" : item === "fallback" ? "fallback" : "ошибка",
              en: item
            })}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{pickLocale(locale, { ru: "Последняя активность", en: "Recent activity" })}</CardTitle>
          <CardDescription>
            {pickLocale(locale, {
              ru: "Компактный observability-вид со стратегией, задержкой и fallback-метаданными.",
              en: "Compact observability view with strategy, latency and fallback metadata."
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 overflow-x-hidden">
          {items.map((item) => (
            <div
              key={item.id}
              className="grid gap-4 rounded-2xl border border-border/70 bg-background/60 p-4 lg:grid-cols-[1.1fr_0.5fr_0.45fr_0.45fr_0.4fr]"
            >
              <div className="min-w-0 space-y-2">
                <div className="text-safe text-sm font-medium text-foreground">{item.promptPreview}</div>
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{formatTimestamp(item.timestamp)}</div>
              </div>
              <div className="min-w-0 space-y-2">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {pickLocale(locale, { ru: "Маршрутизация", en: "Routing" })}
                </div>
                <div className="text-safe text-sm text-foreground break-words">
                  {item.attemptedProvider} {"->"} {item.finalProvider}
                </div>
              </div>
              <div className="min-w-0 space-y-2">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {pickLocale(locale, { ru: "Статус", en: "Status" })}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.fallbackActivated ? "warning" : "success"}>
                    {pickLocale(locale, {
                      ru:
                        item.status === "success"
                          ? "успех"
                          : item.status === "fallback"
                            ? "fallback"
                            : item.status === "streaming"
                              ? "стриминг"
                              : "ошибка",
                      en: item.status
                    })}
                  </Badge>
                  <ProviderStatusPill status={item.degradedMode ? "degraded" : "live"} />
                </div>
              </div>
              <div className="min-w-0 space-y-2">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {pickLocale(locale, { ru: "Длительность", en: "Duration" })}
                </div>
                <div className="text-sm text-foreground">{formatDuration(item.durationMs)}</div>
              </div>
              <div className="min-w-0 space-y-2">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {pickLocale(locale, { ru: "Стратегия", en: "Strategy" })}
                </div>
                <div className="text-safe text-sm text-foreground break-words">{item.strategy}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
