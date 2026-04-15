"use client";

import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

const footerLinks = [
  { href: "/docs", label: { ru: "API Docs", en: "API Docs" } },
  { href: "/app/playground", label: { ru: "Playground", en: "Playground" } },
  { href: "/app/usage", label: { ru: "Usage", en: "Usage" } },
  { href: "/app/status", label: { ru: "Provider Status", en: "Provider Status" } }
];

export function SiteFooter() {
  const { locale } = useI18n();

  return (
    <footer className="border-t border-white/10 bg-transparent">
      <div className="shell-container py-12">
        <div className="mb-10 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(7,15,28,0.94),rgba(7,15,28,0.78))] p-8 shadow-panel sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <div className="eyebrow">
                {pickLocale(locale, {
                  ru: "Production-style demo",
                  en: "Production-style demo"
                })}
              </div>
              <h2 className="max-w-3xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {pickLocale(locale, {
                  ru: "Исследуйте маршрутизацию, стриминг и fallback в интерфейсе нового дизайна.",
                  en: "Explore routing, streaming and fallback through the rebuilt product surface."
                })}
              </h2>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                {pickLocale(locale, {
                  ru: "Все ключевые сценарии работают поверх реального Worker API: playground, provider status, logs, usage analytics и settings.",
                  en: "Core flows now sit on top of the real Worker API: playground, provider status, logs, usage analytics and settings."
                })}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/app/playground">
                  {pickLocale(locale, {
                    ru: "Открыть Playground",
                    en: "Open Playground"
                  })}
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/docs">
                  {pickLocale(locale, {
                    ru: "Открыть Docs",
                    en: "View Docs"
                  })}
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <BrandMark />
            <p className="text-safe max-w-md text-sm leading-6 text-muted-foreground">
              {pickLocale(locale, {
                ru: "Unified AI gateway на Next.js + Cloudflare Workers с безопасным хранением ключей только на стороне Worker.",
                en: "Unified AI gateway on Next.js + Cloudflare Workers with provider secrets kept on the Worker side only."
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
      </div>
    </footer>
  );
}
