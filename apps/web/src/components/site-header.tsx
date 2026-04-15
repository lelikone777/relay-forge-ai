"use client";

import Link from "next/link";

import { HeaderActionButton } from "@/components/header-action-button";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandMark } from "@/components/brand-mark";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

const items = [
  { href: "/#features", label: { ru: "Возможности", en: "Features" } },
  { href: "/#architecture", label: { ru: "Архитектура", en: "Architecture" } },
  { href: "/docs", label: { ru: "Документация", en: "Docs" } },
  { href: "/app/status", label: { ru: "Статус", en: "Status" } }
];

export function SiteHeader() {
  const { locale } = useI18n();

  return (
    <nav className="sticky top-0 z-50 border-b border-border/70 bg-[hsl(var(--background)/0.72)] backdrop-blur-xl dark:border-white/10 dark:bg-black/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-8">
          <Link href="/" className="min-w-0 shrink-0">
            <BrandMark compactOnMobile />
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {items.map((item) => (
              <Link key={item.href} href={item.href} className="topbar-link">
                {pickLocale(locale, item.label)}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <HeaderActionButton asChild variant="primary">
            <Link href="/app/playground">{pickLocale(locale, { ru: "Начать", en: "Get Started" })}</Link>
          </HeaderActionButton>
        </div>
      </div>
    </nav>
  );
}
