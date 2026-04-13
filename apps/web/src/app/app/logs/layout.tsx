import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Logs",
  description: "Inspect RelayForge request history with timestamps, provider routing, fallback activations, duration, and status outcomes."
};

export default function LogsLayout({ children }: PropsWithChildren) {
  return children;
}
