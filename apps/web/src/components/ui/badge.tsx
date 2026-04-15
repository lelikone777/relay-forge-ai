import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1 text-center text-[11px] font-medium uppercase tracking-[0.18em] break-words",
  {
    variants: {
      variant: {
        default: "border-border/70 bg-[hsl(var(--panel)/0.72)] text-foreground dark:border-white/10 dark:bg-white/[0.04]",
        accent: "border-accent/30 bg-accent/12 text-accent",
        success: "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
        warning: "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-300",
        danger: "border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-300"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, className }))} {...props} />;
}
