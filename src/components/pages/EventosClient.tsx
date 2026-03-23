"use client";

import { PageHeader } from "@/components/PageHeader";
import { PublicShell } from "@/components/PublicShell";
import { ScheduleList } from "@/components/ScheduleList";
import { Section } from "@/components/Section";
import { SectionBreak } from "@/components/SectionBreak";
import { usePublicState } from "@/components/usePublicState";
import type { PublicState } from "@/lib/types";

export function EventosClient({ initialState }: { initialState: PublicState }) {
  const state = usePublicState(initialState);

  return (
    <PublicShell>
      <PageHeader
        badge="Calendario"
        title="Próximos Eventos"
        subtitle="Scrims próximos. Si un evento cambia, se verá reflejado aquí."
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
        <Section title="Próximos Scrims" subtitle="Todos los miércoles">
          <ScheduleList items={state.upcomingScrims} emptyLabel="No hay scrims próximos." />
        </Section>

        <SectionBreak />

        <Section
          title="Torneos"
          subtitle="Próximamente"
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
          <div className="text-sm leading-7 text-muted">
            Estamos preparando los siguientes torneos y clasificatorios. Las fechas oficiales, requisitos y
            registro se publican primero en Discord.
          </div>
        </Section>

        <SectionBreak />

        <div className="grid gap-6 sm:grid-cols-3">
          <InfoCard title="Scrims semanales">
            Todos los miércoles 7:00 PM (MX). Los lobbies, formato y reglas se coordinan en Discord.
          </InfoCard>
          <InfoCard title="Torneos">
            Próximamente. Aún no confirmamos fechas; los anuncios oficiales se publican primero en Discord.
          </InfoCard>
          <InfoCard title="Soporte">
            Si detectas un error en un horario o tabla, repórtalo en Discord para corrección rápida.
          </InfoCard>
        </div>
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
