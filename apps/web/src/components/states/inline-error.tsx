"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

export function InlineError({
  title,
  description,
  onRetry
}: {
  title: string;
  description: string;
  onRetry?: () => void;
}) {
  const { locale } = useI18n();

  return (
    <Card className="border-rose-500/20">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-[0.875rem] border border-rose-500/25 bg-rose-500/10 p-2 text-rose-500 dark:text-rose-300">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <div className="font-medium text-foreground">{title}</div>
            <div className="text-sm text-muted-foreground">{description}</div>
          </div>
        </div>
        {onRetry ? (
          <Button onClick={onRetry} variant="secondary">
            <RefreshCw className="h-4 w-4" />
            {pickLocale(locale, { ru: "Повторить", en: "Retry" })}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
