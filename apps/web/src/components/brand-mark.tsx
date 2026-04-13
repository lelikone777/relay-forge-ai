import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-accent/25 bg-panel/80 shadow-glow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(92,142,255,0.9),transparent_48%),radial-gradient(circle_at_70%_70%,rgba(125,93,255,0.75),transparent_54%)]" />
        <div className="relative h-5 w-5 rounded-md border border-white/25 bg-white/10" />
      </div>
      <div>
        <div className="font-display text-sm font-semibold tracking-tight text-foreground">RelayForge AI</div>
        <div className="text-xs text-muted-foreground">Unified AI Gateway</div>
      </div>
    </div>
  );
}

