import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Form controls: glass fields on the navy stage with a white focus edge. */
const control =
  "w-full rounded-md border border-input bg-input px-3 py-2 text-[1.0625rem] leading-6 text-default outline-none transition-colors placeholder:text-subtlest hover:bg-input-hovered focus:border-focused focus:bg-input-pressed aria-invalid:border-danger disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled disabled:text-disabled";

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("mb-1.5 block text-sm font-medium text-subtle", className)} {...props} />;
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
      {/* Options render in the browser's own menu, so they get a solid navy background. */}
      <select className={cn(control, "cursor-pointer appearance-none pr-9 [&>option]:bg-navy-raised", className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-icon-subtle" aria-hidden />
    </span>
  );
}

export function Checkbox({ className, label, ...props }: ComponentProps<"input"> & { label: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 text-default">
      <input type="checkbox" className={cn("size-4 cursor-pointer rounded-xs accent-(--red)", className)} {...props} />
      {label}
    </label>
  );
}

export function HelperMessage({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("type-body-small mt-1.5 text-subtlest", className)}>{children}</p>;
}

export function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="type-body-small mt-1.5 text-danger">{errors[0]}</p>;
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
