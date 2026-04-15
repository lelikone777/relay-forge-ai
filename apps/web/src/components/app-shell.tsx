"use client";

import { Activity, BookOpen, Boxes, ChartColumnBig, Cog, PlaySquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

import { BrandMark } from "@/components/brand-mark";
import { LanguageToggle } from "@/components/language-toggle";
import { ModePill } from "@/components/status-pill";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchProviderStatus } from "@/lib/api";
import { appConfig } from "@/lib/config";
import { pickLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";

const navItems = [
  { href: "/app/playground", label: { ru: "Песочница", en: "Playground" }, icon: PlaySquare },
  { href: "/app/status", label: { ru: "Статус провайдеров", en: "Provider Status" }, icon: Activity },
  { href: "/app/logs", label: { ru: "Логи", en: "Logs" }, icon: Boxes },
  { href: "/app/usage", label: { ru: "Использование", en: "Usage" }, icon: ChartColumnBig },
  { href: "/app/settings", label: { ru: "Настройки", en: "Settings" }, icon: Cog },
  { href: "/docs", label: { ru: "Документация", en: "Docs" }, icon: BookOpen }
];

export function AppShell({ children }: PropsWithChildren) {
  const { locale } = useI18n();
  const pathname = usePathname();
  const { data } = useQuery({
    queryKey: ["provider-status"],
    queryFn: fetchProviderStatus
  });

  const mode = data?.data.mode ?? "demo";

  return (
    <div className="shell-container grid min-w-0 gap-6 py-6 lg:grid-cols-[290px_minmax(0,1fr)]">
      <aside className="min-w-0 space-y-4">
        <Card className="overflow-hidden p-4 lg:sticky lg:top-6">
          <div className="space-y-6">
            <BrandMark />
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {pickLocale(locale, { ru: "Workspace", en: "Workspace" })}
              </div>
              <div className="mt-2 font-display text-lg font-semibold text-white">
                {pickLocale(locale, { ru: "Public Sandbox", en: appConfig.workspace })}
              </div>
              <div className="mt-2 text-safe text-sm text-muted-foreground">
                {pickLocale(locale, { ru: "Cloudflare Pages + Workers", en: appConfig.environment })}
              </div>
            </div>
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex min-w-0 items-center justify-between rounded-2xl border px-4 py-3 text-sm transition",
                      active
                        ? "border-accent/25 bg-accent/10 text-white shadow-glow"
                        : "border-transparent text-muted-foreground hover:border-white/10 hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span className="text-safe">{pickLocale(locale, item.label)}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {pickLocale(locale, { ru: "Mode", en: "Mode" })}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <ModePill mode={mode} />
                <span className="text-sm text-muted-foreground">
                  {pickLocale(locale, {
                    ru: "Fallback chain active",
                    en: "Fallback chain active"
                  })}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </aside>
      <div className="min-w-0 space-y-6">
        <Card className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {pickLocale(locale, { ru: "System mode", en: "System mode" })}
              </div>
              <div className="mt-2 flex items-center gap-3">
                <ModePill mode={mode} />
                <span className="text-safe text-sm text-muted-foreground">
                  {pickLocale(locale, {
                    ru: "Free-tier routing with automatic fallback and demo-safe reliability.",
                    en: "Free-tier routing with automatic fallback and demo-safe reliability."
                  })}
                </span>
              </div>
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 sm:gap-3 md:w-auto md:justify-end">
              <LanguageToggle />
              <ThemeToggle />
              <Button asChild variant="secondary" className="w-full min-[420px]:w-auto">
                <Link href="/">{pickLocale(locale, { ru: "Маркетинговый сайт", en: "Marketing Site" })}</Link>
              </Button>
            </div>
          </div>
        </Card>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
