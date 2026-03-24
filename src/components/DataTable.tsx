import { ReactNode } from "react";

export type Column<Row> = {
  key: string;
  header: ReactNode;
  cell: (row: Row) => ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
};

export function DataTable<Row extends { pos: number }>({
  columns,
  rows,
  caption,
}: {
  columns: Column<Row>[];
  rows: Row[];
  caption?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-card-border bg-background/20 ma-fade-up">
      <div className="overflow-x-auto">
        <table className="w-full text-sm sm:min-w-[640px]">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead className="border-b border-card-border bg-background/20">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={[
                    "whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted sm:px-4 sm:py-3",
                    c.align === "right"
                      ? "text-right"
                      : c.align === "center"
                        ? "text-center"
                        : "text-left",
                    c.className ?? "",
                  ].join(" ")}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-card-border/70 last:border-b-0 hover:bg-background/10"
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={[
                      "whitespace-nowrap px-3 py-2.5 sm:px-4 sm:py-3",
                      c.align === "right"
                        ? "text-right"
                        : c.align === "center"
                          ? "text-center"
                          : "text-left",
                      c.className ?? "",
                    ].join(" ")}
                  >
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

