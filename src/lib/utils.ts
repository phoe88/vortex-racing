export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatDate(
  value: string | Date | null | undefined,
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
  locale = "en-GB",
) {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(locale, { timeZone: "UTC", ...opts }).format(d);
}

export function formatDateRange(start: string, end: string, locale = "en-GB") {
  const s = new Date(start);
  const e = new Date(end);
  const sameMonth = s.getUTCMonth() === e.getUTCMonth();
  const day = new Intl.DateTimeFormat(locale, { day: "numeric", timeZone: "UTC" });
  const month = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" });
  return sameMonth
    ? `${day.format(s)}–${day.format(e)} ${month.format(e)}`
    : `${day.format(s)} ${month.format(s)} – ${day.format(e)} ${month.format(e)}`;
}

export function formatTime(value: string, timeZone: string, locale = "en-GB") {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timeZone || "UTC",
    timeZoneName: "short",
  }).format(d);
}

export function formatPoints(points: number) {
  return Number.isInteger(points) ? String(points) : points.toFixed(1);
}

export function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

/** Flag emoji from an ISO 3166-1 alpha-2 country code. */
export function flagEmoji(countryCode: string) {
  const cc = countryCode.trim().toUpperCase();
  if (cc.length !== 2) return "";
  return String.fromCodePoint(...[...cc].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

export function readingTime(markdown: string) {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function truncate(text: string, max = 160) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export function toYouTubeEmbed(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}
