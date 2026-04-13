"use client";

import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

const footerLinks = [
  { href: "/docs", label: { ru: "API Документация", en: "API Docs" } },
  { href: "/app/playground", label: { ru: "Песочница", en: "Playground" } },
  { href: "/app/usage", label: { ru: "Использование", en: "Usage" } },
  { href: "/app/status", label: { ru: "Статус провайдеров", en: "Provider Status" } }
];

export function SiteFooter() {
  const { locale } = useI18n();

  return (
    <footer className="border-t border-border/60 bg-background/70">
      <div className="shell-container flex flex-col gap-8 py-10 md:flex-row md:items-end md:justify-between">
        <div className="space-y-4">
          <BrandMark />
          <p className="text-safe max-w-md text-sm leading-6 text-muted-foreground">
            {pickLocale(locale, {
              ru: "AI gateway playground с приоритетом free-tier: стриминг, fallback-маршрутизация и demo-safe надежность для публичного деплоя.",
              en: "Free-tier-first AI gateway playground with streaming, fallback routing and demo-safe reliability for public deployment."
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {footerLinks.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-foreground">
              {pickLocale(locale, item.label)}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
