import { z } from "zod";
import { f } from "@/lib/forms";
import { slugify } from "@/lib/utils";

export const partnerSchema = z
  .object({
    name: f.text(120),
    slug: f.optText(120),
    tier: f.enumOf(["title", "principal", "official", "supplier"]),
    logo_url: f.image(),
    website_url: f.url(),
    description: f.textDefault(2000),
    sort_order: f.int(),
    is_active: f.bool(),
  })
  .transform((d) => ({ ...d, slug: slugify(d.slug || d.name) }));
