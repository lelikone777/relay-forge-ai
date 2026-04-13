import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "API Docs",
  description: "RelayForge AI API documentation: endpoints, request and response contracts, streaming, fallback, and error model."
};

export default function DocsLayout({ children }: PropsWithChildren) {
  return children;
}
