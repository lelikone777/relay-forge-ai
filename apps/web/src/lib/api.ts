"use client";

import type { ChatRequest, LogsResponse, ProviderStatusResponse, SuccessResponse, UsageResponse } from "@relayforge/shared";

import { demoLogs, demoProviderStatus, demoUsage } from "@/lib/demo-data";
import { appConfig } from "@/lib/config";

const jsonHeaders = {
  "Content-Type": "application/json"
};

async function safeJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    const fallback = await response.text();
    throw new Error(fallback || `Request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

async function withDemoFallback<T>(request: () => Promise<T>, fallback: T) {
  try {
    return await request();
  } catch {
    return fallback;
  }
}

export function fetchProviderStatus() {
  return withDemoFallback(
    () => safeJson<ProviderStatusResponse>(`${appConfig.apiBaseUrl}/api/v1/providers/status`),
    demoProviderStatus
  );
}

export function fetchLogs() {
  return withDemoFallback(() => safeJson<LogsResponse>(`${appConfig.apiBaseUrl}/api/v1/logs`), demoLogs);
}

export function fetchUsage() {
  return withDemoFallback(() => safeJson<UsageResponse>(`${appConfig.apiBaseUrl}/api/v1/usage`), demoUsage);
}

export async function postChat(body: ChatRequest) {
  return safeJson<SuccessResponse>(`${appConfig.apiBaseUrl}/api/v1/chat`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(body)
  });
}

