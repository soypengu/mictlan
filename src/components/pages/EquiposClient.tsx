"use client";

import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/PageHeader";
import { PodiumTop3 } from "@/components/PodiumTop3";
import { PublicShell } from "@/components/PublicShell";
import { Section } from "@/components/Section";
import { SectionBreak } from "@/components/SectionBreak";
import { usePublicState } from "@/components/usePublicState";
import type { PublicState, TeamRankingRow } from "@/lib/types";

export function EquiposClient({ initialState }: { initialState: PublicState }) {
  const state = usePublicState(initialState);

  const splitPlayers = (value: string | undefined) =>
    typeof value === "string"
      ? value
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean)
      : undefined;

  const podiumItems = state.topTeams
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

  const columns = [
    { key: "pos", header: "#", align: "right" as const, className: "w-14", cell: (r: TeamRankingRow) => r.pos },
    { key: "team", header: "Equipo", cell: (r: TeamRankingRow) => r.team },
    { key: "points", header: "Pts", align: "right" as const, cell: (r: TeamRankingRow) => (typeof r.points === "number" ? r.points : "—") },
    { key: "kills", header: "Kills", align: "right" as const, cell: (r: TeamRankingRow) => (typeof r.kills === "number" ? r.kills : "—") },
    { key: "matches", header: "Partidas", align: "right" as const, cell: (r: TeamRankingRow) => (typeof r.matches === "number" ? r.matches : "—") },
  ];

  return (
    <PublicShell>
      <PageHeader
        badge="Ranking"
        title="Equipos"
        subtitle="Ranking general por puntos/kills. Puede combinar datos de torneo y scrims según la temporada."
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
        <Section title="Top Equipos" subtitle="Actualizado en vivo">
          <PodiumTop3 caption="Top 3" items={podiumItems} />
          <div className="mt-6" />
          <DataTable caption="Ranking de equipos" columns={columns} rows={state.topTeams} />
        </Section>

        <SectionBreak />

        <div className="grid gap-6 sm:grid-cols-3">
          <InfoCard title="Puntos vs Kills">
            En la mayoría de formatos, los puntos reflejan consistencia y las kills reflejan agresividad.
          </InfoCard>
          <InfoCard title="Desempates">
            Si hay empate en puntos, se aplican reglas de desempate (kills, mejores posiciones, etc.).
          </InfoCard>
          <InfoCard title="Cómo entrar">
            Forma equipo, únete a Discord y participa en scrims semanales y clasificatorios publicados.
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
