"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";

import { defaultLocale, isLocale, localeStorageKey, type Locale } from "@/lib/i18n";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const stored = window.localStorage.getItem(localeStorageKey);

    if (stored && isLocale(stored)) {
      setLocaleState(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(localeStorageKey, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale: (nextLocale) => setLocaleState(nextLocale)
    }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}

