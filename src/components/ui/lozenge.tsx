import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Lozenge, following the Atlassian Design System lozenge spec: a 20px-tall
 * label at font.body.small with radius.small, used to flag a status or
 * category. Semantic appearances carry meaning; accent appearances only group.
 */
export type LozengeAppearance =
  | "neutral" | "success" | "warning" | "danger" | "information" | "discovery"
  | "accent-red" | "accent-orange" | "accent-yellow" | "accent-lime" | "accent-green"
  | "accent-teal" | "accent-blue" | "accent-purple" | "accent-magenta" | "accent-gray";

const appearances: Record<LozengeAppearance, string> = {
  neutral: "bg-neutral text-default",
  success: "bg-success-subtler text-success-bolder",
  warning: "bg-warning-subtler text-warning-bolder",
  danger: "bg-danger-subtler text-danger-bolder",
  information: "bg-information-subtler text-information-bolder",
  discovery: "bg-discovery-subtler text-discovery-bolder",
  "accent-red": "bg-accent-red-subtler text-accent-red-bolder",
  "accent-orange": "bg-accent-orange-subtler text-accent-orange-bolder",
  "accent-yellow": "bg-accent-yellow-subtler text-accent-yellow-bolder",
  "accent-lime": "bg-accent-lime-subtler text-accent-lime-bolder",
  "accent-green": "bg-accent-green-subtler text-accent-green-bolder",
  "accent-teal": "bg-accent-teal-subtler text-accent-teal-bolder",
  "accent-blue": "bg-accent-blue-subtler text-accent-blue-bolder",
  "accent-purple": "bg-accent-purple-subtler text-accent-purple-bolder",
  "accent-magenta": "bg-accent-magenta-subtler text-accent-magenta-bolder",
  "accent-gray": "bg-accent-gray-subtlest text-accent-gray-bolder",
};

export function Lozenge({
  children,
  appearance = "neutral",
  className,
}: {
  children: ReactNode;
  appearance?: LozengeAppearance;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "type-body-small inline-flex h-5 max-w-full shrink-0 items-center gap-1 overflow-hidden whitespace-nowrap rounded-sm px-1",
        appearances[appearance],
        className,
      )}
    >
      {children}
    </span>
  );
}
