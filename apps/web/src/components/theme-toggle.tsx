"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { pickLocale } from "@/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

export function ThemeToggle() {
  const { locale } = useI18n();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-11 w-11 rounded-xl border border-border/70 bg-panel/60" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      aria-label={pickLocale(locale, { ru: "Переключить тему", en: "Toggle theme" })}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      size="icon"
      variant="secondary"
    >
      {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
    </Button>
  );
}
