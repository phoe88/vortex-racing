import { cn } from "@/lib/utils";

const tones = {
  accent: "bg-accent text-white",
  yellow: "bg-accent-2 text-night",
  muted: "bg-white/10 text-ice",
  outline: "border border-white/20 text-ice",
  success: "bg-success/15 text-success",
};

export function Badge({
  children,
  tone = "muted",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.16em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export const CATEGORY_LABEL: Record<string, string> = {
  news: "News",
  "race-report": "Race report",
  feature: "Feature",
  video: "Video",
  partner: "Partners",
  team: "Team",
};
