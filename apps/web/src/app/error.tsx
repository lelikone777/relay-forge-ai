"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="shell-container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="eyebrow">Route Error</div>
      <h1 className="font-display text-4xl font-semibold">UI failed to render cleanly.</h1>
      <p className="max-w-2xl text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Retry render</Button>
    </div>
  );
}

