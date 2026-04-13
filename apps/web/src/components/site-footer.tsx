import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";

const footerLinks = [
  { href: "/docs", label: "API Docs" },
  { href: "/app/playground", label: "Playground" },
  { href: "/app/usage", label: "Usage" },
  { href: "/app/status", label: "Provider Status" }
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background/70">
      <div className="shell-container flex flex-col gap-8 py-10 md:flex-row md:items-end md:justify-between">
        <div className="space-y-4">
          <BrandMark />
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Free-tier-first AI gateway playground with streaming, fallback routing and demo-safe reliability for public
            deployment.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {footerLinks.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

