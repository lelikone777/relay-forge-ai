"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { PropsWithChildren } from "react";

import { I18nProvider } from "@/providers/i18n-provider";
import { SettingsProvider } from "@/providers/settings-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 15_000,
            refetchOnWindowFocus: false
          }
        }
      })
  );

  return (
    <ThemeProvider>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <SettingsProvider>{children}</SettingsProvider>
        </QueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

