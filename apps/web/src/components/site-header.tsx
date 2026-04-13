"use client";

import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

const items = [
  { href: "/docs", label: { ru: "Документация", en: "Docs" } },
  { href: "/app/status", label: { ru: "Статус", en: "Status" } },
  { href: "/app/playground", label: { ru: "Песочница", en: "Playground" } }
];

export function SiteHeader() {
  const { locale } = useI18n();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="shell-container flex h-20 items-center justify-between gap-4">
        <Link href="/" className="min-w-0 shrink-0">
          <BrandMark compactOnMobile />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-foreground">
              {pickLocale(locale, item.label)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/app/playground">
              {pickLocale(locale, {
                ru: "Открыть Workspace",
                en: "Open Workspace"
              })}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
