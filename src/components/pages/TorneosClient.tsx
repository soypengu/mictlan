"use client";

import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/PageHeader";
import { PodiumTop3 } from "@/components/PodiumTop3";
import { PublicShell } from "@/components/PublicShell";
import { Section } from "@/components/Section";
import { SectionBreak } from "@/components/SectionBreak";
import { TournamentBracket } from "@/components/TournamentBracket";
import { usePublicState } from "@/components/usePublicState";
import type { PublicState, StandingRow } from "@/lib/types";

export function TorneosClient({ initialState }: { initialState: PublicState }) {
  const state = usePublicState(initialState);
  const tournament = state.activeTournament;

  const splitPlayers = (value: string | undefined) =>
    typeof value === "string"
      ? value
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean)
      : undefined;

  const podiumItems = (tournament?.standings ?? [])
    .filter((r) => r.pos >= 1 && r.pos <= 3)
    .slice()
    .sort((a, b) => a.pos - b.pos)
    .slice(0, 3)
    .map((r) => ({
      pos: r.pos as 1 | 2 | 3,
      title: r.team,
      players: splitPlayers(r.players),
      stats: [
        { label: "Pts", value: typeof r.points === "number" ? r.points : "—" },
        { label: "Kills", value: typeof r.kills === "number" ? r.kills : "—" },
      ],
    }));

  const top4 = (tournament?.standings ?? [])
    .slice()
    .sort((a, b) => a.pos - b.pos)
    .slice(0, 4);

  const bracketLeftMatches: [
    { top: string; bottom: string },
    { top: string; bottom: string },
  ] = [
    {
      top: top4[0]?.team ?? "Próximamente",
      bottom: top4[3]?.team ?? "Próximamente",
    },
    {
      top: top4[1]?.team ?? "Próximamente",
      bottom: top4[2]?.team ?? "Próximamente",
    },
  ];

  const standingsColumns = [
    { key: "pos", header: "#", align: "right" as const, className: "w-14", cell: (r: StandingRow) => r.pos },
    { key: "team", header: "Equipo", cell: (r: StandingRow) => r.team },
    { key: "played", header: "PJ", align: "right" as const, cell: (r: StandingRow) => r.played ?? "—" },
    { key: "wins", header: "G", align: "right" as const, cell: (r: StandingRow) => (typeof r.wins === "number" ? r.wins : "—") },
    { key: "losses", header: "P", align: "right" as const, cell: (r: StandingRow) => (typeof r.losses === "number" ? r.losses : "—") },
    { key: "points", header: "Pts", align: "right" as const, cell: (r: StandingRow) => (typeof r.points === "number" ? r.points : "—") },
    { key: "kills", header: "Kills", align: "right" as const, cell: (r: StandingRow) => (typeof r.kills === "number" ? r.kills : "—") },
  ];

  return (
    <PublicShell>
      <PageHeader
        badge="Competencias"
        title="Tablas de Torneos"
        subtitle="Aquí se muestra la tabla oficial del torneo activo (puntos, kills y resultados)."
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
        <Section
          title={tournament ? tournament.name : "Sin torneo activo"}
          subtitle={
            tournament?.season
              ? `${tournament.season} · ${tournament.status.toUpperCase()}`
              : tournament
                ? tournament.status.toUpperCase()
                : "Cuando haya un torneo activo, aparecerá aquí."
          }
        >
          {tournament ? (
            <>
              <PodiumTop3 caption="Top 3" items={podiumItems} />
              <div className="mt-6" />
              <DataTable caption="Tabla del torneo" columns={standingsColumns} rows={tournament.standings} />
            </>
          ) : (
            <div className="rounded-2xl border border-card-border bg-card px-5 py-6 text-sm text-muted">
              No hay un torneo activo por el momento.
            </div>
          )}
        </Section>

        <div className="mt-10" />

        <Section
          title="Bracket · Eliminatorias finales"
          subtitle="Así se jugarán las llaves cuando termine la fase de tabla."
        >
          <TournamentBracket title="Tournament Bracket" leftMatches={bracketLeftMatches} />
          <div className="mt-6 rounded-2xl border border-card-border bg-card px-5 py-5">
            <div className="text-sm font-semibold">Cómo funcionan</div>
            <div className="mt-2 text-sm leading-7 text-muted">
              La fase final se juega en eliminación simple. El Top 4 de la tabla clasifica al bracket y se empareja por
              seed: 1 vs 4 y 2 vs 3. Los ganadores avanzan a semifinales/final según el formato anunciado.
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <RuleRow title="Seeds">Se toman según la posición en tabla (puntos y desempates).</RuleRow>
              <RuleRow title="Series">El Bo (Best of) y mapas se anuncian en Discord.</RuleRow>
              <RuleRow title="Confirmación">Cuando se confirmen llaves y horarios, aquí dejará de decir “Próximamente”.</RuleRow>
            </div>
          </div>
        </Section>

        <SectionBreak />

        <div className="grid gap-6 sm:grid-cols-3">
          <InfoCard title="Puntos">
            Los puntos se calculan por posición y desempeño. El reglamento se publica en Discord.
          </InfoCard>
          <InfoCard title="Kills">
            Las kills se registran por partida y pueden influir en desempates o bonus.
          </InfoCard>
          <InfoCard title="Actualizaciones">
            La tabla se actualiza en vivo cuando el admin guarda cambios desde el panel oculto.
          </InfoCard>
        </div>
      </div>
    </PublicShell>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-card-border bg-card px-5 py-5">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-2 text-sm leading-7 text-muted">{children}</div>
    </div>
  );
}

function RuleRow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-card-border bg-background/20 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</div>
      <div className="mt-1 text-sm text-muted">{children}</div>
    </div>
  );
}
