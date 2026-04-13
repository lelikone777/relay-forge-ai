"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";

import type { StrategyId } from "@relayforge/shared";

type SettingsState = {
  defaultStrategy: StrategyId;
  streamingEnabled: boolean;
  subtleDemoHints: boolean;
};

type SettingsContextValue = SettingsState & {
  setDefaultStrategy: (value: StrategyId) => void;
  setStreamingEnabled: (value: boolean) => void;
  setSubtleDemoHints: (value: boolean) => void;
};

const STORAGE_KEY = "relayforge-settings";

const defaultState: SettingsState = {
  defaultStrategy: "auto",
  streamingEnabled: true,
  subtleDemoHints: true
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<SettingsState>(defaultState);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return;
    }

    try {
      const nextState = JSON.parse(raw) as Partial<SettingsState>;
      setState({ ...defaultState, ...nextState });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      ...state,
      setDefaultStrategy: (defaultStrategy) => setState((current) => ({ ...current, defaultStrategy })),
      setStreamingEnabled: (streamingEnabled) => setState((current) => ({ ...current, streamingEnabled })),
      setSubtleDemoHints: (subtleDemoHints) => setState((current) => ({ ...current, subtleDemoHints }))
    }),
    [state]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }

  return context;
}

