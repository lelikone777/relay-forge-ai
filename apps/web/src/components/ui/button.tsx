import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-accent px-4 py-2.5 text-accent-foreground shadow-glow hover:translate-y-[-1px] hover:brightness-110",
        secondary:
          "border-border/80 bg-panel/80 px-4 py-2.5 text-foreground backdrop-blur hover:border-accent/40 hover:bg-panel",
        ghost: "border-transparent bg-transparent px-3 py-2 text-muted-foreground hover:bg-panel/60 hover:text-foreground",
        outline:
          "border-border/80 bg-background/60 px-4 py-2.5 text-foreground backdrop-blur hover:border-accent/40 hover:bg-panel/60"
      },
      size: {
        default: "h-11",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-2xl px-5",
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

