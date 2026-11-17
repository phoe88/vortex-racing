"use client";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { SectionMessage } from "@/components/ui/section-message";
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
    <form action={formAction} className={cn("space-y-4", className)} noValidate>
      {state && !state.ok && state.message && (
        <SectionMessage appearance="error">{state.message}</SectionMessage>
      )}
      {state?.ok && state.message && (
        <SectionMessage appearance="success">{state.message}</SectionMessage>
      )}
      {sections.map((section) => (
        <section key={section.title} className="card p-4 sm:p-6">
          <h2 className="type-heading-small">{section.title}</h2>
          {section.description && <p className="type-body-small mt-1 text-subtle">{section.description}</p>}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {section.fields.map((def) => {
              const id = `f-${def.name}`;
              const errors = state?.fieldErrors?.[def.name];
              const span = def.span === 2 || ["textarea", "markdown", "json", "image"].includes(def.type ?? "") ? "sm:col-span-2" : "";
              if (def.type === "checkbox") {
                return (
                  <div key={def.name} className={cn("flex items-center pt-5", span)}>
                    <Checkbox name={def.name} label={def.label} defaultChecked={checkedOf(def)} />
                  </div>
                );
              }
              return (
                <Field key={def.name} label={def.required ? `${def.label} *` : def.label} htmlFor={id} hint={def.hint} errors={errors} className={span}>
                  {def.type === "textarea" || def.type === "markdown" || def.type === "json" ? (
                    <Textarea id={id} name={def.name} defaultValue={valueOf(def)} rows={def.rows ?? (def.type === "markdown" ? 16 : def.type === "json" ? 8 : 4)} placeholder={def.placeholder} className={def.type === "json" ? "font-mono" : undefined} />
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
      <div className="flex items-center gap-2">
        <Button type="submit" appearance="primary" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden />} {submitLabel}
        </Button>
        {cancelHref && <ButtonLink href={cancelHref} appearance="subtle">Cancel</ButtonLink>}
      </div>
    </form>
  );
}
