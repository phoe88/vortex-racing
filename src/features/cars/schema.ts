import { z } from "zod";
import { f } from "@/lib/forms";
import { slugify } from "@/lib/utils";

const spec = z.object({ group: z.string().max(60), label: z.string().min(1).max(80), value: z.string().min(1).max(120) });
const achievement = z.object({ label: z.string().min(1).max(80), value: z.string().min(1).max(60) });

export const carSchema = z
  .object({
    name: f.text(60),
    slug: f.optText(80),
    season: f.int(),
    chassis: f.optText(120),
    power_unit: f.optText(160),
    tagline: f.textDefault(200),
    description: f.textDefault(20000),
    image_url: f.image(),
    hero_image_url: f.image(),
    specs: f.json(z.array(spec), []),
    achievements: f.json(z.array(achievement), []),
    is_current: f.bool(),
  })
  .transform((d) => ({ ...d, slug: slugify(d.slug || d.name) }));
