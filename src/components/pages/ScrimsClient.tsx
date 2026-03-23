"use client";

import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/PageHeader";
import { PodiumTop3 } from "@/components/PodiumTop3";
import { PublicShell } from "@/components/PublicShell";
import { Section } from "@/components/Section";
import { SectionBreak } from "@/components/SectionBreak";
import { usePublicState } from "@/components/usePublicState";
import type { PublicState, StandingRow } from "@/lib/types";

export function ScrimsClient({ initialState }: { initialState: PublicState }) {
  const state = usePublicState(initialState);
  const scrim = state.activeScrim;

  const splitPlayers = (value: string | undefined) =>
    typeof value === "string"
      ? value
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean)
      : undefined;

  const podiumItems = (scrim?.standings ?? [])
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

  const standingsColumns = [
    { key: "pos", header: "#", align: "right" as const, className: "w-14", cell: (r: StandingRow) => r.pos },
    { key: "team", header: "Equipo", cell: (r: StandingRow) => r.team },
    { key: "played", header: "PJ", align: "right" as const, cell: (r: StandingRow) => r.played ?? "—" },
    { key: "points", header: "Pts", align: "right" as const, cell: (r: StandingRow) => (typeof r.points === "number" ? r.points : "—") },
    { key: "kills", header: "Kills", align: "right" as const, cell: (r: StandingRow) => (typeof r.kills === "number" ? r.kills : "—") },
  ];

  return (
    <PublicShell>
      <PageHeader
        badge="Entrenamiento competitivo"
        title="Tablas de Scrims"
        subtitle="Scrims oficiales de MICTLAN ARENA. Todos los miércoles 7:00 PM (MX)."
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
        <Section
          title={scrim ? scrim.name : "Sin scrim activo"}
          subtitle={scrim ? scrim.status.toUpperCase() : "Cuando haya un scrim activo, aparecerá aquí."}
        >
          {scrim ? (
            <>
              <PodiumTop3 caption="Top 3" items={podiumItems} />
              <div className="mt-6" />
              <DataTable caption="Tabla de scrims" columns={standingsColumns} rows={scrim.standings} />
            </>
          ) : (
            <div className="rounded-2xl border border-card-border bg-card px-5 py-6 text-sm text-muted">
              No hay scrims activos en este momento.
            </div>
          )}
        </Section>

        <SectionBreak />

        <div className="grid gap-6 sm:grid-cols-3">
          <InfoCard title="Horario fijo">
            Las scrims se juegan todos los miércoles a las 7:00 PM (hora CDMX). Revisa Eventos para la siguiente fecha exacta.
          </InfoCard>
          <InfoCard title="Formato">
            Se publica el formato (Bo, mapas y reglas) por temporada. Únete a Discord para participar.
          </InfoCard>
          <InfoCard title="Tabla">
            La tabla muestra puntos por partida y kills acumuladas. Puede haber ajustes si se reportan incidencias.
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
