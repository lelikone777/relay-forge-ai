"use client";

import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/providers/i18n-provider";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex h-10 items-center gap-0.5 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur">
      <div className="hidden px-1.5 text-muted-foreground min-[380px]:block">
        <Languages className="h-4 w-4" />
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setLocale("ru")}
        className={cn(
          "h-8 px-1.5 text-[11px] min-[380px]:px-2",
          locale === "ru" && "bg-accent/15 text-accent hover:bg-accent/20"
        )}
      >
        RU
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setLocale("en")}
        className={cn(
          "h-8 px-1.5 text-[11px] min-[380px]:px-2",
          locale === "en" && "bg-accent/15 text-accent hover:bg-accent/20"
        )}
      >
        EN
      </Button>
    </div>
  );
}
