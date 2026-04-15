"use client";

import { cn } from "@/lib/utils";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

export function BrandMark({
  className,
  compactOnMobile = false
}: {
  className?: string;
  compactOnMobile?: boolean;
}) {
  const { locale } = useI18n();

  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-[1rem] border border-white/15 bg-[linear-gradient(135deg,rgba(6,182,212,0.95),rgba(37,99,235,0.92))] shadow-glow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.32),transparent_34%),radial-gradient(circle_at_78%_82%,rgba(124,58,237,0.35),transparent_44%)]" />
        <div className="relative h-4 w-4 rounded-[0.35rem] border border-white/60 bg-slate-950/85 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]" />
      </div>
      <div className={cn("min-w-0", compactOnMobile && "hidden min-[420px]:block")}>
        <div className="truncate font-display text-sm font-semibold tracking-tight text-foreground">RelayForge AI</div>
        <div className="truncate text-xs text-muted-foreground">
          {pickLocale(locale, {
            ru: "Единый AI Gateway",
            en: "Unified AI Gateway"
          })}
        </div>
      </div>
    </div>
  );
}
