"use client";

import { PageHeader } from "@/components/PageHeader";
import { PublicShell } from "@/components/PublicShell";
import { Section } from "@/components/Section";
import { usePublicState } from "@/components/usePublicState";
import type { PublicState } from "@/lib/types";

export function ClanesClient({ initialState }: { initialState: PublicState }) {
  const state = usePublicState(initialState);
  const clanes = state.clanes ?? [];

  return (
    <PublicShell>
      <PageHeader badge="Comunidad" title="Clanes" subtitle="Clanes oficiales" />
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
        <Section title="Clanes oficiales" subtitle="Listado próximamente">
          {clanes.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {clanes.map((c) => (
                <div key={c.id} className="rounded-2xl border border-card-border bg-card/70 px-5 py-5 backdrop-blur">
                  <div className="text-sm font-semibold">{c.name}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-card-border bg-card px-5 py-6 text-sm text-muted">
              Próximamente
            </div>
          )}
        </Section>
      </div>
    </PublicShell>
  );
}
