import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-2xl bg-[linear-gradient(110deg,rgba(148,163,184,0.12),rgba(148,163,184,0.22),rgba(148,163,184,0.12))] bg-[length:200%_100%]",
        className
      )}
    />
  );
}

