"use client";

import { PageHeader } from "@/components/PageHeader";
import { PublicShell } from "@/components/PublicShell";
import { Section } from "@/components/Section";
import { SectionBreak } from "@/components/SectionBreak";

export function NosotrosClient() {
  return (
    <PublicShell>
      <PageHeader
        badge="Comunidad"
        title="¿Quiénes somos?"
        subtitle="MICTLAN ARENA es una comunidad competitiva enfocada en torneos y scrims, con tablas y estadísticas claras para jugadores y equipos."
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
        <Section
          title="Nuestra misión"
          subtitle="Competir, mejorar y construir una escena sólida"
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
            <InfoCard title="Competitivo">
              Organizamos scrims y torneos con reglas claras, comunicación rápida y enfoque en fair play.
            </InfoCard>
            <InfoCard title="Transparencia">
              Tablas y estadísticas actualizadas para que los equipos puedan seguir su progreso.
            </InfoCard>
            <InfoCard title="Comunidad">
              Un espacio para encontrar equipo, entrenar y participar en eventos semanales.
            </InfoCard>
          </div>
        </Section>

        <SectionBreak />

        <Section title="¿Cómo participar?" subtitle="Pasos rápidos">
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="1) Entra a Discord">
              Ahí se publican anuncios, horarios, reglas y registro de scrims/torneos.
            </InfoCard>
            <InfoCard title="2) Juega las scrims">
              Todos los miércoles 7:00 PM (MX). Ve Eventos para la siguiente fecha exacta y conversiones.
            </InfoCard>
            <InfoCard title="3) Registra tu equipo">
              Puedes competir como equipo y aparecer en el ranking de Equipos y en Kills individuales.
            </InfoCard>
            <InfoCard title="4) Mantente al día">
              Las tablas se actualizan en vivo. Si hay cambios, se reflejan en cada página.
            </InfoCard>
          </div>
        </Section>
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

