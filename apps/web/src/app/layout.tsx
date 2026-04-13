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

export const metadata: Metadata = {
  title: "RelayForge AI",
  description: "Единый AI gateway playground на free-tier инфраструктуре."
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${sans.variable} ${display.variable} ${mono.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
