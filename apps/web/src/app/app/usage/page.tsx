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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUsage } from "@/lib/api";
import { formatDuration, formatNumber } from "@/lib/format";

export default function UsagePage() {
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
        title="Usage unavailable"
        description="Analytics could not be loaded from the gateway."
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Analytics"
        title="Track volume, latency and provider distribution"
        description="Usage views are structured like a lightweight observability product: enough telemetry to explain architecture and fallback impact at a glance."
        actions={<ModePill mode={data.data.mode} />}
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <MetricCard
          label="Total requests"
          value={formatNumber(data.data.totals.requests)}
          hint="Traffic handled by the Worker."
          icon={<Activity className="h-5 w-5" />}
        />
        <MetricCard
          label="Successful"
          value={formatNumber(data.data.totals.successful)}
          hint="Requests completed without UI failure."
          icon={<Waves className="h-5 w-5" />}
        />
        <MetricCard
          label="Fallbacks"
          value={formatNumber(data.data.totals.fallbackActivations)}
          hint="Provider promotions triggered by orchestration."
          icon={<ArrowRightLeft className="h-5 w-5" />}
        />
        <MetricCard
          label="Avg latency"
          value={formatDuration(data.data.totals.avgLatencyMs)}
          hint="Across all completed requests."
          icon={<Clock3 className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle>Requests and latency</CardTitle>
            <CardDescription>Volume alongside latency drift over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <UsageLatencyChart data={data.data.timeseries} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Provider share</CardTitle>
            <CardDescription>Final provider distribution after fallback.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProviderDistributionChart data={data.data.providerDistribution} />
            <div className="grid gap-2">
              {data.data.providerDistribution.map((entry) => (
                <div key={entry.provider} className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm">
                  <span>{entry.provider}</span>
                  <span className="font-medium">{formatNumber(entry.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

