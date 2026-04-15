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
          <p className="font-display text-3xl font-semibold tracking-tight text-foreground">{value}</p>
          <p className="text-safe text-sm text-muted-foreground">{hint}</p>
        </div>
        {icon ? (
          <div className="rounded-[1rem] border border-border/70 bg-[hsl(var(--panel)/0.72)] p-3 text-accent dark:border-white/10 dark:bg-white/[0.04]">
            {icon}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
