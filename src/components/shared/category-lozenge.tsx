import { Lozenge } from "@/components/ui/lozenge";
import { categoryMeta } from "@/features/news/categories";

/** The small coloured label that names an article's category. */
export function CategoryLozenge({ category, className }: { category: string; className?: string }) {
  const { label, appearance } = categoryMeta(category);
  return <Lozenge appearance={appearance} className={className}>{label}</Lozenge>;
}
