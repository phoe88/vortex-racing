import { z } from "zod";
import { f } from "@/lib/forms";
import { slugify } from "@/lib/utils";

const session = z.object({ name: z.string().min(1).max(60), starts_at: z.string().min(1) });

export const raceSchema = z
  .object({
    name: f.text(120),
    slug: f.optText(120),
    season: f.int(),
    round: f.int(),
    official_name: f.optText(200),
    country: f.text(80),
    country_code: f.textDefault(2),
    city: f.optText(80),
    circuit_name: f.text(120),
    circuit_image_url: f.url(),
    hero_image_url: f.url(),
    circuit_length_km: f.optNum(),
    laps: f.optInt(),
    lap_record: f.optText(40),
    timezone: f.textDefault(60),
    race_start: f.datetime(),
    status: f.enumOf(["upcoming", "live", "completed", "cancelled"]),
    sessions: f.json(z.array(session), []),
    summary: f.textDefault(20000),
  })
  .refine((d) => !!d.race_start, { path: ["race_start"], message: "Race start is required" })
  .transform((d) => ({
    ...d,
    slug: slugify(d.slug || `${d.name}-${d.season}`),
    timezone: d.timezone || "UTC",
    country_code: d.country_code.toUpperCase(),
    race_start: d.race_start!,
  }));

export const resultRowSchema = z.object({
  driver_name: z.string().trim().min(1).max(120),
  team_name: z.string().trim().min(1).max(120),
  driver_id: z.string().uuid().nullable().optional(),
  position: z.number().int().nullable(),
  grid: z.number().int().nullable(),
  points: z.number(),
  status: z.string().trim().max(60).default("Finished"),
  fastest_lap: z.boolean().default(false),
  time_text: z.string().trim().max(40).nullable(),
});
export const resultsPayloadSchema = z.object({
  race_id: z.string().uuid(),
  rows: f.json(z.array(resultRowSchema).max(40), []),
});
