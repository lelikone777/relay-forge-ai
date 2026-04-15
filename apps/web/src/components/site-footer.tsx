"use client";

import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

export function SiteFooter() {
  const { locale } = useI18n();

  return (
    <footer className="relative px-6 py-24 lg:px-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-t from-cyan-500/10 via-violet-500/10 to-transparent blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="relative mb-16 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-black/80 to-black/60 p-12 shadow-2xl lg:p-16">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-violet-500/5 to-blue-500/5" />

          <div className="relative space-y-6 text-center">
            <h2 className="text-4xl font-bold lg:text-5xl">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-violet-200 bg-clip-text text-transparent">
                {pickLocale(locale, { ru: "Ready to Build?", en: "Ready to Build?" })}
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-white/60">
              {pickLocale(locale, {
                ru: "Start streaming AI responses with automatic fallback orchestration.",
                en: "Start streaming AI responses with automatic fallback orchestration."
              })}
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="border-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-600 hover:to-blue-600"
              >
                <Link href="/app/playground">
                  {pickLocale(locale, { ru: "Open Workspace", en: "Open Workspace" })}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="border-white/10 hover:bg-white/5">
                <Link href="/docs">
                  <FileText className="mr-2 h-4 w-4" />
                  {pickLocale(locale, { ru: "View Documentation", en: "View Documentation" })}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-12 md:grid-cols-4 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                <div className="h-4 w-4 rounded-sm bg-white" />
              </div>
              <span className="text-xl font-bold text-white">RelayForge AI</span>
            </div>
            <p className="text-sm text-white/60">
              {pickLocale(locale, {
                ru: "Unified AI gateway with intelligent fallback orchestration",
                en: "Unified AI gateway with intelligent fallback orchestration"
              })}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Product</h4>
            <ul className="space-y-3">
              {[
                ["/#features", "Features"],
                ["/docs", "Documentation"],
                ["/app/playground", "Playground"],
                ["/app/status", "Status"]
              ].map(([href, label]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Runtime</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li>Next.js App Router</li>
              <li>Cloudflare Workers</li>
              <li>Groq / OpenRouter / Mock</li>
              <li>TanStack Query</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Notes</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li>{pickLocale(locale, { ru: "Worker-side secrets only", en: "Worker-side secrets only" })}</li>
              <li>{pickLocale(locale, { ru: "In-memory logs and usage", en: "In-memory logs and usage" })}</li>
              <li>{pickLocale(locale, { ru: "Public demo fallback", en: "Public demo fallback" })}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/60">© 2026 RelayForge AI. All rights reserved.</p>
          <div className="text-sm text-white/40">{pickLocale(locale, { ru: "Design migrated from Relayforgeaiv2 and bound to live RelayForge functionality.", en: "Design migrated from Relayforgeaiv2 and bound to live RelayForge functionality." })}</div>
        </div>
      </div>
    </footer>
  );
}
