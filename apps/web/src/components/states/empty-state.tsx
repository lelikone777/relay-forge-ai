"use client";

import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  const { locale } = useI18n();

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 px-8 py-12 text-center">
        <div className="rounded-[1rem] border border-border/70 bg-[hsl(var(--panel)/0.72)] px-4 py-2 text-xs uppercase tracking-[0.24em] text-muted-foreground dark:border-white/10 dark:bg-white/[0.04]">
          {pickLocale(locale, { ru: "Пусто", en: "Empty" })}
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-2xl font-semibold text-foreground">{title}</h3>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        {action}
      </CardContent>
    </Card>
  );
}
