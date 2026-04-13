import type { ErrorCode, ProviderId } from "@relayforge/shared";

export class RelayError extends Error {
  code: ErrorCode;
  provider?: ProviderId;
  technicalDetails?: string;
  fallbackActivated?: boolean;
  status: number;

  constructor({
    code,
    message,
    provider,
    technicalDetails,
    fallbackActivated,
    status = 500
  }: {
    code: ErrorCode;
    message: string;
    provider?: ProviderId;
    technicalDetails?: string;
    fallbackActivated?: boolean;
    status?: number;
  }) {
    super(message);
    this.name = "RelayError";
    this.code = code;
    this.provider = provider;
    this.technicalDetails = technicalDetails;
    this.fallbackActivated = fallbackActivated;
    this.status = status;
  }
}

export function toRelayError(cause: unknown, provider?: ProviderId) {
  if (cause instanceof RelayError) {
    return cause;
  }

  if (cause instanceof Error && cause.name === "AbortError") {
    return new RelayError({
      code: "provider_timeout",
      message: "Provider request timed out.",
      provider,
      technicalDetails: cause.message,
      status: 504
    });
  }

  return new RelayError({
    code: "internal_error",
    message: cause instanceof Error ? cause.message : "Unexpected internal error.",
    provider,
    technicalDetails: cause instanceof Error ? cause.stack : undefined,
    status: 500
  });
}

