import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 px-8 py-12 text-center">
        <div className="rounded-2xl border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Empty
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-2xl font-semibold">{title}</h3>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        {action}
      </CardContent>
    </Card>
  );
}

