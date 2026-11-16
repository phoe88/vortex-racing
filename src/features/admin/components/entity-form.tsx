"use client";
import Link from "next/link";
import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { ImageField } from "./image-field";
import type { ActionState } from "@/types";
import { cn } from "@/lib/utils";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "markdown" | "number" | "select" | "checkbox" | "date" | "datetime" | "image" | "json" | "tags" | "url";
  options?: { value: string; label: string }[];
  hint?: string;
  placeholder?: string;
  span?: 1 | 2;
  required?: boolean;
  step?: string;
  rows?: number;
  folder?: string;
};

export type FormSection = { title: string; description?: string; fields: FieldDef[] };

function toInput(def: FieldDef, v: unknown): string {
  if (v === null || v === undefined) return "";
  switch (def.type) {
    case "json": return typeof v === "string" ? v : JSON.stringify(v, null, 2);
    case "tags": return Array.isArray(v) ? v.join(", ") : String(v);
    case "datetime": {
      if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v)) return v;
      const d = new Date(v as string);
      return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 16);
    }
    case "date": return String(v).slice(0, 10);
    default: return String(v);
  }
}

export function EntityForm({
  action,
  sections,
  initial = {},
  submitLabel = "Save",
  cancelHref,
  className,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  sections: FormSection[];
  initial?: Record<string, unknown>;
  submitLabel?: string;
  cancelHref?: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, null);
  const valueOf = (def: FieldDef) => {
    const fromState = state?.values?.[def.name];
    if (fromState !== undefined && fromState !== null) return toInput(def, fromState);
    return toInput(def, initial[def.name]);
  };
  const checkedOf = (def: FieldDef) => {
    if (state?.values) return state.values[def.name] === "on";
    return Boolean(initial[def.name]);
  };

  return (
    <form action={formAction} className={cn("space-y-8", className)} noValidate>
      {state && !state.ok && state.message && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">{state.message}</div>
      )}
      {state?.ok && state.message && (
        <div className="rounded-lg border border-success/30 bg-success/10 px-4 py-2.5 text-sm text-success">{state.message}</div>
      )}
      {sections.map((section) => (
        <section key={section.title} className="card p-5 sm:p-6">
          <h2 className="font-display text-lg font-bold uppercase tracking-wide">{section.title}</h2>
          {section.description && <p className="mt-1 text-xs text-muted">{section.description}</p>}
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {section.fields.map((def) => {
              const id = `f-${def.name}`;
              const errors = state?.fieldErrors?.[def.name];
              const span = def.span === 2 || ["textarea", "markdown", "json", "image"].includes(def.type ?? "") ? "sm:col-span-2" : "";
              if (def.type === "checkbox") {
                return (
                  <div key={def.name} className={cn("flex items-center pt-6", span)}>
                    <Checkbox name={def.name} label={def.label} defaultChecked={checkedOf(def)} />
                  </div>
                );
              }
              return (
                <Field key={def.name} label={def.required ? `${def.label} *` : def.label} htmlFor={id} hint={def.hint} errors={errors} className={span}>
                  {def.type === "textarea" || def.type === "markdown" || def.type === "json" ? (
                    <Textarea id={id} name={def.name} defaultValue={valueOf(def)} rows={def.rows ?? (def.type === "markdown" ? 16 : def.type === "json" ? 8 : 4)} placeholder={def.placeholder} className={def.type === "json" ? "font-mono text-xs" : undefined} />
                  ) : def.type === "select" ? (
                    <Select id={id} name={def.name} defaultValue={valueOf(def)}>
                      {def.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </Select>
                  ) : def.type === "image" ? (
                    <ImageField id={id} name={def.name} defaultValue={valueOf(def)} folder={def.folder} />
                  ) : (
                    <Input
                      id={id}
                      name={def.name}
                      type={def.type === "datetime" ? "datetime-local" : def.type === "number" ? "number" : def.type === "date" ? "date" : def.type === "url" ? "url" : "text"}
                      step={def.step}
                      defaultValue={valueOf(def)}
                      placeholder={def.placeholder}
                    />
                  )}
                </Field>
              );
            })}
          </div>
        </section>
      ))}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-6 font-display text-sm font-semibold uppercase tracking-[0.12em] text-white hover:bg-[#ff1a45] disabled:opacity-60">
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} {submitLabel}
        </button>
        {cancelHref && <Link href={cancelHref} className="text-sm text-muted hover:text-ice">Cancel</Link>}
      </div>
    </form>
  );
}
