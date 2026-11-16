import { z } from "zod";
import { f } from "@/lib/forms";

export const driverStandingRow = z.object({
  position: z.number().int().min(1),
  driver_name: z.string().trim().min(1).max(120),
  team_name: z.string().trim().min(1).max(120),
  country_code: z.string().trim().max(2).default(""),
  points: z.number(),
  wins: z.number().int().default(0),
  podiums: z.number().int().default(0),
  is_team: z.boolean().default(false),
  driver_id: z.string().uuid().nullable().optional(),
});
export const constructorStandingRow = z.object({
  position: z.number().int().min(1),
  team_name: z.string().trim().min(1).max(120),
  points: z.number(),
  wins: z.number().int().default(0),
  is_team: z.boolean().default(false),
});

export const standingsPayload = z.object({
  season: f.int(),
  kind: f.enumOf(["drivers", "constructors"]),
  rows: f.json(z.array(z.any()).max(60), []),
});
