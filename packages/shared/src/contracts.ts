import { z } from "zod";

import { ERROR_CODES, MODES, PROVIDERS, STATUS_VARIANTS, STRATEGIES } from "./constants";

export const providerSchema = z.enum(PROVIDERS);
export const strategySchema = z.enum(STRATEGIES);
export const errorCodeSchema = z.enum(ERROR_CODES);
export const statusVariantSchema = z.enum(STATUS_VARIANTS);
export const modeSchema = z.enum(MODES);

export const chatMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]).default("user"),
  content: z.string().min(1).max(8_000)
});

export const requestOptionsSchema = z.object({
  strategy: strategySchema.default("auto"),
  stream: z.boolean().default(true),
  maxTokens: z.number().int().min(32).max(4_096).default(512),
  temperature: z.number().min(0).max(2).default(0.3)
});

export const chatRequestSchema = z.object({
  prompt: z.string().min(1).max(8_000),
  messages: z.array(chatMessageSchema).optional(),
  options: requestOptionsSchema.default({
    strategy: "auto",
    stream: true,
    maxTokens: 512,
    temperature: 0.3
  }),
  metadata: z
    .object({
      source: z.string().default("relayforge-web"),
      sessionId: z.string().optional()
    })
    .optional()
});

export const responseMetaSchema = z.object({
  strategy: strategySchema,
  attemptedProvider: providerSchema,
  finalProvider: providerSchema,
  fallbackActivated: z.boolean(),
  degradedMode: z.boolean(),
  demoMode: z.boolean(),
  latencyMs: z.number().nonnegative(),
  model: z.string(),
  timestamp: z.string()
});

export const successResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    text: z.string(),
    meta: responseMetaSchema
  })
});

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: errorCodeSchema,
    message: z.string(),
    technicalDetails: z.string().optional(),
    provider: providerSchema.optional(),
    fallbackActivated: z.boolean().optional(),
    timestamp: z.string()
  })
});

export const providerStatusSchema = z.object({
  id: providerSchema,
  label: z.string(),
  status: statusVariantSchema,
  description: z.string(),
  latencyMs: z.number().nonnegative(),
  freeTierReady: z.boolean(),
  supportsStreaming: z.boolean(),
  available: z.boolean(),
  model: z.string()
});

export const providerStatusResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    mode: modeSchema,
    routingOrder: z.array(providerSchema),
    providers: z.array(providerStatusSchema),
    timestamp: z.string()
  })
});

export const logEntrySchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  promptPreview: z.string(),
  strategy: strategySchema,
  attemptedProvider: providerSchema,
  finalProvider: providerSchema,
  durationMs: z.number().nonnegative(),
  status: z.enum(["success", "error", "streaming", "fallback"]),
  fallbackActivated: z.boolean(),
  degradedMode: z.boolean(),
  errorCode: errorCodeSchema.optional()
});

export const logsResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    total: z.number().int().nonnegative(),
    items: z.array(logEntrySchema)
  })
});

export const usageTimeseriesPointSchema = z.object({
  label: z.string(),
  requests: z.number().nonnegative(),
  fallbacks: z.number().nonnegative(),
  latencyMs: z.number().nonnegative()
});

export const usageResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    mode: modeSchema,
    totals: z.object({
      requests: z.number().nonnegative(),
      successful: z.number().nonnegative(),
      failed: z.number().nonnegative(),
      fallbackActivations: z.number().nonnegative(),
      avgLatencyMs: z.number().nonnegative()
    }),
    providerDistribution: z.array(
      z.object({
        provider: providerSchema,
        value: z.number().nonnegative()
      })
    ),
    timeseries: z.array(usageTimeseriesPointSchema)
  })
});

export type ProviderId = z.infer<typeof providerSchema>;
export type StrategyId = z.infer<typeof strategySchema>;
export type ErrorCode = z.infer<typeof errorCodeSchema>;
export type ModeId = z.infer<typeof modeSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ResponseMeta = z.infer<typeof responseMetaSchema>;
export type SuccessResponse = z.infer<typeof successResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type ProviderStatus = z.infer<typeof providerStatusSchema>;
export type ProviderStatusResponse = z.infer<typeof providerStatusResponseSchema>;
export type LogEntry = z.infer<typeof logEntrySchema>;
export type LogsResponse = z.infer<typeof logsResponseSchema>;
export type UsageResponse = z.infer<typeof usageResponseSchema>;

