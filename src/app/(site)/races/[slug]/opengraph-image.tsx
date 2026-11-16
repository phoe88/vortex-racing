import { getRaceBySlug } from "@/features/races/queries";
import { renderOgCard, OG_SIZE } from "@/lib/og";

export const alt = "Race";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = await getRaceBySlug(slug);
  return renderOgCard({
    eyebrow: r ? `Round ${r.round} · ${r.season}` : "Race",
    title: r?.name ?? "Race not found",
    subtitle: r ? `${r.circuit_name} · ${r.city}, ${r.country}` : undefined,
    image: r?.hero_image_url,
  });
}
