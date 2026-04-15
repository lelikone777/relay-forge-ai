import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[linear-gradient(135deg,rgba(14,165,233,1),rgba(37,99,235,1))] px-4 py-2.5 text-white shadow-glow hover:-translate-y-0.5 hover:brightness-110",
        secondary:
          "border-border/70 bg-[hsl(var(--panel)/0.72)] px-4 py-2.5 text-foreground backdrop-blur hover:border-border hover:bg-[hsl(var(--panel)/0.9)] dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/20 dark:hover:bg-white/[0.08]",
        ghost:
          "border-transparent bg-transparent px-3 py-2 text-muted-foreground hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/5",
        outline:
          "border-accent/25 bg-accent/10 px-4 py-2.5 text-accent backdrop-blur hover:border-accent/40 hover:bg-accent/15"
      },
      size: {
        default: "h-11",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-5",
        icon: "h-11 w-11"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
