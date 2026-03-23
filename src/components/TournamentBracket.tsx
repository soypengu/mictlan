type Match = { top: string; bottom: string };

function TeamChip({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-card-border bg-background/20 px-3 py-2">
      <div className="h-8 w-8 rounded-lg border border-card-border bg-background/30" />
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
    <div className="rounded-2xl border border-card-border bg-background/10 px-5 py-5 backdrop-blur">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_84px_1fr_84px_1fr] lg:items-center">
        <div className="grid gap-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted">{leftLabel}</div>
          <div className="grid gap-5">
            <MatchBox match={leftMatches[0]} />
            <MatchBox match={leftMatches[1]} />
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="relative mx-auto h-[220px] w-[84px]">
            <div className="absolute left-1/2 top-[56px] h-[52px] w-[42px] -translate-x-1/2 border-l border-t border-card-border/80" />
            <div className="absolute left-1/2 top-[108px] h-0 w-[42px] -translate-x-1/2 border-t border-card-border/80" />
            <div className="absolute left-1/2 top-[112px] h-[52px] w-[42px] -translate-x-1/2 border-l border-b border-card-border/80" />
          </div>
        </div>

        <div className="grid gap-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted">{midLabel}</div>
          <MatchBox
            match={{
              top: "Ganador (1 vs 4)",
              bottom: "Ganador (2 vs 3)",
            }}
          />
        </div>

        <div className="hidden lg:block">
          <div className="relative mx-auto h-[220px] w-[84px]">
            <div className="absolute left-1/2 top-[86px] h-0 w-[42px] -translate-x-1/2 border-t border-card-border/80" />
            <div className="absolute left-1/2 top-[86px] h-[48px] w-[42px] -translate-x-1/2 border-l border-card-border/80" />
          </div>
        </div>

        <div className="grid gap-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted">{rightLabel}</div>
          <MatchBox
            match={{
              top: "Campeón",
              bottom: "Finalista",
            }}
          />
          <div className="text-xs leading-6 text-muted">Las llaves se publican como “Próximamente” hasta que se confirmen.</div>
        </div>
      </div>
    </div>
  );
}

