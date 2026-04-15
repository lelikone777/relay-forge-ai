import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  hint,
  icon
}: {
  label: string;
  value: string;
  hint: string;
  icon?: ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex min-w-0 items-start justify-between gap-4 p-5">
        <div className="min-w-0 space-y-3">
          <p className="text-safe text-xs uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
          <p className="font-display text-3xl font-semibold tracking-tight text-white">{value}</p>
          <p className="text-safe text-sm text-muted-foreground">{hint}</p>
        </div>
        {icon ? <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-accent">{icon}</div> : null}
      </CardContent>
    </Card>
  );
}
