import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Button, following the Atlassian Design System button spec:
 * 32px tall (24px compact), radius.medium, font.body at medium weight, and the
 * default / primary / subtle / warning / danger / discovery appearances.
 */
export type ButtonAppearance = "default" | "primary" | "subtle" | "warning" | "danger" | "discovery";
type Spacing = "default" | "compact";

const base =
  "inline-flex shrink-0 cursor-pointer select-none items-center justify-center whitespace-nowrap border text-sm font-medium transition-colors aria-disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-transparent disabled:bg-disabled disabled:text-disabled";

const appearances: Record<ButtonAppearance, string> = {
  default: "border-default bg-neutral-subtle text-subtle hover:bg-neutral-subtle-hovered active:bg-neutral-subtle-pressed",
  primary: "border-transparent bg-brand-bold text-inverse hover:bg-brand-bold-hovered active:bg-brand-bold-pressed",
  subtle: "border-transparent bg-neutral-subtle text-subtle hover:bg-neutral-subtle-hovered active:bg-neutral-subtle-pressed",
  warning: "border-transparent bg-warning-bold text-warning-inverse hover:bg-warning-bold-hovered active:bg-warning-bold-pressed",
  danger: "border-transparent bg-danger-bold text-inverse hover:bg-danger-bold-hovered active:bg-danger-bold-pressed",
  discovery: "border-transparent bg-discovery-bold text-inverse hover:bg-discovery-bold-hovered active:bg-discovery-bold-pressed",
};

const spacings: Record<Spacing, string> = {
  default: "h-8 gap-1.5 rounded-md px-3",
  compact: "h-6 gap-1 rounded-sm px-3",
};

/** Square icon-only variants. */
const iconSpacings: Record<Spacing, string> = {
  default: "size-8 rounded-md",
  compact: "size-6 rounded-sm",
};

type CommonProps = {
  appearance?: ButtonAppearance;
  spacing?: Spacing;
  /** Marks the button as the current selection (for toggles and navigation). */
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
    isSelected ? "border-transparent bg-selected text-selected hover:bg-selected-hovered active:bg-selected-pressed" : appearances[appearance],
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

/** A link that looks like a button (ADS LinkButton). */
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
