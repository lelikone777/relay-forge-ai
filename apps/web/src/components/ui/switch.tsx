"use client";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

export function Switch({ className, ...props }: ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>) {
  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-white/10 bg-white/5 transition-colors data-[state=checked]:bg-accent data-[state=unchecked]:bg-white/5",
        className
      )}
      {...props}
    >
      <SwitchPrimitives.Thumb className="pointer-events-none block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[1.2rem]" />
    </SwitchPrimitives.Root>
  );
}
