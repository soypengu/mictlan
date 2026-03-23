"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/DataTable";
import { Hero } from "@/components/Hero";
import { ScheduleList } from "@/components/ScheduleList";
import { Section } from "@/components/Section";
import { TopNav } from "@/components/TopNav";
import type { PlayerKillsRow, PublicState, StandingRow, TeamRankingRow } from "@/lib/types";

export function PublicDashboard({ initialState }: { initialState: PublicState }) {
  const [state, setState] = useState<PublicState>(initialState);

  useEffect(() => {
    const es = new EventSource("/api/public/stream");
    const onState = (ev: MessageEvent<string>) => {
      try {
        const next = JSON.parse(ev.data) as PublicState;
        setState(next);
      } catch {}
    };
    es.addEventListener("state", onState as EventListener);
    es.onerror = () => {};
    return () => es.close();
  }, []);

  const standingsColumns = useMemo(
    () => [
      {
        key: "pos",
        header: "#",
        align: "right" as const,
        className: "w-14",
        cell: (r: StandingRow) => <span className="text-muted">{r.pos}</span>,
      },
      { key: "team", header: "Equipo", cell: (r: StandingRow) => r.team },
      {
        key: "played",
        header: "PJ",
        align: "right" as const,
        cell: (r: StandingRow) => r.played ?? "—",
      },
      {
        key: "wins",
        header: "G",
        align: "right" as const,
        cell: (r: StandingRow) => (typeof r.wins === "number" ? r.wins : "—"),
      },
      {
        key: "losses",
        header: "P",
        align: "right" as const,
        cell: (r: StandingRow) => (typeof r.losses === "number" ? r.losses : "—"),
      },
      {
        key: "points",
        header: "Pts",
        align: "right" as const,
        cell: (r: StandingRow) => (typeof r.points === "number" ? r.points : "—"),
      },
      {
        key: "kills",
        header: "Kills",
        align: "right" as const,
        cell: (r: StandingRow) => (typeof r.kills === "number" ? r.kills : "—"),
      },
    ],
    [],
  );

  const playerKillsColumns = useMemo(
    () => [
      {
        key: "pos",
        header: "#",
        align: "right" as const,
        className: "w-14",
        cell: (r: PlayerKillsRow) => <span className="text-muted">{r.pos}</span>,
      },
      { key: "player", header: "Jugador", cell: (r: PlayerKillsRow) => r.player },
      {
        key: "team",
        header: "Equipo",
        cell: (r: PlayerKillsRow) => r.team ?? "—",
      },
      {
        key: "kills",
        header: "Kills",
        align: "right" as const,
        cell: (r: PlayerKillsRow) => r.kills,
      },
      {
        key: "matches",
        header: "Partidas",
        align: "right" as const,
        cell: (r: PlayerKillsRow) => (typeof r.matches === "number" ? r.matches : "—"),
      },
    ],
    [],
  );

  const teamColumns = useMemo(
    () => [
      {
        key: "pos",
        header: "#",
        align: "right" as const,
        className: "w-14",
        cell: (r: TeamRankingRow) => <span className="text-muted">{r.pos}</span>,
      },
      { key: "team", header: "Equipo", cell: (r: TeamRankingRow) => r.team },
      {
        key: "points",
        header: "Pts",
        align: "right" as const,
        cell: (r: TeamRankingRow) => (typeof r.points === "number" ? r.points : "—"),
      },
      {
        key: "kills",
        header: "Kills",
        align: "right" as const,
        cell: (r: TeamRankingRow) => (typeof r.kills === "number" ? r.kills : "—"),
      },
      {
        key: "matches",
        header: "Partidas",
        align: "right" as const,
        cell: (r: TeamRankingRow) => (typeof r.matches === "number" ? r.matches : "—"),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-1 flex-col">
      <TopNav />
      <main className="flex-1">
        <Hero />

        <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
          <div className="grid gap-10">
            <Section
              id="torneos"
              title="Tablas de Torneos"
              subtitle={state.activeTournament ? state.activeTournament.name : "Sin torneo activo"}
            >
              {state.activeTournament ? (
                <DataTable
                  caption="Tabla del torneo"
                  columns={standingsColumns}
                  rows={state.activeTournament.standings}
                />
              ) : (
                <div className="rounded-2xl border border-card-border bg-card px-5 py-6 text-sm text-muted">
                  No hay un torneo activo en este momento.
                </div>
              )}
            </Section>

            <Section
              id="scrims"
              title="Tablas de Scrims"
              subtitle={state.activeScrim ? state.activeScrim.name : "Sin scrim activo"}
            >
              {state.activeScrim ? (
                <DataTable
                  caption="Tabla de scrims"
                  columns={standingsColumns}
                  rows={state.activeScrim.standings}
                />
              ) : (
                <div className="rounded-2xl border border-card-border bg-card px-5 py-6 text-sm text-muted">
                  No hay scrims activos en este momento.
                </div>
              )}
            </Section>

            <div id="rankings" className="grid gap-10 lg:grid-cols-2 scroll-mt-24">
              <Section title="Kills Individuales" subtitle="Top jugadores por kills">
                <DataTable
                  caption="Ranking de kills individuales"
                  columns={playerKillsColumns}
                  rows={state.topPlayerKills}
                />
              </Section>
              <Section id="equipos" title="Equipos" subtitle="Ranking general por puntos/kills">
                <DataTable caption="Ranking de equipos" columns={teamColumns} rows={state.topTeams} />
              </Section>
            </div>

            <div id="proximos" className="grid gap-10 lg:grid-cols-2 scroll-mt-24">
              <Section title="Próximos Scrims" subtitle="Fechas y horarios confirmados">
                <ScheduleList items={state.upcomingScrims} emptyLabel="No hay scrims próximos." />
              </Section>
              <Section title="Próximos Torneos" subtitle="Calendario de competencias">
                <ScheduleList
                  items={state.upcomingTournaments}
                  emptyLabel="No hay torneos próximos."
                />
              </Section>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-card-border bg-background/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-10 text-xs text-muted sm:px-6">
          <div>© {new Date().getFullYear()} MICTLAN ARENA</div>
          <a
            href="#inicio"
            className="rounded-full border border-card-border bg-card px-3 py-1 transition-colors hover:border-brand/60"
          >
            Volver arriba
          </a>
        </div>
      </footer>
    </div>
  );
}

