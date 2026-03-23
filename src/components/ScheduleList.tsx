import type { UpcomingEvent } from "@/lib/types";
import { formatDateTime } from "@/lib/format";

export function ScheduleList({
  items,
  emptyLabel,
}: {
  items: UpcomingEvent[];
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-card-border bg-background/20 px-5 py-6 text-sm text-muted ma-fade-up">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-card-border bg-background/20 px-5 py-5 ma-pop"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{item.title}</div>
              {item.subtitle ? (
                <div className="mt-1 truncate text-xs text-muted">{item.subtitle}</div>
              ) : null}
            </div>
            <div className="shrink-0 rounded-full border border-card-border bg-background/30 px-3 py-1 text-xs text-muted">
              {formatDateTime(item.startsAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

