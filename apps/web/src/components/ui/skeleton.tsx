import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-xl bg-[linear-gradient(110deg,rgba(148,163,184,0.12),rgba(148,163,184,0.22),rgba(148,163,184,0.12))] bg-[length:200%_100%] dark:bg-[linear-gradient(110deg,rgba(255,255,255,0.04),rgba(255,255,255,0.1),rgba(255,255,255,0.04))]",
        className
      )}
    />
  );
}
