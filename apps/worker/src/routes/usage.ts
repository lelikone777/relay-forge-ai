import { getProviderStatusSnapshot } from "../core/provider-status";
import { getUsage } from "../core/metrics-store";
import { json } from "../core/responses";
import type { Env } from "../env";

export function handleUsage(_request: Request, env: Env) {
  const usage = getUsage();
  const status = getProviderStatusSnapshot(env);

  return json(env, {
    success: true,
    data: {
      ...usage,
      mode: status.mode
    }
  });
}

