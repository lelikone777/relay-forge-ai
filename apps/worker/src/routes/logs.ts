import { getLogs } from "../core/metrics-store";
import { json } from "../core/responses";
import type { Env } from "../env";

export function handleLogs(_request: Request, env: Env) {
  return json(env, {
    success: true,
    data: getLogs()
  });
}

