"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { EditableTable } from "@/components/admin/EditableTable";
import type {
  Clan,
  PlayerKillsRow,
  PublicState,
  Scrim,
  StandingRow,
  TeamRankingRow,
  Tournament,
  UpcomingEvent,
  UpcomingVersus,
} from "@/lib/types";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "saving" }
  | { kind: "error"; message: string }
  | { kind: "ok"; message: string };

function emptyState(): PublicState {
  return {
    updatedAt: new Date().toISOString(),
    topPlayerKills: [],
    topTeams: [],
    upcomingScrims: [],
    upcomingTournaments: [],
    upcomingVersus: [],
    clanes: [],
  };
}

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [state, setState] = useState<PublicState | null>(null);

  const standingsColumns = useMemo(
    () => [
      { key: "pos", label: "Pos", type: "number" as const, width: "90px" },
      { key: "team", label: "Equipo", type: "text" as const, width: "minmax(220px, 1fr)" },
      {
        key: "players",
        label: "Jugadores",
        type: "text" as const,
        width: "minmax(280px, 1fr)",
        placeholder: "Jugador1, Jugador2, Jugador3",
      },
      { key: "played", label: "PJ", type: "number" as const, width: "90px" },
      { key: "wins", label: "G", type: "number" as const, width: "90px" },
      { key: "losses", label: "P", type: "number" as const, width: "90px" },
      { key: "points", label: "Pts", type: "number" as const, width: "90px" },
      { key: "kills", label: "Kills", type: "number" as const, width: "90px" },
    ],
    [],
  );

  const playerKillsColumns = useMemo(
    () => [
      { key: "pos", label: "Pos", type: "number" as const, width: "90px" },
      { key: "player", label: "Jugador", type: "text" as const, width: "minmax(220px, 1fr)" },
      { key: "team", label: "Equipo", type: "text" as const, width: "minmax(220px, 1fr)" },
      { key: "kills", label: "Kills", type: "number" as const, width: "90px" },
      { key: "matches", label: "Partidas", type: "number" as const, width: "110px" },
    ],
    [],
  );

  const teamColumns = useMemo(
    () => [
      { key: "pos", label: "Pos", type: "number" as const, width: "90px" },
      { key: "team", label: "Equipo", type: "text" as const, width: "minmax(220px, 1fr)" },
      {
        key: "players",
        label: "Jugadores",
        type: "text" as const,
        width: "minmax(280px, 1fr)",
        placeholder: "Jugador1, Jugador2, Jugador3",
      },
      { key: "points", label: "Pts", type: "number" as const, width: "90px" },
      { key: "kills", label: "Kills", type: "number" as const, width: "90px" },
      { key: "matches", label: "Partidas", type: "number" as const, width: "110px" },
    ],
    [],
  );

  const upcomingColumns = useMemo(
    () => [
      { key: "id", label: "ID", type: "text" as const, width: "180px" },
      { key: "title", label: "Título", type: "text" as const, width: "minmax(260px, 1fr)" },
      { key: "subtitle", label: "Subtítulo", type: "text" as const, width: "minmax(240px, 1fr)" },
      { key: "startsAt", label: "Inicio", type: "datetime" as const, width: "220px" },
    ],
    [],
  );

  const versusColumns = useMemo(
    () => [
      { key: "id", label: "ID", type: "text" as const, width: "180px" },
      { key: "teamA", label: "Equipo A", type: "text" as const, width: "minmax(240px, 1fr)" },
      { key: "teamB", label: "Equipo B", type: "text" as const, width: "minmax(240px, 1fr)" },
      { key: "startsAt", label: "Inicio", type: "datetime" as const, width: "220px" },
    ],
    [],
  );

  const clanesColumns = useMemo(
    () => [
      { key: "id", label: "ID", type: "text" as const, width: "180px" },
      { key: "name", label: "Nombre", type: "text" as const, width: "minmax(240px, 1fr)" },
    ],
    [],
  );

  async function load() {
    setStatus({ kind: "loading" });
    const res = await fetch("/api/admin/state", { cache: "no-store" });
    if (!res.ok) {
      setStatus({
        kind: "error",
        message: res.status === 401 ? "No autorizado. Inicia sesión." : "No se pudo cargar el estado.",
      });
      return;
    }
    const data = (await res.json()) as PublicState;
    setState(data);
    setStatus({ kind: "ok", message: "Estado cargado." });
  }

  async function login() {
    if (!email.trim() || !password) {
      setStatus({ kind: "error", message: "Ingresa email y contraseña." });
      return;
    }
    setStatus({ kind: "loading" });
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });
    if (!res.ok) {
      setStatus({ kind: "error", message: "Credenciales inválidas." });
      return;
    }
    await load();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
    setState(null);
    setStatus({ kind: "idle" });
    setPassword("");
  }

  async function save() {
    if (!state) return;
    setStatus({ kind: "saving" });
    const res = await fetch("/api/admin/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
    if (!res.ok) {
      setStatus({ kind: "error", message: res.status === 401 ? "Sesión expirada. Inicia sesión." : "Error al guardar." });
      return;
    }
    const next = (await res.json()) as PublicState;
    setState(next);
    setStatus({ kind: "ok", message: "Cambios guardados y publicados." });
  }

  const tournament = state?.activeTournament;
  const scrim = state?.activeScrim;

  return (
    <div className="min-h-full">
      <div className="border-b border-card-border bg-background/60 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-lg font-semibold tracking-tight">MICTLAN ARENA · Control</div>
              <div className="text-sm text-muted">
                Edita el contenido público en tiempo real. No está enlazado desde la web pública.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="rounded-full border border-card-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:border-brand/60"
              >
                Ver web
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-card-border bg-background/30 px-4 py-2 text-xs font-semibold transition-colors hover:border-brand/60"
              >
                Salir
              </button>
              <button
                type="button"
                onClick={save}
                disabled={!state || status.kind === "saving"}
                className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-brand-2 disabled:opacity-50"
              >
                Guardar cambios
              </button>
            </div>
          </div>

          {!state ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <div className="grid gap-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted">Email</div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tudominio.com"
                  className="w-full rounded-2xl border border-card-border bg-background/30 px-4 py-3 text-sm text-foreground outline-none focus:border-brand/60"
                />
              </div>
              <div className="grid gap-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted">Contraseña</div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  className="w-full rounded-2xl border border-card-border bg-background/30 px-4 py-3 text-sm text-foreground outline-none focus:border-brand/60"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={load}
                  disabled={status.kind === "loading"}
                  className="rounded-2xl border border-card-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand/60 disabled:opacity-50"
                >
                  Cargar
                </button>
                <button
                  type="button"
                  onClick={login}
                  disabled={status.kind === "loading"}
                  className="rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-brand-2 disabled:opacity-50"
                >
                  Entrar
                </button>
              </div>
              <div className="text-sm text-muted sm:col-span-3">
                {status.kind === "idle"
                  ? "Listo."
                  : status.kind === "loading"
                    ? "Cargando..."
                    : status.kind === "saving"
                      ? "Guardando..."
                      : status.kind === "ok"
                        ? status.message
                        : status.kind === "error"
                          ? status.message
                          : null}
              </div>
            </div>
          ) : (
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={load}
                disabled={status.kind === "loading"}
                className="rounded-2xl border border-card-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand/60 disabled:opacity-50"
              >
                Recargar
              </button>
              <div className="text-sm text-muted">
                {status.kind === "idle"
                  ? "Listo."
                  : status.kind === "loading"
                    ? "Cargando..."
                    : status.kind === "saving"
                      ? "Guardando..."
                      : status.kind === "ok"
                        ? status.message
                        : status.kind === "error"
                          ? status.message
                          : null}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-card-border bg-card p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-semibold">Torneo activo</div>
            <div className="flex items-center gap-2">
              {!tournament ? (
                <button
                  type="button"
                  onClick={() =>
                    setState((s) => ({
                      ...(s ?? emptyState()),
                      activeTournament: {
                        id: crypto.randomUUID(),
                        name: "Nuevo torneo",
                        status: "active",
                        startsAt: new Date().toISOString(),
                        standings: [],
                      } as Tournament,
                    }))
                  }
                  className="rounded-full border border-card-border bg-background/30 px-4 py-2 text-xs font-semibold transition-colors hover:border-brand/60"
                >
                  Crear torneo
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setState((s) => (s ? { ...s, activeTournament: undefined } : s))}
                  className="rounded-full border border-card-border bg-background/30 px-4 py-2 text-xs font-semibold text-danger transition-colors hover:border-danger/60"
                >
                  Quitar
                </button>
              )}
            </div>
          </div>

          {tournament ? (
            <div className="mt-4 grid gap-4">
              <div className="grid gap-3 md:grid-cols-3">
                <input
                  value={tournament.name}
                  onChange={(e) =>
                    setState((s) =>
                      s?.activeTournament
                        ? { ...s, activeTournament: { ...s.activeTournament, name: e.target.value } }
                        : s,
                    )
                  }
                  placeholder="Nombre"
                  className="rounded-xl border border-card-border bg-background/30 px-3 py-2 text-sm outline-none focus:border-brand/60"
                />
                <input
                  value={tournament.season ?? ""}
                  onChange={(e) =>
                    setState((s) =>
                      s?.activeTournament
                        ? {
                            ...s,
                            activeTournament: { ...s.activeTournament, season: e.target.value },
                          }
                        : s,
                    )
                  }
                  placeholder="Temporada (opcional)"
                  className="rounded-xl border border-card-border bg-background/30 px-3 py-2 text-sm outline-none focus:border-brand/60"
                />
                <select
                  value={tournament.status}
                  onChange={(e) =>
                    setState((s) =>
                      s?.activeTournament
                        ? {
                            ...s,
                            activeTournament: {
                              ...s.activeTournament,
                              status: e.target.value as Tournament["status"],
                            },
                          }
                        : s,
                    )
                  }
                  className="rounded-xl border border-card-border bg-background/30 px-3 py-2 text-sm outline-none focus:border-brand/60"
                >
                  <option value="active">Activo</option>
                  <option value="upcoming">Próximo</option>
                  <option value="finished">Finalizado</option>
                </select>
              </div>

              <EditableTable<StandingRow>
                title="Tabla (standings)"
                rows={tournament.standings}
                onChange={(rows) =>
                  setState((s) =>
                    s?.activeTournament
                      ? { ...s, activeTournament: { ...s.activeTournament, standings: rows } }
                      : s,
                  )
                }
                columns={standingsColumns}
                addRow={() => ({ pos: tournament.standings.length + 1, team: "", players: "" })}
              />
            </div>
          ) : (
            <div className="mt-4 text-sm text-muted">
              Sin torneo activo. Puedes crear uno y capturar su tabla.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-card-border bg-card p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-semibold">Scrim activo</div>
            <div className="flex items-center gap-2">
              {!scrim ? (
                <button
                  type="button"
                  onClick={() =>
                    setState((s) => ({
                      ...(s ?? emptyState()),
                      activeScrim: {
                        id: crypto.randomUUID(),
                        name: "Nuevo scrim",
                        status: "active",
                        startsAt: new Date().toISOString(),
                        standings: [],
                      } as Scrim,
                    }))
                  }
                  className="rounded-full border border-card-border bg-background/30 px-4 py-2 text-xs font-semibold transition-colors hover:border-brand/60"
                >
                  Crear scrim
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setState((s) => (s ? { ...s, activeScrim: undefined } : s))}
                  className="rounded-full border border-card-border bg-background/30 px-4 py-2 text-xs font-semibold text-danger transition-colors hover:border-danger/60"
                >
                  Quitar
                </button>
              )}
            </div>
          </div>

          {scrim ? (
            <div className="mt-4 grid gap-4">
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={scrim.name}
                  onChange={(e) =>
                    setState((s) =>
                      s?.activeScrim ? { ...s, activeScrim: { ...s.activeScrim, name: e.target.value } } : s,
                    )
                  }
                  placeholder="Nombre"
                  className="rounded-xl border border-card-border bg-background/30 px-3 py-2 text-sm outline-none focus:border-brand/60"
                />
                <select
                  value={scrim.status}
                  onChange={(e) =>
                    setState((s) =>
                      s?.activeScrim
                        ? {
                            ...s,
                            activeScrim: { ...s.activeScrim, status: e.target.value as Scrim["status"] },
                          }
                        : s,
                    )
                  }
                  className="rounded-xl border border-card-border bg-background/30 px-3 py-2 text-sm outline-none focus:border-brand/60"
                >
                  <option value="active">Activo</option>
                  <option value="upcoming">Próximo</option>
                  <option value="finished">Finalizado</option>
                </select>
              </div>

              <EditableTable<StandingRow>
                title="Tabla (standings)"
                rows={scrim.standings}
                onChange={(rows) =>
                  setState((s) =>
                    s?.activeScrim ? { ...s, activeScrim: { ...s.activeScrim, standings: rows } } : s,
                  )
                }
                columns={standingsColumns}
                addRow={() => ({ pos: scrim.standings.length + 1, team: "", players: "" })}
              />
            </div>
          ) : (
            <div className="mt-4 text-sm text-muted">
              Sin scrims activos. Puedes crear uno y capturar su tabla.
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <EditableTable<PlayerKillsRow>
            title="Kills individuales (top)"
            rows={state?.topPlayerKills ?? []}
            onChange={(rows) => setState((s) => ({ ...(s ?? emptyState()), topPlayerKills: rows }))}
            columns={playerKillsColumns}
            addRow={() => ({
              pos: (state?.topPlayerKills?.length ?? 0) + 1,
              player: "",
              team: "",
              kills: 0,
              matches: 0,
            })}
          />

          <EditableTable<TeamRankingRow>
            title="Ranking de equipos (top)"
            rows={state?.topTeams ?? []}
            onChange={(rows) => setState((s) => ({ ...(s ?? emptyState()), topTeams: rows }))}
            columns={teamColumns}
            addRow={() => ({
              pos: (state?.topTeams?.length ?? 0) + 1,
              team: "",
              players: "",
              points: 0,
              kills: 0,
              matches: 0,
            })}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <EditableTable<UpcomingEvent>
            title="Próximos scrims"
            rows={state?.upcomingScrims ?? []}
            onChange={(rows) => setState((s) => ({ ...(s ?? emptyState()), upcomingScrims: rows }))}
            columns={upcomingColumns}
            addRow={() => ({
              id: crypto.randomUUID(),
              title: "Nuevo scrim",
              subtitle: "",
              startsAt: new Date().toISOString(),
            })}
          />
          <EditableTable<UpcomingEvent>
            title="Próximos torneos"
            rows={state?.upcomingTournaments ?? []}
            onChange={(rows) => setState((s) => ({ ...(s ?? emptyState()), upcomingTournaments: rows }))}
            columns={upcomingColumns}
            addRow={() => ({
              id: crypto.randomUUID(),
              title: "Nuevo torneo",
              subtitle: "",
              startsAt: new Date().toISOString(),
            })}
          />
        </div>

        <EditableTable<UpcomingVersus>
          title="Próximos versus"
          rows={state?.upcomingVersus ?? []}
          onChange={(rows) => setState((s) => ({ ...(s ?? emptyState()), upcomingVersus: rows }))}
          columns={versusColumns}
          addRow={() => ({
            id: crypto.randomUUID(),
            teamA: "Equipo A",
            teamB: "Equipo B",
          })}
        />

        <EditableTable<Clan>
          title="Clanes oficiales"
          rows={state?.clanes ?? []}
          onChange={(rows) => setState((s) => ({ ...(s ?? emptyState()), clanes: rows }))}
          columns={clanesColumns}
          addRow={() => ({ id: crypto.randomUUID(), name: "Nuevo clan" })}
        />
      </div>
    </div>
  );
}

