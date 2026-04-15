import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Provider Status",
  description: "Monitor Groq, SambaNova, OpenRouter, and Mock provider health, routing order, fallback policy, and current relay mode."
};

export default function StatusLayout({ children }: PropsWithChildren) {
  return children;
}
