import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1 text-center text-[11px] font-medium uppercase tracking-[0.18em] break-words",
  {
    variants: {
      variant: {
        default: "border-white/10 bg-white/5 text-foreground",
        accent: "border-accent/30 bg-accent/12 text-accent",
        success: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
        warning: "border-amber-400/25 bg-amber-400/10 text-amber-300",
        danger: "border-rose-400/25 bg-rose-400/10 text-rose-300"
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
