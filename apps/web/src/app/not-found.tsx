import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="shell-container flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <div className="eyebrow">404</div>
      <h1 className="font-display text-5xl font-semibold">Route not found</h1>
      <p className="max-w-xl text-muted-foreground">This workspace view does not exist in the current RelayForge build.</p>
      <Button asChild>
        <Link href="/app/playground">Open Playground</Link>
      </Button>
    </div>
  );
}

