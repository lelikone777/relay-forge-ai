"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Gauge, LoaderCircle, RotateCcw, Send, Sparkles, Square } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { StrategyId } from "@relayforge/shared";

import { PageIntro } from "@/components/page-intro";
import { ModePill, ProviderStatusPill } from "@/components/status-pill";
import { EmptyState } from "@/components/states/empty-state";
import { InlineError } from "@/components/states/inline-error";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { usePlayground } from "@/hooks/use-playground";
import { fetchProviderStatus } from "@/lib/api";
import { formatDuration, formatTimestamp } from "@/lib/format";
import { useSettings } from "@/providers/settings-provider";

const strategies: StrategyId[] = ["auto", "groq", "openrouter", "mock"];

export default function PlaygroundPage() {
  const { data: statusData } = useQuery({
    queryKey: ["provider-status"],
    queryFn: fetchProviderStatus
  });
  const { defaultStrategy, streamingEnabled } = useSettings();
  const [prompt, setPrompt] = useState(
    "Design a concise rollout note for an AI gateway that automatically falls back from Groq Free to OpenRouter and finally to a mock provider."
  );
  const [strategy, setStrategy] = useState<StrategyId>(defaultStrategy);
  const { responseText, responseMeta, error, isStreaming, requestStartedAt, submit, stop, retry, clear } =
    usePlayground();

  const responseBadges = useMemo(() => {
    if (!responseMeta) {
      return [];
    }

    return [
      { label: responseMeta.finalProvider, tone: "accent" as const },
      { label: responseMeta.model, tone: "default" as const },
      { label: responseMeta.fallbackActivated ? "fallback activated" : "direct hit", tone: "warning" as const },
      {
        label: responseMeta.demoMode ? "demo mode" : responseMeta.degradedMode ? "degraded mode" : "normal",
        tone: "success" as const
      }
    ];
  }, [responseMeta]);

  useEffect(() => {
    setStrategy(defaultStrategy);
  }, [defaultStrategy]);

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Core Experience"
        title="Run prompts through a resilient AI gateway"
        description="RelayForge streams responses progressively, surfaces provider metadata and preserves a clean UX when upstream providers degrade."
        actions={
          <>
            <Badge variant="accent">POST /api/v1/stream</Badge>
            <Badge>{streamingEnabled ? "streaming on" : "streaming off"}</Badge>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Prompt composer</CardTitle>
                <CardDescription>One API surface. Strategy-aware provider routing.</CardDescription>
              </div>
              <Badge variant="accent">{strategy}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {strategies.map((item) => (
                <Button
                  key={item}
                  variant={strategy === item ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setStrategy(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
            <Textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Describe the response you want routed through RelayForge."
            />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Mode</div>
                <div className="mt-2 flex items-center gap-2">
                  <ModePill mode={statusData?.data.mode ?? "demo"} />
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Streaming</div>
                <div className="mt-2 text-sm text-foreground">
                  {streamingEnabled ? "Enabled by default" : "Disabled by preference"}
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Fallback order</div>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  Groq <ArrowRight className="h-3 w-3" /> OpenRouter <ArrowRight className="h-3 w-3" /> Mock
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Public demo</div>
                <div className="mt-2 text-sm text-foreground">Always testable via mock fallback.</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => void submit({ prompt, strategy, streamingEnabled })}
                disabled={isStreaming || prompt.trim().length === 0}
              >
                {isStreaming ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send request
              </Button>
              <Button onClick={() => void (isStreaming ? stop() : retry())} variant="secondary">
                {isStreaming ? <Square className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                {isStreaming ? "Stop stream" : "Retry"}
              </Button>
              <Button onClick={clear} variant="ghost">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="min-h-[27rem] overflow-hidden">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>Streaming response</CardTitle>
                  <CardDescription>Progressive rendering with normalized metadata.</CardDescription>
                </div>
                {isStreaming ? <Badge variant="accent">live stream</Badge> : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {responseText ? (
                <div className="rounded-2xl border border-border/70 bg-background/70 p-5 font-mono text-sm leading-7 text-foreground">
                  {responseText}
                  {isStreaming ? <span className="animate-blink">|</span> : null}
                </div>
              ) : (
                <EmptyState
                  title="No response yet"
                  description="Run a prompt to inspect streaming tokens, fallback metadata and latency without leaving the current layout."
                />
              )}

              {responseBadges.length ? (
                <div className="flex flex-wrap gap-2">
                  {responseBadges.map((item) => (
                    <Badge key={item.label} variant={item.tone}>
                      {item.label}
                    </Badge>
                  ))}
                </div>
              ) : null}

              {error ? (
                <InlineError
                  title={error.code.replaceAll("_", " ")}
                  description={error.message}
                  onRetry={() => {
                    void retry();
                  }}
                />
              ) : null}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Request metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between gap-4">
                  <span>Selected strategy</span>
                  <span className="text-foreground">{strategy}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Started at</span>
                  <span className="text-foreground">{requestStartedAt ? formatTimestamp(requestStartedAt) : "Idle"}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Transport</span>
                  <span className="text-foreground">{streamingEnabled ? "text/event-stream" : "json"}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Response metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between gap-4">
                  <span>Attempted provider</span>
                  <span className="text-foreground">{responseMeta?.attemptedProvider ?? "Pending"}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Final provider</span>
                  <span className="text-foreground">{responseMeta?.finalProvider ?? "Pending"}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Latency</span>
                  <span className="text-foreground">
                    {responseMeta ? formatDuration(responseMeta.latencyMs) : "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Fallback</span>
                  <span className="text-foreground">{responseMeta?.fallbackActivated ? "Activated" : "No"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Provider rail</CardTitle>
          <CardDescription>Current health snapshot from the Worker status endpoint.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          {statusData?.data.providers.map((provider) => (
            <div key={provider.id} className="rounded-2xl border border-border/70 bg-background/60 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="font-display text-lg font-semibold">{provider.label}</div>
                  <div className="text-sm text-muted-foreground">{provider.description}</div>
                </div>
                <ProviderStatusPill status={provider.status} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge>{provider.model}</Badge>
                <Badge variant="accent">
                  <Gauge className="h-3 w-3" />
                  {formatDuration(provider.latencyMs)}
                </Badge>
                {provider.supportsStreaming ? (
                  <Badge variant="success">
                    <Sparkles className="h-3 w-3" />
                    streaming
                  </Badge>
                ) : null}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
