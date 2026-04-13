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
                      {pickLocale(locale, item.label)}
                    </span>
                  </Link>
                );
              })}
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {pickLocale(locale, { ru: "Рабочая область", en: "Workspace" })}
              </div>
              <div className="mt-2 font-display text-lg font-semibold">
                {pickLocale(locale, { ru: "Публичный Sandbox", en: appConfig.workspace })}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {pickLocale(locale, {
                  ru: "Cloudflare Pages + Workers",
                  en: appConfig.environment
                })}
              </div>
            </div>
          </div>
        </Card>
      </aside>
      <div className="space-y-6">
        <Card className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {pickLocale(locale, { ru: "Режим системы", en: "System mode" })}
              </div>
              <div className="mt-2 flex items-center gap-3">
                <ModePill mode={mode} />
                <span className="text-sm text-muted-foreground">
                  {pickLocale(locale, {
                    ru: "Free-tier маршрутизация с автоматическим fallback и demo-safe надежностью.",
                    en: "Free-tier routing with automatic fallback and demo-safe reliability."
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <ThemeToggle />
              <Button asChild variant="secondary">
                <Link href="/">{pickLocale(locale, { ru: "Маркетинговый сайт", en: "Marketing Site" })}</Link>
              </Button>
            </div>
          </div>
        </Card>
        <main>{children}</main>
      </div>
    </div>
  );
}
