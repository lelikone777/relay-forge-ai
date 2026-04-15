import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope, Space_Grotesk } from "next/font/google";
import type { PropsWithChildren } from "react";

import { AppProviders } from "@/providers/app-providers";

import "./globals.css";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono"
});

const siteUrl = "https://relayforge-ai.pages.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RelayForge AI | Unified AI Gateway",
    template: "%s | RelayForge AI"
  },
  description:
    "RelayForge AI is a serverless free-tier AI gateway playground with streaming responses, provider fallback orchestration, and normalized error handling.",
  keywords: [
    "RelayForge AI",
    "AI Gateway",
    "Cloudflare Workers",
    "Cloudflare Pages",
    "Groq Free",
    "SambaNova",
    "OpenRouter",
    "Fallback orchestration",
    "Streaming API"
  ],
  applicationName: "RelayForge AI",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "RelayForge AI",
    title: "RelayForge AI | Unified AI Gateway",
    description:
      "Serverless free-tier AI gateway playground with real-time streaming, automatic fallback, and normalized provider errors."
  },
  twitter: {
    card: "summary_large_image",
    title: "RelayForge AI | Unified AI Gateway",
    description:
      "Serverless free-tier AI gateway playground with real-time streaming and resilient provider fallback."
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${display.variable} ${mono.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
