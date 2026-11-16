import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-lg border border-white/12 bg-white/4 px-3.5 py-2.5 text-sm text-ice placeholder:text-muted/70 outline-none transition focus:border-accent-2/70 focus:bg-white/6 focus:ring-2 focus:ring-accent-2/20 disabled:opacity-50";

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted", className)} {...props} />;
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-28 leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={cn(control, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%238b96b5%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:12px] bg-[right_0.9rem_center] bg-no-repeat pr-9", className)} {...props}>
      {children}
    </select>
  );
}

export function Checkbox({ className, label, ...props }: ComponentProps<"input"> & { label: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-ice">
      <input type="checkbox" className={cn("size-4 rounded border-white/20 bg-white/5 accent-[var(--accent)]", className)} {...props} />
      {label}
    </label>
  );
}

export function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1.5 text-xs text-red-400">{errors[0]}</p>;
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
      {hint && !errors?.length && <p className="mt-1.5 text-xs text-muted/80">{hint}</p>}
      <FieldError errors={errors} />
    </div>
  );
}
