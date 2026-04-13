"use client";

import { Activity, BookOpen, Boxes, ChartColumnBig, Cog, PlaySquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

import { BrandMark } from "@/components/brand-mark";
import { ModePill } from "@/components/status-pill";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchProviderStatus } from "@/lib/api";
import { appConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/app/playground", label: "Playground", icon: PlaySquare },
  { href: "/app/status", label: "Provider Status", icon: Activity },
  { href: "/app/logs", label: "Logs", icon: Boxes },
  { href: "/app/usage", label: "Usage", icon: ChartColumnBig },
  { href: "/app/settings", label: "Settings", icon: Cog },
  { href: "/docs", label: "Docs", icon: BookOpen }
];

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { data } = useQuery({
    queryKey: ["provider-status"],
    queryFn: fetchProviderStatus
  });

  const mode = data?.data.mode ?? "demo";

  return (
    <div className="shell-container grid gap-6 py-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <Card className="sticky top-6 overflow-hidden p-4">
          <div className="space-y-6">
            <BrandMark />
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition",
                      active
                        ? "border-accent/30 bg-accent/12 text-foreground shadow-glow"
                        : "border-transparent text-muted-foreground hover:border-border/60 hover:bg-background/60 hover:text-foreground"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Workspace</div>
              <div className="mt-2 font-display text-lg font-semibold">{appConfig.workspace}</div>
              <div className="mt-2 text-sm text-muted-foreground">{appConfig.environment}</div>
            </div>
          </div>
        </Card>
      </aside>
      <div className="space-y-6">
        <Card className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">System mode</div>
              <div className="mt-2 flex items-center gap-3">
                <ModePill mode={mode} />
                <span className="text-sm text-muted-foreground">
                  Free-tier routing with automatic fallback and demo-safe reliability.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button asChild variant="secondary">
                <Link href="/">Marketing Site</Link>
              </Button>
            </div>
          </div>
        </Card>
        <main>{children}</main>
      </div>
    </div>
  );
}
