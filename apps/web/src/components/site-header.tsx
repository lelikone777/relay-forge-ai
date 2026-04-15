"use client";

import { Code2 } from "lucide-react";
import Link from "next/link";

import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

const items = [
  { href: "/#features", label: { ru: "Features", en: "Features" } },
  { href: "/#architecture", label: { ru: "Architecture", en: "Architecture" } },
  { href: "/docs", label: { ru: "Docs", en: "Docs" } },
  { href: "/app/status", label: { ru: "Status", en: "Status" } }
];

export function SiteHeader() {
  const { locale } = useI18n();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/25">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">RelayForge AI</span>
            <Badge className="border-violet-500/20 bg-violet-500/10 text-violet-300 text-[10px]">Beta</Badge>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {items.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-white/70 transition-colors hover:text-white">
                {pickLocale(locale, item.label)}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <Button asChild className="border-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600">
            <Link href="/app/playground">{pickLocale(locale, { ru: "Get Started", en: "Get Started" })}</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
