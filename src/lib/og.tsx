import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { BRAND as c } from "@/lib/theme";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * The image renderer only draws PNG, JPEG and GIF from absolute URLs. Photos
 * stored in /public (paths such as "/images/news/x.webp") are read from disk,
 * and WebP or AVIF images are converted to JPEG, then inlined as data URLs.
 * Returns null when an image can't be loaded, so the card renders without it.
 */
async function resolveImage(src: string | null | undefined): Promise<string | null> {
  if (!src) return null;
  const isLocal = src.startsWith("/");
  const needsConversion = /\.(webp|avif)(\?|$)/i.test(src);
  if (!isLocal && !needsConversion) return src;
  try {
    const input = isLocal
      ? await readFile(join(process.cwd(), "public", src.split("?")[0]))
      : Buffer.from(await (await fetch(src)).arrayBuffer());
    const { default: sharp } = await import("sharp");
    const jpeg = await sharp(input).resize({ width: OG_SIZE.width, withoutEnlargement: true }).jpeg({ quality: 82 }).toBuffer();
    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    return null;
  }
}

/** Shared Open Graph card: photo faded into navy, red label, heavy white title. */
export async function renderOgCard({ eyebrow, title, subtitle, image: imageSrc }: { eyebrow?: string; title: string; subtitle?: string; image?: string | null }) {
  const image = await resolveImage(imageSrc);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: c.navy, color: c.white, fontFamily: "sans-serif", overflow: "hidden" }}>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(0deg, ${c.navy} 20%, rgba(0,22,43,0.55) 70%, rgba(0,22,43,0.2) 100%)`, display: "flex" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="52" height="52" viewBox="0 0 48 48"><path d="M4 8h12l8 18 8-18h12L28 42h-8L4 8Z" fill={c.red} /><path d="M18 8h12l-6 13-6-13Z" fill={c.yellow} /></svg>
            <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>{siteConfig.name}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 20, maxWidth: 1000 }}>
            {eyebrow && (
              <span style={{ display: "flex", fontSize: 24, padding: "8px 20px", borderRadius: 999, background: c.red }}>{eyebrow}</span>
            )}
            <div style={{ fontSize: title.length > 60 ? 58 : 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1, display: "flex" }}>{title}</div>
            {subtitle && <div style={{ fontSize: 28, color: c.textSubtle, lineHeight: 1.35, display: "flex" }}>{subtitle}</div>}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
