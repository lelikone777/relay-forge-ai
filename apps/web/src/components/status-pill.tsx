import type { ModeId, ProviderStatus } from "@relayforge/shared";

import { Badge } from "@/components/ui/badge";

const providerVariantMap: Record<ProviderStatus["status"], "accent" | "success" | "warning" | "danger"> = {
  live: "success",
  limited: "warning",
  degraded: "danger",
  fallback: "accent",
  "demo-ready": "accent"
};

const modeVariantMap: Record<ModeId, "accent" | "success" | "warning"> = {
  normal: "success",
  degraded: "warning",
  demo: "accent"
};

export function ProviderStatusPill({ status }: { status: ProviderStatus["status"] }) {
  return <Badge variant={providerVariantMap[status]}>{status}</Badge>;
}

export function ModePill({ mode }: { mode: ModeId }) {
  return <Badge variant={modeVariantMap[mode]}>{mode}</Badge>;
}

