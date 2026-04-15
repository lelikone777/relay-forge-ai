"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const headerActionVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[1rem] border text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        subtle:
          "border-border/70 bg-[hsl(var(--panel)/0.72)] text-foreground backdrop-blur-xl hover:border-border hover:bg-[hsl(var(--panel)/0.9)] dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/20 dark:hover:bg-white/[0.08]",
        active:
          "border-accent/25 bg-accent/10 text-accent backdrop-blur-xl hover:border-accent/40 hover:bg-accent/15",
        primary:
          "border-transparent bg-[linear-gradient(135deg,rgba(14,165,233,1),rgba(37,99,235,1))] text-white shadow-glow hover:-translate-y-0.5 hover:brightness-110"
      },
      size: {
        default: "h-11 px-4",
        compact: "h-9 px-3 text-xs",
        icon: "h-11 w-11 px-0"
      }
    },
    defaultVariants: {
      variant: "subtle",
      size: "default"
    }
  }
);

type HeaderActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof headerActionVariants> & {
    asChild?: boolean;
  };

export const HeaderActionButton = React.forwardRef<HTMLButtonElement, HeaderActionButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(headerActionVariants({ variant, size, className }))} {...props} />;
  }
);

HeaderActionButton.displayName = "HeaderActionButton";

export function HeaderActionGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("topbar-shell flex items-center gap-1 p-1", className)} {...props} />;
}
