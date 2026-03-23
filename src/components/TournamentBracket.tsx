import type { ReactNode } from "react";

type Match = { top: string; bottom: string };

function TeamChip({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-card-border bg-background/20 px-3 py-2">
      <div className="h-9 w-9 shrink-0 rounded-xl border border-card-border bg-background/30" />
      <div className="min-w-0 truncate text-sm font-semibold">{name}</div>
    </div>
  );
}

function MatchBox({ match }: { match: Match }) {
  return (
    <div className="grid gap-2">
      <TeamChip name={match.top} />
      <TeamChip name={match.bottom} />
    </div>
  );
}

function Round({
  title,
  children,
  hint,
}: {
  title: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-card-border bg-background/10 px-4 py-4 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</div>
        {hint ? <div className="text-[11px] font-semibold text-muted">{hint}</div> : null}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function TournamentBracket({
  title = "Bracket",
  leftLabel = "Cuartos",
  midLabel = "Semis",
  rightLabel = "Final",
  leftMatches,
}: {
  title?: string;
  leftLabel?: string;
  midLabel?: string;
  rightLabel?: string;
  leftMatches: [Match, Match];
}) {
  return (
    <div className="ma-fade-up">
      <div className="mb-3 text-sm font-semibold">{title}</div>
      <div className="grid gap-4 md:grid-cols-3">
        <Round title={leftLabel} hint="Top 4">
          <div className="grid gap-4">
            <MatchBox match={leftMatches[0]} />
            <MatchBox match={leftMatches[1]} />
          </div>
        </Round>
        <Round title={midLabel} hint="Ganadores">
          <MatchBox
            match={{
              top: "Ganador (1 vs 4)",
              bottom: "Ganador (2 vs 3)",
            }}
          />
        </Round>
        <Round title={rightLabel} hint="Título">
          <MatchBox
            match={{
              top: "Campeón",
              bottom: "Finalista",
            }}
          />
          <div className="mt-3 text-xs leading-6 text-muted">
            Las llaves se publican como “Próximamente” hasta que se confirmen.
          </div>
        </Round>
      </div>
    </div>
  );
}
