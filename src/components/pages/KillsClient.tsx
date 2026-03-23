"use client";

import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/PageHeader";
import { PodiumTop3 } from "@/components/PodiumTop3";
import { PublicShell } from "@/components/PublicShell";
import { Section } from "@/components/Section";
import { SectionBreak } from "@/components/SectionBreak";
import { usePublicState } from "@/components/usePublicState";
import type { PlayerKillsRow, PublicState } from "@/lib/types";

export function KillsClient({ initialState }: { initialState: PublicState }) {
  const state = usePublicState(initialState);

  const podiumItems = state.topPlayerKills
    .filter((r) => r.pos >= 1 && r.pos <= 3)
    .slice()
    .sort((a, b) => a.pos - b.pos)
    .slice(0, 3)
    .map((r) => ({
      pos: r.pos as 1 | 2 | 3,
      title: r.player,
      subtitle: r.team ? r.team : "Sin equipo",
      stats: [
        { label: "Kills", value: r.kills },
        { label: "Partidas", value: typeof r.matches === "number" ? r.matches : "—" },
      ],
    }));

  const columns = [
    { key: "pos", header: "#", align: "right" as const, className: "w-14", cell: (r: PlayerKillsRow) => r.pos },
    { key: "player", header: "Jugador", cell: (r: PlayerKillsRow) => r.player },
    { key: "team", header: "Equipo", cell: (r: PlayerKillsRow) => r.team ?? "—" },
    { key: "kills", header: "Kills", align: "right" as const, cell: (r: PlayerKillsRow) => r.kills },
    { key: "matches", header: "Partidas", align: "right" as const, cell: (r: PlayerKillsRow) => (typeof r.matches === "number" ? r.matches : "—") },
  ];

  return (
    <PublicShell>
      <PageHeader
        badge="Estadísticas"
        title="Kills Individuales"
        subtitle="Ranking de jugadores por kills acumuladas en torneos y scrims."
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
        <Section title="Top Kills" subtitle="Actualizado en vivo">
          <PodiumTop3 caption="Top 3" items={podiumItems} />
          <div className="mt-6" />
          <DataTable caption="Ranking de kills individuales" columns={columns} rows={state.topPlayerKills} />
        </Section>

        <SectionBreak />

        <div className="grid gap-6 sm:grid-cols-3">
          <InfoCard title="Transparencia">
            Se publican capturas y reportes en Discord para validar resultados y estadísticas.
          </InfoCard>
          <InfoCard title="Reglas">
            Kills inválidas (por desconexión, bug o sanción) pueden ser removidas por administración.
          </InfoCard>
          <InfoCard title="Participa">
            Para aparecer en el ranking, participa en scrims oficiales y torneos publicados en Eventos.
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
