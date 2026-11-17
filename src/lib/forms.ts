import { z } from "zod";

/** Plain object from FormData (files dropped, repeated keys collapsed to the last value). */
export function formToObject(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of formData.entries()) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
}

const empty = (v: unknown) => v === "" || v === undefined || v === null;

/** Shared Zod building blocks for HTML form inputs. */
export const f = {
  text: (max = 500) => z.string().trim().min(1, "Required").max(max),
  optText: (max = 5000) => z.preprocess((v) => (empty(v) ? null : v), z.string().trim().max(max).nullable()),
  textDefault: (max = 20000) => z.preprocess((v) => (empty(v) ? "" : v), z.string().trim().max(max)),
  url: () => z.preprocess((v) => (empty(v) ? null : v), z.url({ protocol: /^https?$/, error: "Must be a valid http(s) URL" }).max(2000).nullable()),
  /** Image location: a full URL, or a path to a file in /public such as "/images/drivers/x.webp". */
  image: () =>
    z.preprocess(
      (v) => (empty(v) ? null : v),
      z.union([z.url({ protocol: /^https?$/ }), z.string().regex(/^\/(?!\/)\S+$/)], { error: "Must be a full URL or a site path starting with /" }).pipe(z.string().max(2000)).nullable(),
    ),
  int: () => z.coerce.number().int(),
  optInt: () => z.preprocess((v) => (empty(v) ? null : Number(v)), z.number().int().nullable()),
  num: () => z.coerce.number(),
  optNum: () => z.preprocess((v) => (empty(v) ? null : Number(v)), z.number().nullable()),
  bool: () => z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean()),
  date: () => z.preprocess((v) => (empty(v) ? null : v), z.string().nullable()),
  /** datetime-local inputs have no zone; the admin UI documents them as UTC. */
  datetime: () =>
    z.preprocess(
      (v) => {
        if (empty(v)) return null;
        const s = String(v);
        const hasZone = /(Z|[+-]\d{2}:?\d{2})$/.test(s);
        const d = new Date(hasZone ? s : `${s}Z`);
        return Number.isNaN(d.getTime()) ? "__invalid__" : d.toISOString();
      },
      z.string().nullable(),
    ),
  tags: () =>
    z.preprocess(
      (v) => (typeof v === "string" ? v.split(",").map((t) => t.trim()).filter(Boolean) : Array.isArray(v) ? v : []),
      z.array(z.string().max(60)).max(20),
    ),
  json: <T extends z.ZodTypeAny>(inner: T, fallback: unknown = []) =>
    z.preprocess((v) => {
      if (empty(v)) return fallback;
      if (typeof v !== "string") return v;
      try { return JSON.parse(v); } catch { return "__invalid__"; }
    }, inner),
  enumOf: <const T extends readonly [string, ...string[]]>(values: T) => z.enum(values),
};

export function fieldErrorsOf(error: z.ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "_form");
    (out[key] ??= []).push(issue.message);
  }
  return out;
}
