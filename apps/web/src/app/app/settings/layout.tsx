import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Settings",
  description: "Configure default strategy, streaming preferences, theme, and demo-mode behavior for the RelayForge workspace."
};

export default function SettingsLayout({ children }: PropsWithChildren) {
  return children;
}
