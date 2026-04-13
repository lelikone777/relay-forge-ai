import { chatRequestSchema } from "@relayforge/shared";

import { RelayError } from "../core/errors";
import { executeStream } from "../core/orchestrator";
import { errorResponse } from "../core/responses";
import type { Env } from "../env";

async function parseBody(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new RelayError({
      code: "validation_error",
      message: "Request body must be valid JSON.",
      status: 400
    });
  }
}

export async function handleStream(request: Request, env: Env) {
  try {
    const payload = await parseBody(request);
    const parsed = chatRequestSchema.safeParse(payload);

    if (!parsed.success) {
      throw new RelayError({
        code: "validation_error",
        message: "Request validation failed.",
        technicalDetails: parsed.error.flatten().formErrors.join("; "),
        status: 400
      });
    }

    return await executeStream(
      {
        ...parsed.data,
        options: {
          ...parsed.data.options,
          stream: true
        }
      },
      env,
      request.signal
    );
  } catch (cause) {
    const error =
      cause instanceof RelayError
        ? cause
        : new RelayError({
            code: "internal_error",
            message: cause instanceof Error ? cause.message : "Internal server error.",
            status: 500
          });

    return errorResponse(env, error);
  }
}

