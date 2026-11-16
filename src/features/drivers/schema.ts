import { z } from "zod";
import { f } from "@/lib/forms";
import { slugify } from "@/lib/utils";

export const driverSchema = z
  .object({
    first_name: f.text(80),
    last_name: f.text(80),
    slug: f.optText(120),
    number: f.optInt(),
    nationality: f.textDefault(80),
    country_code: f.textDefault(2),
    role: f.enumOf(["race", "reserve", "academy"]),
    tagline: f.textDefault(200),
    bio: f.textDefault(20000),
    date_of_birth: f.date(),
    place_of_birth: f.optText(120),
    image_url: f.url(),
    hero_image_url: f.url(),
    helmet_image_url: f.url(),
    instagram_url: f.url(),
    x_url: f.url(),
    career_starts: f.int(),
    career_wins: f.int(),
    career_podiums: f.int(),
    career_poles: f.int(),
    career_points: f.num(),
    championships: f.int(),
    is_active: f.bool(),
    sort_order: f.int(),
  })
  .transform((d) => ({
    ...d,
    slug: slugify(d.slug || `${d.first_name} ${d.last_name}`),
    country_code: d.country_code.toUpperCase(),
  }));

export const teamMemberSchema = z.object({
  name: f.text(120),
  role_title: f.text(120),
  bio: f.textDefault(4000),
  image_url: f.url(),
  sort_order: f.int(),
  is_active: f.bool(),
});
