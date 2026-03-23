"use client";

import { useMemo } from "react";

type Column = {
  key: string;
  label: string;
  type: "text" | "number" | "datetime";
  placeholder?: string;
  width?: string;
};

function isoToLocalInput(iso: string | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function localInputToIso(value: string) {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

export function EditableTable<Row extends Record<string, unknown>>({
  title,
  rows,
  onChange,
  columns,
  addRow,
}: {
  title: string;
  rows: Row[];
  onChange: (rows: Row[]) => void;
  columns: Column[];
  addRow: () => Row;
}) {
  const colStyles = useMemo(() => columns.map((c) => c.width ?? "minmax(140px, 1fr)"), [columns]);

  return (
    <div className="rounded-2xl border border-card-border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm font-semibold">{title}</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange([...rows, addRow()])}
            className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-brand-2"
          >
            Agregar
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: [...colStyles, "96px"].join(" ") }}
        >
          {columns.map((c) => (
            <div key={c.key} className="px-2 pb-1 text-[11px] font-semibold uppercase text-muted">
              {c.label}
            </div>
          ))}
          <div className="px-2 pb-1 text-[11px] font-semibold uppercase text-muted">Acción</div>

          {rows.map((row, idx) => (
            <RowEditor
              key={idx}
              row={row}
              idx={idx}
              columns={columns}
              onRowChange={(nextRow) => {
                const next = rows.slice();
                next[idx] = nextRow;
                onChange(next);
              }}
              onDelete={() => {
                const next = rows.slice();
                next.splice(idx, 1);
                onChange(next);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function RowEditor<Row extends Record<string, unknown>>({
  row,
  idx,
  columns,
  onRowChange,
  onDelete,
}: {
  row: Row;
  idx: number;
  columns: Column[];
  onRowChange: (row: Row) => void;
  onDelete: () => void;
}) {
  return (
    <>
      {columns.map((c) => {
        const value = row[c.key];
        const inputType = c.type === "datetime" ? "datetime-local" : c.type;
        const inputValue =
          c.type === "datetime"
            ? isoToLocalInput(typeof value === "string" ? value : undefined)
            : value === undefined || value === null
              ? ""
              : String(value);

        return (
          <div key={`${idx}-${c.key}`} className="px-1">
            <input
              value={inputValue}
              onChange={(e) => {
                const next: Row = { ...row };
                if (c.type === "number") {
                  const n = e.target.value === "" ? undefined : Number(e.target.value);
                  (next as Record<string, unknown>)[c.key] = Number.isFinite(n as number) ? n : undefined;
                } else if (c.type === "datetime") {
                  (next as Record<string, unknown>)[c.key] = localInputToIso(e.target.value);
                } else {
                  (next as Record<string, unknown>)[c.key] = e.target.value;
                }
                onRowChange(next);
              }}
              placeholder={c.placeholder}
              type={inputType}
              className="w-full rounded-xl border border-card-border bg-background/30 px-3 py-2 text-xs text-foreground outline-none focus:border-brand/60"
            />
          </div>
        );
      })}
      <div className="px-1">
        <button
          type="button"
          onClick={onDelete}
          className="w-full rounded-xl border border-card-border bg-background/30 px-3 py-2 text-xs font-semibold text-danger transition-colors hover:border-danger/60"
        >
          Eliminar
        </button>
      </div>
    </>
  );
}

