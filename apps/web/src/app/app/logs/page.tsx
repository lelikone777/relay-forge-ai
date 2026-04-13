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

const filters = ["all", "success", "fallback", "error"] as const;

export default function LogsPage() {
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
        title="Logs unavailable"
        description="Recent request history could not be loaded."
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Observability"
        title="Inspect request history and fallback behavior"
        description="Logs are normalized into a compact gateway view so reliability decisions remain understandable without raw upstream noise."
        actions={<Badge>{data.data.total} captured requests</Badge>}
      />

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <Button key={item} variant={filter === item ? "default" : "secondary"} size="sm" onClick={() => setFilter(item)}>
            {item}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Compact observability view with strategy, latency and fallback metadata.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="grid gap-4 rounded-2xl border border-border/70 bg-background/60 p-4 lg:grid-cols-[1.1fr_0.5fr_0.45fr_0.45fr_0.4fr]"
            >
              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground">{item.promptPreview}</div>
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{formatTimestamp(item.timestamp)}</div>
              </div>
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Routing</div>
                <div className="text-sm text-foreground">
                  {item.attemptedProvider} {"->"} {item.finalProvider}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Status</div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.fallbackActivated ? "warning" : "success"}>{item.status}</Badge>
                  <ProviderStatusPill status={item.degradedMode ? "degraded" : "live"} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Duration</div>
                <div className="text-sm text-foreground">{formatDuration(item.durationMs)}</div>
              </div>
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Strategy</div>
                <div className="text-sm text-foreground">{item.strategy}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
