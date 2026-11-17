import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Pill button. Red for the main action on a view, a glass pill for everything
 * else, and a borderless subtle variant for quiet actions.
 */
export type ButtonAppearance = "default" | "primary" | "subtle" | "inverse" | "warning" | "danger" | "discovery";
type Spacing = "default" | "compact" | "large";

const base =
  "inline-flex shrink-0 cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-full font-medium transition-colors aria-disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled";

const appearances: Record<ButtonAppearance, string> = {
  default: "bg-neutral-hovered text-default hover:bg-neutral-pressed active:bg-neutral-pressed",
  primary: "bg-brand-bold text-default hover:bg-brand-bold-hovered active:bg-brand-bold-pressed",
  subtle: "bg-neutral-subtle text-default hover:bg-neutral-subtle-hovered active:bg-neutral-subtle-pressed",
  inverse: "bg-neutral-bold text-inverse hover:bg-neutral-bold-hovered active:bg-neutral-bold-hovered",
  warning: "bg-warning-bold text-warning-inverse hover:bg-warning-bold-hovered active:bg-warning-bold-pressed",
  danger: "bg-danger-bold text-default hover:bg-danger-bold-hovered active:bg-danger-bold-pressed",
  discovery: "bg-discovery-bold text-default hover:bg-discovery-bold-hovered active:bg-discovery-bold-pressed",
};

const spacings: Record<Spacing, string> = {
  compact: "h-8 gap-1.5 px-3.5 text-sm",
  default: "h-10 gap-2 px-5 text-[1.0625rem]",
  large: "h-12 gap-2 px-6 text-[1.0625rem]",
};

/** Round icon-only variants. */
const iconSpacings: Record<Spacing, string> = {
  compact: "size-8",
  default: "size-10",
  large: "size-12",
};

type CommonProps = {
  appearance?: ButtonAppearance;
  spacing?: Spacing;
  /** Marks the button as the current selection (for toggles and pagination). */
  isSelected?: boolean;
  /** Stretch to the width of the container. */
  shouldFitContainer?: boolean;
  /** Icon-only button. Pass an `aria-label`. */
  iconOnly?: boolean;
  className?: string;
  children: ReactNode;
};

export function buttonClass({
  appearance = "default",
  spacing = "default",
  isSelected = false,
  shouldFitContainer = false,
  iconOnly = false,
  className,
}: Omit<CommonProps, "children"> = {}) {
  return cn(
    base,
    iconOnly ? iconSpacings[spacing] : spacings[spacing],
    isSelected ? appearances.inverse : appearances[appearance],
    shouldFitContainer && "w-full",
    className,
  );
}

export function Button({
  appearance,
  spacing,
  isSelected,
  shouldFitContainer,
  iconOnly,
  className,
  children,
  type = "button",
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button
      type={type}
      aria-pressed={isSelected === undefined ? undefined : isSelected}
      className={buttonClass({ appearance, spacing, isSelected, shouldFitContainer, iconOnly, className })}
      {...props}
    >
      {children}
    </button>
  );
}

/** A link that looks like a button. */
export function ButtonLink({
  appearance,
  spacing,
  isSelected,
  shouldFitContainer,
  iconOnly,
  className,
  children,
  href,
  ...props
}: CommonProps & Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  return (
    <Link href={href} className={buttonClass({ appearance, spacing, isSelected, shouldFitContainer, iconOnly, className })} {...props}>
      {children}
    </Link>
  );
}
