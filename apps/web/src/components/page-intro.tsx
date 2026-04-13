import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageIntro({
  eyebrow,
  title,
  description,
  actions,
  className
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="min-w-0 max-w-2xl space-y-3">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="text-safe font-display text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="text-safe text-base leading-7 text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex min-w-0 flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
