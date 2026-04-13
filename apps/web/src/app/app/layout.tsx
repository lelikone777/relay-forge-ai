import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "Workspace",
  description: "RelayForge AI workspace: playground, provider status, logs, usage analytics, and settings."
};

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <AppShell>{children}</AppShell>;
}
