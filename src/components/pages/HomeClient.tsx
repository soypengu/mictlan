"use client";

import Link from "next/link";

import { Hero } from "@/components/Hero";
import { PublicShell } from "@/components/PublicShell";
import { ScheduleList } from "@/components/ScheduleList";
import { Section } from "@/components/Section";
import { SectionBreak } from "@/components/SectionBreak";
import { usePublicState } from "@/components/usePublicState";
import type { PublicState } from "@/lib/types";

export function HomeClient({ initialState }: { initialState: PublicState }) {
  const state = usePublicState(initialState);
  const versusItems = Array.isArray(state.upcomingVersus) && state.upcomingVersus.length ? state.upcomingVersus : [];

  return (
    <PublicShell>
      <Hero />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
        <Section
          title="Próximos eventos"
          subtitle="Scrims · Todos los miércoles"
          borderless
          actions={
            <Link
              href="/eventos"
              className="inline-flex items-center justify-center rounded-full border border-card-border bg-card px-4 py-2 text-sm font-semibold transition-colors hover:border-brand/60"
            >
              Ver calendario
            </Link>
          }
        >
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
                Scrims
              </div>
              <ScheduleList items={state.upcomingScrims} emptyLabel="No hay scrims próximos." />
            </div>
            <div className="rounded-2xl border border-card-border bg-background/20 px-5 py-5 backdrop-blur">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted">
                Torneos
              </div>
              <div className="mt-2 text-sm font-semibold">Próximamente</div>
              <div className="mt-2 text-sm leading-7 text-muted">
                Aún no confirmamos fechas. Los anuncios oficiales se publican primero en Discord.
              </div>
              <a
                href="https://discord.com/"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-brand-2"
              >
                Unirse a Discord
              </a>
            </div>
          </div>
        </Section>

        <SectionBreak />

        <Section
          title="Próximos versus"
          subtitle="Enfrentamientos por anunciar"
          actions={
            <a
              href="https://discord.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-card-border bg-background/30 px-4 py-2 text-sm font-semibold transition-colors hover:border-brand/60"
            >
              Ver en Discord
            </a>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            {(versusItems.length ? versusItems : [{ id: "placeholder-1", teamA: "Equipo A", teamB: "Equipo B" }]).map(
              (m) => (
                <VersusCard
                  key={m.id}
                  teamA={m.teamA || "Equipo A"}
                  teamB={m.teamB || "Equipo B"}
                  startsAt={m.startsAt}
                />
              ),
            )}
          </div>
        </Section>

        <SectionBreak />

        <Section
          title="Miércoles · 7:00 PM (MX)"
          subtitle="Horarios de las scrims semanales de cada miércoles. Convertimos la hora para países de LATAM usando la próxima fecha."
          unstyled
          actions={
            <Link
              href="/scrims"
              className="inline-flex items-center justify-center rounded-full border border-card-border bg-background/30 px-4 py-2 text-sm font-semibold transition-colors hover:border-brand/60"
            >
              Ver scrims
            </Link>
          }
        >
          <LatamTimeTable />
        </Section>

        <SectionBreak />

        <Section
          title="¿Quiénes somos?"
          subtitle="Comunidad competitiva de esports en LATAM"
          actions={
            <a
              href="https://discord.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-brand-2"
            >
              Unirse a Discord
            </a>
          }
        >
          <div className="grid gap-6 md:grid-cols-3">
            <InfoCard title="Tablas y stats">
              Torneos, scrims, kills y ranking de equipos en páginas separadas para ver todo claro.
            </InfoCard>
            <InfoCard title="Eventos constantes">
              Scrims semanales y torneos publicados con anticipación. Todo se comunica por Discord.
            </InfoCard>
            <InfoCard title="Staff">
              Conoce quién está detrás del proyecto y dónde seguir las novedades.
              <div className="mt-4 flex gap-2">
                <Link
                  href="/nosotros"
                  className="rounded-full border border-card-border bg-background/30 px-3 py-1 text-xs font-semibold transition-colors hover:border-brand/60"
                >
                  Comunidad
                </Link>
                <Link
                  href="/direccion"
                  className="rounded-full border border-card-border bg-background/30 px-3 py-1 text-xs font-semibold transition-colors hover:border-brand/60"
                >
                  Dirección
                </Link>
              </div>
            </InfoCard>
          </div>
        </Section>
      </div>
    </PublicShell>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-card-border bg-background/10 px-5 py-5 backdrop-blur">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-2 text-sm leading-7 text-muted">{children}</div>
    </div>
  );
}

function VersusCard({ teamA, teamB, startsAt }: { teamA: string; teamB: string; startsAt?: string }) {
  const label = startsAt
    ? new Intl.DateTimeFormat("es-MX", {
        weekday: "short",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(startsAt))
    : "Próximamente";

  return (
    <div className="rounded-2xl border border-card-border bg-card/55 px-5 py-5 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted">Próximo versus</div>
        <div className="rounded-full border border-card-border bg-background/20 px-3 py-1 text-xs font-semibold text-muted">
          {label}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <VersusTeam name={teamA} align="left" />
        <div className="rounded-full border border-card-border bg-background/20 px-4 py-2 text-sm font-semibold text-muted">VS</div>
        <VersusTeam name={teamB} align="right" />
      </div>
    </div>
  );
}

function VersusTeam({ name, align }: { name: string; align: "left" | "right" }) {
  return (
    <div
      className={[
        "flex min-w-0 items-center gap-3",
        align === "right" ? "flex-row-reverse text-right" : "",
      ].join(" ")}
    >
      <div className="h-12 w-12 shrink-0 rounded-2xl border border-card-border bg-background/30" />
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{name}</div>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">Próximamente</div>
      </div>
    </div>
  );
}

type ZoneItem = { label: string; timeZone: string };

const zones: ZoneItem[] = [
  { label: "México (CDMX)", timeZone: "America/Mexico_City" },
  { label: "Guatemala", timeZone: "America/Guatemala" },
  { label: "El Salvador", timeZone: "America/El_Salvador" },
  { label: "Honduras", timeZone: "America/Tegucigalpa" },
  { label: "Nicaragua", timeZone: "America/Managua" },
  { label: "Costa Rica", timeZone: "America/Costa_Rica" },
  { label: "Panamá", timeZone: "America/Panama" },
  { label: "Colombia", timeZone: "America/Bogota" },
  { label: "Perú", timeZone: "America/Lima" },
  { label: "Ecuador", timeZone: "America/Guayaquil" },
  { label: "Bolivia", timeZone: "America/La_Paz" },
  { label: "Venezuela", timeZone: "America/Caracas" },
  { label: "Chile", timeZone: "America/Santiago" },
  { label: "Argentina", timeZone: "America/Argentina/Buenos_Aires" },
  { label: "Uruguay", timeZone: "America/Montevideo" },
  { label: "Paraguay", timeZone: "America/Asuncion" },
  { label: "Rep. Dominicana", timeZone: "America/Santo_Domingo" },
  { label: "Puerto Rico", timeZone: "America/Puerto_Rico" },
  { label: "Brasil (São Paulo)", timeZone: "America/Sao_Paulo" },
];

function LatamTimeTable() {
  const scrimUtc = getNextScrimUtc();

  const fmtDate = (timeZone: string) =>
    new Intl.DateTimeFormat("es-MX", {
      timeZone,
      weekday: "short",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(scrimUtc);

  return (
    <div className="overflow-hidden rounded-2xl border border-card-border bg-background/10 backdrop-blur">
      <div className="overflow-x-auto">
        <table className="w-full text-sm sm:min-w-[640px]">
          <thead className="border-b border-card-border bg-background/20">
            <tr>
              <th className="whitespace-nowrap px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted sm:px-4 sm:py-3">
                País
              </th>
              <th className="whitespace-nowrap px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-muted sm:px-4 sm:py-3">
                Hora local
              </th>
            </tr>
          </thead>
          <tbody>
            {zones.map((z) => (
              <tr
                key={z.timeZone}
                className="border-b border-card-border/70 last:border-b-0 hover:bg-background/10"
              >
                <td className="whitespace-nowrap px-3 py-2.5 sm:px-4 sm:py-3">{z.label}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right text-muted sm:px-4 sm:py-3">
                  {fmtDate(z.timeZone)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getNextScrimUtc() {
  const now = new Date();
  const baseTz = "America/Mexico_City";
  const weekdayFmt = new Intl.DateTimeFormat("en-US", { timeZone: baseTz, weekday: "short" });
  const ymdFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: baseTz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  for (let i = 0; i < 14; i++) {
    const probe = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const wd = weekdayFmt.format(probe);
    if (wd !== "Wed") continue;
    const parts = ymdFmt.formatToParts(probe);
    const y = Number(parts.find((p) => p.type === "year")?.value);
    const m = Number(parts.find((p) => p.type === "month")?.value);
    const d = Number(parts.find((p) => p.type === "day")?.value);
    const scrim = zonedTimeToUtc({ year: y, month: m, day: d, hour: 19, minute: 0 }, baseTz);
    if (scrim.getTime() > now.getTime()) return scrim;
  }

  const fallback = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const parts = ymdFmt.formatToParts(fallback);
  const y = Number(parts.find((p) => p.type === "year")?.value);
  const m = Number(parts.find((p) => p.type === "month")?.value);
  const d = Number(parts.find((p) => p.type === "day")?.value);
  return zonedTimeToUtc({ year: y, month: m, day: d, hour: 19, minute: 0 }, baseTz);
}

function zonedTimeToUtc(
  input: { year: number; month: number; day: number; hour: number; minute: number },
  timeZone: string,
) {
  const utcGuess = new Date(Date.UTC(input.year, input.month - 1, input.day, input.hour, input.minute));
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(utcGuess);

  const y = Number(parts.find((p) => p.type === "year")?.value);
  const m = Number(parts.find((p) => p.type === "month")?.value);
  const d = Number(parts.find((p) => p.type === "day")?.value);
  const h = Number(parts.find((p) => p.type === "hour")?.value);
  const min = Number(parts.find((p) => p.type === "minute")?.value);

  const asUtc = Date.UTC(y, m - 1, d, h, min);
  const offset = asUtc - utcGuess.getTime();
  return new Date(utcGuess.getTime() - offset);
}
