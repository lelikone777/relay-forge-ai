import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-accent/50 focus:ring-2 focus:ring-accent/20",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
