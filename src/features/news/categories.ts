import type { LozengeAppearance } from "@/components/ui/lozenge";
import type { ArticleCategory } from "@/types";

/**
 * How each article category is labelled and coloured. Every category has its
 * own accent so stories can be told apart at a glance, and none of them uses
 * the brand blue reserved for buttons and links.
 */
export const CATEGORY_META: Record<ArticleCategory, { label: string; appearance: LozengeAppearance }> = {
  news: { label: "News", appearance: "accent-gray" },
  "race-report": { label: "Race report", appearance: "accent-teal" },
  feature: { label: "Feature", appearance: "accent-purple" },
  video: { label: "Video", appearance: "accent-magenta" },
  team: { label: "Team", appearance: "accent-lime" },
  partner: { label: "Partners", appearance: "accent-orange" },
};

export function categoryMeta(category: string) {
  return CATEGORY_META[category as ArticleCategory] ?? { label: category, appearance: "neutral" as const };
}
