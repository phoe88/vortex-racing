import { z } from "zod";
import { f } from "@/lib/forms";

export const teamAboutSchema = z.object({
  heading: f.text(200),
  body: f.textDefault(4000),
  stats: f.json(z.array(z.object({ label: z.string().min(1).max(40), value: z.string().min(1).max(40) })).max(8), []),
});
