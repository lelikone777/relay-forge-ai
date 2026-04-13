import type { ChatRequest, LogsResponse, ProviderStatusResponse, SuccessResponse, UsageResponse } from "@relayforge/shared";
import type { ErrorResponse } from "@relayforge/shared";

import { demoLogs, demoProviderStatus, demoUsage } from "@/lib/demo-data";
import { getApiBaseUrl } from "@/lib/config";

const jsonHeaders = {
  "Content-Type": "application/json"
};

export class ApiRequestError extends Error {
  status?: number;
  payload?: ErrorResponse;
  technicalDetails?: string;

  constructor(message: string, options?: { status?: number; payload?: ErrorResponse; technicalDetails?: string }) {
    super(message);
    this.name = "ApiRequestError";
    this.status = options?.status;
    this.payload = options?.payload;
    this.technicalDetails = options?.technicalDetails;
  }
}

async function safeJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    const raw = await response.text();

    try {
      const payload = JSON.parse(raw) as ErrorResponse;

      if (!payload.success && payload.error) {
        throw new ApiRequestError(payload.error.message, {
          status: response.status,
          payload,
          technicalDetails: payload.error.technicalDetails
        });
      }
    } catch (error) {
      if (error instanceof ApiRequestError) {
        throw error;
      }
    }

    throw new ApiRequestError(`Request failed with ${response.status}`, {
      status: response.status,
      technicalDetails: raw
    });
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
    () => safeJson<ProviderStatusResponse>(`${getApiBaseUrl()}/api/v1/providers/status`),
    demoProviderStatus
  );
}

export function fetchLogs() {
  return withDemoFallback(() => safeJson<LogsResponse>(`${getApiBaseUrl()}/api/v1/logs`), demoLogs);
}

export function fetchUsage() {
  return withDemoFallback(() => safeJson<UsageResponse>(`${getApiBaseUrl()}/api/v1/usage`), demoUsage);
}

export async function postChat(body: ChatRequest) {
  return safeJson<SuccessResponse>(`${getApiBaseUrl()}/api/v1/chat`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(body)
  });
}
