"use client";
import { useActionState, useState } from "react";
import { ArrowDownUp, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import type { ActionState } from "@/types";
import { cn } from "@/lib/utils";

export type Column = { key: string; label: string; type?: "text" | "number" | "checkbox"; width?: string; step?: string };
type Row = Record<string, string | number | boolean | null>;

const POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

export function RowsEditor({
  action,
  columns,
  initialRows,
  hidden = {},
  title,
  description,
  emptyRow,
  pointsKey,
  positionKey = "position",
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  columns: Column[];
  initialRows: Row[];
  hidden?: Record<string, string>;
  title: string;
  description?: string;
  emptyRow: Row;
  pointsKey?: string;
  positionKey?: string;
}) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, null);

  const update = (i: number, key: string, value: Row[string]) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));

  const sortByPosition = () =>
    setRows((rs) => [...rs].sort((a, b) => (Number(a[positionKey]) || 999) - (Number(b[positionKey]) || 999)));

  const applyPoints = () =>
    setRows((rs) => rs.map((r) => {
      const p = Number(r[positionKey]);
      return pointsKey ? { ...r, [pointsKey]: p >= 1 && p <= 10 ? POINTS[p - 1] : 0 } : r;
    }));

  const serialised = JSON.stringify(
    rows.map((r) =>
      Object.fromEntries(
        Object.entries(r).map(([k, v]) => {
          const col = columns.find((c) => c.key === k);
          if (col?.type === "number") return [k, v === "" || v === null ? null : Number(v)];
          if (col?.type === "checkbox") return [k, Boolean(v)];
          return [k, v === "" ? null : v];
        }),
      ),
    ),
  );

  return (
    <form action={formAction} className="card p-4 sm:p-6">
      {Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <input type="hidden" name="rows" value={serialised} />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="type-heading-small">{title}</h2>
          {description && <p className="type-body-small mt-1 text-subtle">{description}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={sortByPosition}><ArrowDownUp className="size-4" aria-hidden /> Sort</Button>
          {pointsKey && <Button onClick={applyPoints}>Standard points</Button>}
          <Button onClick={() => setRows((rs) => [...rs, { ...emptyRow, [positionKey]: rs.length + 1 }])}><Plus className="size-4" aria-hidden /> Add row</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[48rem] text-sm">
          <thead>
            <tr>
              {columns.map((c) => <th key={c.key} className={cn("type-body-small border-b-2 px-1 py-1.5 text-left font-bold text-subtle", c.width)}>{c.label}</th>)}
              <th className="w-10 border-b-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b">
                {columns.map((c) => (
                  <td key={c.key} className="px-1 py-1">
                    {c.type === "checkbox" ? (
                      <input type="checkbox" checked={Boolean(r[c.key])} onChange={(e) => update(i, c.key, e.target.checked)} className="size-4 cursor-pointer rounded-xs accent-(--red)" aria-label={c.label} />
                    ) : (
                      <Input
                        type={c.type === "number" ? "number" : "text"}
                        step={c.step}
                        value={r[c.key] === null || r[c.key] === undefined ? "" : String(r[c.key])}
                        onChange={(e) => update(i, c.key, e.target.value)}
                        aria-label={c.label}
                        className="py-[3px]!"
                      />
                    )}
                  </td>
                ))}
                <td className="px-1">
                  <Button appearance="subtle" iconOnly onClick={() => setRows((rs) => rs.filter((_, idx) => idx !== i))} aria-label="Remove row" className="text-danger!"><Trash2 className="size-4" aria-hidden /></Button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={columns.length + 1} className="px-2 py-8 text-center text-subtle">No rows. Add one to get started.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button type="submit" appearance="primary" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden />} Save {rows.length} rows
        </Button>
        {state?.message && <p className={cn("text-sm", state.ok ? "text-success" : "text-danger")}>{state.message}</p>}
      </div>
    </form>
  );
}
