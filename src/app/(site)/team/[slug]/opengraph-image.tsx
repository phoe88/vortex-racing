import { getDriverBySlug } from "@/features/drivers/queries";
import { renderOgCard, OG_SIZE } from "@/lib/og";

export const alt = "Driver profile";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await getDriverBySlug(slug);
  return renderOgCard({
    eyebrow: d?.number != null ? `#${d.number}` : "Driver",
    title: d ? `${d.first_name} ${d.last_name}` : "Driver not found",
    subtitle: d?.tagline,
    image: d?.hero_image_url ?? d?.image_url,
  });
}
