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

export default function StatusPage() {
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
        title="Status unavailable"
        description="Provider health could not be loaded."
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Provider Health"
        title="Observe routing readiness across every provider tier"
        description="Status cards expose which provider is primary, which tier is constrained and why RelayForge can still serve requests under free-tier conditions."
        actions={<ModePill mode={data.data.mode} />}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard
          label="Providers live"
          value={`${data.data.providers.filter((item) => item.available).length}`}
          hint="Adapters responding to health checks."
          icon={<ShieldCheck className="h-5 w-5" />}
        />
        <MetricCard
          label="Routing order"
          value="3 tiers"
          hint="Groq -> OpenRouter -> Mock"
          icon={<ArrowRight className="h-5 w-5" />}
        />
        <MetricCard
          label="Streaming paths"
          value={`${data.data.providers.filter((item) => item.supportsStreaming).length}`}
          hint="SSE-capable providers available."
          icon={<Waves className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fallback policy</CardTitle>
          <CardDescription>Fallback only activates when the current upstream path cannot serve the request cleanly.</CardDescription>
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
                  <CardDescription>{provider.description}</CardDescription>
                </div>
                <ProviderStatusPill status={provider.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Model</div>
                  <div className="mt-2 text-sm text-foreground">{provider.model}</div>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Latency</div>
                  <div className="mt-2 text-sm text-foreground">{formatDuration(provider.latencyMs)}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>{provider.freeTierReady ? "free-tier ready" : "paid only"}</Badge>
                <Badge variant={provider.supportsStreaming ? "success" : "warning"}>
                  {provider.supportsStreaming ? "streaming" : "non-streaming"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

