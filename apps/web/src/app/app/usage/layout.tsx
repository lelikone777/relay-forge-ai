import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Usage Analytics",
  description: "Review RelayForge traffic, provider distribution, latency trends, and fallback metrics in an observability-style dashboard."
};

export default function UsageLayout({ children }: PropsWithChildren) {
  return children;
}
