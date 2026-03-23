"use client";

import { PageHeader } from "@/components/PageHeader";
import { PublicShell } from "@/components/PublicShell";
import { Section } from "@/components/Section";
import { SectionBreak } from "@/components/SectionBreak";

export function DireccionClient() {
  return (
    <PublicShell>
      <PageHeader
        badge="Organización"
        title="Dirección"
        subtitle="Conoce quién está a cargo del proyecto y dónde seguir las novedades."
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
        <Section title="Coordinación" subtitle="Encargado principal">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 rounded-2xl border border-card-border bg-card px-6 py-6">
              <div className="text-sm text-muted">Encargado</div>
              <div className="mt-1 text-2xl font-semibold tracking-tight">SoyPengu</div>
              <div className="mt-4 text-sm leading-7 text-muted">
                Gestión de la comunidad, coordinación de scrims y torneos, y publicación de tablas/estadísticas.
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://www.tiktok.com/@soypengu"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-card-border bg-background/30 px-5 py-3 text-sm font-semibold transition-colors hover:border-brand/60"
                >
                  TikTok
                </a>
                <a
                  href="https://www.youtube.com/@soypengu"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-brand-2"
                >
                  YouTube
                </a>
                <a
                  href="https://www.instagram.com/soypengu"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-card-border bg-background/30 px-5 py-3 text-sm font-semibold transition-colors hover:border-brand/60"
                >
                  Instagram
                </a>
                <a
                  href="https://x.com/soypengu"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-card-border bg-background/30 px-5 py-3 text-sm font-semibold transition-colors hover:border-brand/60"
                >
                  X
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-card-border bg-card px-5 py-6">
              <div className="text-sm font-semibold">Contacto</div>
              <div className="mt-2 text-sm leading-7 text-muted">
                Para dudas, registro y soporte, la vía oficial es Discord.
              </div>
              <a
                href="https://discord.com/"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-card-border bg-background/30 px-5 py-3 text-sm font-semibold transition-colors hover:border-brand/60"
              >
                Abrir Discord
              </a>
            </div>
          </div>
        </Section>

        <SectionBreak />

        <Section title="Créditos" subtitle="MICTLAN ARENA">
          <div className="grid gap-6 md:grid-cols-3">
            <InfoCard title="Diseño">
              Estética futurista/ancestral, enfoque en claridad de datos, y navegación por secciones/páginas.
            </InfoCard>
            <InfoCard title="Operación">
              Actualizaciones en vivo desde el panel de control. El contenido público se mantiene sincronizado.
            </InfoCard>
            <InfoCard title="Comunidad">
              Creada para impulsar competencia constante y una escena fuerte en LATAM.
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
