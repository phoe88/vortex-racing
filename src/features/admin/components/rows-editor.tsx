"use client";
import { useActionState, useState } from "react";
import { ArrowDownUp, Loader2, Plus, Save, Trash2 } from "lucide-react";
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
    <form action={formAction} className="card p-5 sm:p-6">
      {Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <input type="hidden" name="rows" value={serialised} />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold uppercase tracking-wide">{title}</h2>
          {description && <p className="text-xs text-muted">{description}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={sortByPosition} className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold hover:bg-white/6"><ArrowDownUp className="size-3.5" /> Sort</button>
          {pointsKey && <button type="button" onClick={applyPoints} className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold hover:bg-white/6">Standard points</button>}
          <button type="button" onClick={() => setRows((rs) => [...rs, { ...emptyRow, [positionKey]: rs.length + 1 }])} className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold hover:bg-white/6"><Plus className="size-3.5" /> Add row</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[48rem] text-sm">
          <thead className="text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              {columns.map((c) => <th key={c.key} className={cn("px-2 py-2 text-left font-semibold", c.width)}>{c.label}</th>)}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-line/60">
                {columns.map((c) => (
                  <td key={c.key} className="px-1.5 py-1.5">
                    {c.type === "checkbox" ? (
                      <input type="checkbox" checked={Boolean(r[c.key])} onChange={(e) => update(i, c.key, e.target.checked)} className="size-4 accent-[var(--accent)]" aria-label={c.label} />
                    ) : (
                      <input
                        type={c.type === "number" ? "number" : "text"}
                        step={c.step}
                        value={r[c.key] === null || r[c.key] === undefined ? "" : String(r[c.key])}
                        onChange={(e) => update(i, c.key, e.target.value)}
                        aria-label={c.label}
                        className="w-full rounded-md border border-white/10 bg-white/4 px-2 py-1.5 text-sm outline-none focus:border-accent-2/70"
                      />
                    )}
                  </td>
                ))}
                <td className="px-1.5">
                  <button type="button" onClick={() => setRows((rs) => rs.filter((_, idx) => idx !== i))} aria-label="Remove row" className="rounded-md p-1.5 text-red-300 hover:bg-red-500/15"><Trash2 className="size-4" /></button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={columns.length + 1} className="px-2 py-8 text-center text-muted">No rows. Add one to get started.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button type="submit" disabled={pending} className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-5 font-display text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-[#ff1a45] disabled:opacity-60">
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Save {rows.length} rows
        </button>
        {state?.message && <p className={cn("text-sm", state.ok ? "text-success" : "text-red-400")}>{state.message}</p>}
      </div>
    </form>
  );
}
