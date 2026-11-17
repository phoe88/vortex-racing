import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Form controls, following the Atlassian Design System text field spec:
 * color.background.input with a color.border.input outline, radius.medium,
 * and a color.border.focused ring when focused.
 */
const control =
  "w-full rounded-md border border-input bg-input px-2 py-[7px] text-sm text-default outline-none transition-colors placeholder:text-subtlest hover:bg-input-hovered focus:border-focused focus:bg-input-pressed focus:shadow-[inset_0_0_0_1px_var(--ds-border-focused)] aria-invalid:border-danger disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled disabled:text-disabled";

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("type-body-small mb-1 block font-bold text-subtle", className)} {...props} />;
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-28", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <span className="relative block">
      <select className={cn(control, "cursor-pointer appearance-none pr-8", className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-icon-subtle" aria-hidden />
    </span>
  );
}

export function Checkbox({ className, label, ...props }: ComponentProps<"input"> & { label: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-default">
      <input type="checkbox" className={cn("size-4 cursor-pointer rounded-xs accent-(--ds-background-selected-bold)", className)} {...props} />
      {label}
    </label>
  );
}

export function HelperMessage({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("type-body-small mt-1 text-subtlest", className)}>{children}</p>;
}

export function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="type-body-small mt-1 text-danger">{errors[0]}</p>;
}

export function Field({
  label,
  htmlFor,
  hint,
  errors,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  errors?: string[];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !errors?.length && <HelperMessage>{hint}</HelperMessage>}
      <FieldError errors={errors} />
    </div>
  );
}
