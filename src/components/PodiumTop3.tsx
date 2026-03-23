import type { ReactNode } from "react";

export type PodiumStat = { label: string; value: ReactNode };

export type PodiumItem = {
  pos: 1 | 2 | 3;
  title: string;
  subtitle?: string;
  stats?: PodiumStat[];
  players?: string[];
};

export function PodiumTop3({ items, caption }: { items: PodiumItem[]; caption?: string }) {
  const byPos = new Map(items.map((i) => [i.pos, i]));
  const ordered = [byPos.get(2), byPos.get(1), byPos.get(3)].filter(Boolean) as PodiumItem[];

  if (ordered.length === 0) return null;

  return (
    <div className="ma-fade-up">
      {caption ? <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{caption}</div> : null}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end">
        {[2, 1, 3].map((pos) => {
          const item = byPos.get(pos as 1 | 2 | 3);
          if (!item) return <div key={pos} className="hidden sm:block" />;

          const isFirst = item.pos === 1;

          return (
            <div
              key={item.pos}
              className={[
                "rounded-2xl border border-card-border bg-card/70 px-5 py-5 backdrop-blur",
                "transition-transform duration-300",
                isFirst ? "sm:-translate-y-6" : "",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className={[isFirst ? "text-xl sm:text-2xl" : "text-lg", "font-semibold tracking-tight"].join(" ")}>
                    {item.title}
                  </div>
                  {item.subtitle ? <div className="mt-1 text-sm text-muted">{item.subtitle}</div> : null}
                </div>
                <div
                  className={[
                    "shrink-0 rounded-full border border-card-border bg-background/30 text-center font-semibold",
                    isFirst ? "h-12 w-12 text-base leading-[3rem]" : "h-10 w-10 text-sm leading-10",
                  ].join(" ")}
                >
                  {item.pos}
                </div>
              </div>

              {item.players && item.players.length ? (
                <div className="mt-3 text-xs leading-6 text-muted">
                  {item.players.slice(0, 6).join(" • ")}
                  {item.players.length > 6 ? " • …" : null}
                </div>
              ) : null}

              {item.stats && item.stats.length ? (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {item.stats.slice(0, 4).map((s) => (
                    <div key={s.label} className="rounded-xl border border-card-border/70 bg-background/20 px-3 py-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">{s.label}</div>
                      <div className="mt-1 text-sm font-semibold">{s.value}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

