"use client";

import { useTheme } from "next-themes";

import { PageIntro } from "@/components/page-intro";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { appConfig } from "@/lib/config";
import { useSettings } from "@/providers/settings-provider";

const strategies = ["auto", "groq", "openrouter", "mock"] as const;

export default function SettingsPage() {
  const { resolvedTheme } = useTheme();
  const {
    defaultStrategy,
    streamingEnabled,
    subtleDemoHints,
    setDefaultStrategy,
    setStreamingEnabled,
    setSubtleDemoHints
  } = useSettings();

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Workspace Settings"
        title="Tune default routing and explain demo behavior"
        description="Settings stay intentionally lightweight to preserve public reliability: one workspace, predictable defaults and no auth complexity."
      />

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Default strategy</CardTitle>
            <CardDescription>Controls the initial routing mode for the playground composer.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {strategies.map((strategy) => (
                <Button
                  key={strategy}
                  variant={defaultStrategy === strategy ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setDefaultStrategy(strategy)}
                >
                  {strategy}
                </Button>
              ))}
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
              <div className="font-medium text-foreground">Auto remains the recommended mode.</div>
              <div className="mt-2">
                It preserves the gateway story by preferring Groq Free, then OpenRouter, then the demo-safe mock
                provider.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Runtime preferences</CardTitle>
            <CardDescription>Client-side defaults only. Secrets remain on the Worker.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 p-4">
              <div>
                <div className="font-medium text-foreground">Streaming preference</div>
                <div className="text-sm text-muted-foreground">Use `POST /api/v1/stream` by default in the playground.</div>
              </div>
              <Switch checked={streamingEnabled} onCheckedChange={setStreamingEnabled} />
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 p-4">
              <div>
                <div className="font-medium text-foreground">Subtle demo hints</div>
                <div className="text-sm text-muted-foreground">Keep demo-mode indicators visible but low-noise.</div>
              </div>
              <Switch checked={subtleDemoHints} onCheckedChange={setSubtleDemoHints} />
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 p-4">
              <div>
                <div className="font-medium text-foreground">Theme</div>
                <div className="text-sm text-muted-foreground">Current theme: {resolvedTheme ?? "loading"}</div>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Frontend target</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="font-medium text-foreground">{appConfig.environment}</div>
            <div>Static Next.js export optimized for Cloudflare Pages.</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>API base URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="font-mono text-xs text-foreground">{appConfig.apiBaseUrl}</div>
            <div>Injected at build time through `NEXT_PUBLIC_API_BASE_URL`.</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Demo architecture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <Badge variant="accent">No auth wall</Badge>
            <div>Single shared workspace keeps the public demo reliable under free-tier constraints.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
