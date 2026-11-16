import { renderOgCard, OG_SIZE } from "@/lib/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — Official Website`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgCard({ eyebrow: "Official website", title: siteConfig.tagline, subtitle: siteConfig.description });
}
