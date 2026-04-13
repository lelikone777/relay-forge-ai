import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Playground",
  description: "Run prompts through RelayForge AI with real-time streaming, provider strategy selection, fallback visibility, and response metadata."
};

export default function PlaygroundLayout({ children }: PropsWithChildren) {
  return children;
}
