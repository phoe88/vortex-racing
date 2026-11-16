import type { Metadata, Viewport } from "next";
import { siteConfig, getSiteUrl } from "@/config/site";
import { fontBody, fontDisplay } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${siteConfig.name} — Official Website`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["motorsport", "racing team", "Formula", siteConfig.name, "race calendar", "drivers"],
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Official Website`,
    description: siteConfig.description,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Official Website`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#060b1a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontBody.variable} ${fontDisplay.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
