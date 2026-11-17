import type { Metadata } from "next";
import { NewsletterBlock } from "@/components/shared/newsletter-block";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Newsletter",
  description: `Join the ${siteConfig.name} newsletter for race previews, debriefs and exclusive access.`,
  alternates: { canonical: "/newsletter" },
};

export default function NewsletterPage() {
  return <NewsletterBlock source="newsletter-page" as="h1" className="flex min-h-screen items-center pt-40" />;
}
