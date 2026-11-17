import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { STATIC_DARK as c } from "@/lib/theme";

export const OG_SIZE = { width: 1200, height: 630 };

/** Shared Open Graph card renderer, drawn in the design system's dark theme. */
export function renderOgCard({ eyebrow, title, subtitle, image }: { eyebrow?: string; title: string; subtitle?: string; image?: string | null }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: c.surface, color: c.text, fontFamily: "sans-serif", overflow: "hidden" }}>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${c.surface}F2 35%, ${c.surface}80 100%)`, display: "flex" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="48" height="48" viewBox="0 0 48 48"><path d="M4 8h12l8 18 8-18h12L28 42h-8L4 8Z" fill={c.logoPrimary} /><path d="M18 8h12l-6 13-6-13Z" fill={c.logoSecondary} /></svg>
            <span style={{ fontSize: 32, fontWeight: 700 }}>{siteConfig.name}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 20, maxWidth: 940 }}>
            {eyebrow && (
              <span style={{ display: "flex", fontSize: 24, padding: "6px 14px", borderRadius: 8, background: c.lozengeBackground, color: c.lozengeText }}>{eyebrow}</span>
            )}
            <div style={{ fontSize: title.length > 60 ? 56 : 68, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1, display: "flex" }}>{title}</div>
            {subtitle && <div style={{ fontSize: 28, color: c.textSubtle, lineHeight: 1.35, display: "flex" }}>{subtitle}</div>}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
