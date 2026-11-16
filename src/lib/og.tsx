import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const OG_SIZE = { width: 1200, height: 630 };

/** Shared Open Graph card renderer: dark navy, racing stripe, bold condensed title. */
export function renderOgCard({ eyebrow, title, subtitle, image }: { eyebrow?: string; title: string; subtitle?: string; image?: string | null }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#060b1a", color: "#eaf0ff", fontFamily: "sans-serif", overflow: "hidden" }}>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.45 }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(6,11,26,0.95) 35%, rgba(6,11,26,0.5) 100%)", display: "flex" }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 18, background: "repeating-linear-gradient(-45deg, #e8002d 0 14px, transparent 14px 28px)", display: "flex" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px 56px 88px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="56" height="56" viewBox="0 0 48 48"><path d="M4 8h12l8 18 8-18h12L28 42h-8L4 8Z" fill="#e8002d" /><path d="M18 8h12l-6 13-6-13Z" fill="#ffc400" /></svg>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1, textTransform: "uppercase", fontStyle: "italic" }}>{siteConfig.name}</span>
              {eyebrow && <span style={{ fontSize: 18, letterSpacing: 6, textTransform: "uppercase", color: "#ffc400" }}>{eyebrow}</span>}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 940 }}>
            <div style={{ fontSize: title.length > 60 ? 60 : 76, fontWeight: 800, lineHeight: 1, textTransform: "uppercase", letterSpacing: -2, display: "flex" }}>{title}</div>
            {subtitle && <div style={{ fontSize: 28, color: "#b7c0d8", lineHeight: 1.3, display: "flex" }}>{subtitle}</div>}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
