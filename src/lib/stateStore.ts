import { EventEmitter } from "node:events";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import { ensureDbSchema } from "@/lib/dbSchema";
import { getPool } from "@/lib/db";
import { mockState } from "@/lib/mockState";
import type { PublicState } from "@/lib/types";

const dataDir = path.join(process.cwd(), "data");
const statePath = path.join(dataDir, "state.json");
const tmpPath = path.join(dataDir, "state.tmp.json");

type StoreGlobal = {
  emitter: EventEmitter;
  cache: PublicState | null;
};

const store: StoreGlobal = (() => {
  const g = globalThis as unknown as { __MICTLAN_ARENA_STORE__?: StoreGlobal };
  if (!g.__MICTLAN_ARENA_STORE__) {
    g.__MICTLAN_ARENA_STORE__ = { emitter: new EventEmitter(), cache: null };
  }
  return g.__MICTLAN_ARENA_STORE__;
})();

async function ensureDir() {
  await mkdir(dataDir, { recursive: true });
}

function normalizeState(input: Partial<PublicState>): PublicState {
  const updatedAt = typeof input.updatedAt === "string" ? input.updatedAt : new Date().toISOString();
  return {
    updatedAt,
    activeTournament: input.activeTournament,
    activeScrim: input.activeScrim,
    topPlayerKills: Array.isArray(input.topPlayerKills) ? input.topPlayerKills : [],
    topTeams: Array.isArray(input.topTeams) ? input.topTeams : [],
    upcomingScrims: Array.isArray(input.upcomingScrims) ? input.upcomingScrims : [],
    upcomingTournaments: Array.isArray(input.upcomingTournaments) ? input.upcomingTournaments : [],
    upcomingVersus: Array.isArray(input.upcomingVersus) ? input.upcomingVersus : [],
    clanes: Array.isArray(input.clanes) ? input.clanes : [],
  };
}

type DbMetaRow = {
  updated_at: Date;
  active_tournament_id: string | null;
  active_scrim_id: string | null;
};

type DbTournamentRow = { id: string; name: string; season: string | null; status: string; starts_at: Date | null };
type DbScrimRow = { id: string; name: string; status: string; starts_at: Date | null };
type DbTournamentStandingRow = {
  pos: number;
  team: string;
  players: string | null;
  played: number | null;
  wins: number | null;
  losses: number | null;
  points: number | null;
  kills: number | null;
};
type DbScrimStandingRow = {
  pos: number;
  team: string;
  players: string | null;
  played: number | null;
  points: number | null;
  kills: number | null;
};
type DbPlayerKillsRow = { pos: number; player: string; team: string | null; kills: number; matches: number | null };
type DbTeamRankingRow = {
  pos: number;
  team: string;
  players: string | null;
  points: number | null;
  kills: number | null;
  matches: number | null;
};
type DbUpcomingEventRow = { id: string; title: string; subtitle: string | null; startsAt: Date };
type DbUpcomingVersusRow = { id: string; teamA: string; teamB: string; startsAt: Date | null };
type DbClanRow = { id: string; name: string };

type LegacyGlobal = { triedImport: boolean };

function getLegacyGlobal(): LegacyGlobal {
  const g = globalThis as unknown as { __MICTLAN_LEGACY_IMPORT__?: LegacyGlobal };
  if (!g.__MICTLAN_LEGACY_IMPORT__) g.__MICTLAN_LEGACY_IMPORT__ = { triedImport: false };
  return g.__MICTLAN_LEGACY_IMPORT__;
}

function hasDb() {
  return typeof process.env.DATABASE_URL === "string" && process.env.DATABASE_URL.length > 0;
}

async function importLegacyIfPossible() {
  const legacy = getLegacyGlobal();
  if (legacy.triedImport) return;
  legacy.triedImport = true;
  try {
    const raw = await readFile(statePath, "utf8");
    const parsed = JSON.parse(raw) as PublicState;
    await setStateDb(normalizeState(parsed));
  } catch {}
}

async function getStateDb(): Promise<PublicState> {
  await ensureDbSchema();
  await importLegacyIfPossible();
  const pool = getPool();

  const metaRes = await pool.query<DbMetaRow>(
    "SELECT updated_at, active_tournament_id, active_scrim_id FROM public_meta WHERE id = 'main' LIMIT 1",
  );
  const meta = metaRes.rows[0];
  const updatedAt = meta?.updated_at ? meta.updated_at.toISOString() : new Date().toISOString();

  const tournamentId = meta?.active_tournament_id ?? null;
  const scrimId = meta?.active_scrim_id ?? null;

  const tournamentRow = tournamentId
    ? (
        await pool.query<DbTournamentRow>(
          "SELECT id, name, season, status, starts_at FROM tournaments WHERE id = $1 LIMIT 1",
          [tournamentId],
        )
      ).rows[0]
    : null;

  const tournamentStandings = tournamentId
    ? (
        await pool.query<DbTournamentStandingRow>(
          "SELECT pos, team, players, played, wins, losses, points, kills FROM tournament_standings WHERE tournament_id = $1 ORDER BY pos ASC",
          [tournamentId],
        )
      ).rows
    : [];

  const scrimRow = scrimId
    ? (
        await pool.query<DbScrimRow>("SELECT id, name, status, starts_at FROM scrims WHERE id = $1 LIMIT 1", [scrimId])
      ).rows[0]
    : null;

  const scrimStandings = scrimId
    ? (
        await pool.query<DbScrimStandingRow>(
          "SELECT pos, team, players, played, points, kills FROM scrim_standings WHERE scrim_id = $1 ORDER BY pos ASC",
          [scrimId],
        )
      ).rows
    : [];

  const topPlayerKills = (
    await pool.query<DbPlayerKillsRow>("SELECT pos, player, team, kills, matches FROM player_kills ORDER BY pos ASC")
  ).rows;
  const topTeams = (
    await pool.query<DbTeamRankingRow>("SELECT pos, team, players, points, kills, matches FROM team_rankings ORDER BY pos ASC")
  ).rows;
  const upcomingScrims = (
    await pool.query<DbUpcomingEventRow>(
      "SELECT id, title, subtitle, starts_at as \"startsAt\" FROM upcoming_scrims ORDER BY starts_at ASC",
    )
  ).rows;
  const upcomingTournaments = (
    await pool.query<DbUpcomingEventRow>(
      "SELECT id, title, subtitle, starts_at as \"startsAt\" FROM upcoming_tournaments ORDER BY starts_at ASC",
    )
  ).rows;
  const upcomingVersus = (
    await pool.query<DbUpcomingVersusRow>(
      "SELECT id, team_a as \"teamA\", team_b as \"teamB\", starts_at as \"startsAt\" FROM upcoming_versus ORDER BY id ASC",
    )
  ).rows;
  const clanes = (await pool.query<DbClanRow>("SELECT id, name FROM official_clans ORDER BY name ASC")).rows;

  return normalizeState({
    updatedAt,
    activeTournament: tournamentRow
      ? {
          id: tournamentRow.id,
          name: tournamentRow.name,
          season: tournamentRow.season ?? undefined,
          status: tournamentRow.status as "active" | "upcoming" | "finished",
          startsAt: tournamentRow.starts_at ? tournamentRow.starts_at.toISOString() : undefined,
          standings: tournamentStandings.map((r) => ({
            pos: r.pos,
            team: r.team,
            players: r.players ?? undefined,
            played: r.played ?? undefined,
            wins: r.wins ?? undefined,
            losses: r.losses ?? undefined,
            points: r.points ?? undefined,
            kills: r.kills ?? undefined,
          })),
        }
      : undefined,
    activeScrim: scrimRow
      ? {
          id: scrimRow.id,
          name: scrimRow.name,
          status: scrimRow.status as "active" | "upcoming" | "finished",
          startsAt: scrimRow.starts_at ? scrimRow.starts_at.toISOString() : undefined,
          standings: scrimStandings.map((r) => ({
            pos: r.pos,
            team: r.team,
            players: r.players ?? undefined,
            played: r.played ?? undefined,
            points: r.points ?? undefined,
            kills: r.kills ?? undefined,
          })),
        }
      : undefined,
    topPlayerKills: topPlayerKills.map((r) => ({
      pos: r.pos,
      player: r.player,
      team: r.team ?? undefined,
      kills: r.kills,
      matches: r.matches ?? undefined,
    })),
    topTeams: topTeams.map((r) => ({
      pos: r.pos,
      team: r.team,
      players: r.players ?? undefined,
      points: r.points ?? undefined,
      kills: r.kills ?? undefined,
      matches: r.matches ?? undefined,
    })),
    upcomingScrims: upcomingScrims.map((r) => ({
      id: r.id,
      title: r.title,
      subtitle: r.subtitle ?? undefined,
      startsAt: r.startsAt.toISOString(),
    })),
    upcomingTournaments: upcomingTournaments.map((r) => ({
      id: r.id,
      title: r.title,
      subtitle: r.subtitle ?? undefined,
      startsAt: r.startsAt.toISOString(),
    })),
    upcomingVersus: upcomingVersus.map((r) => ({
      id: r.id,
      teamA: r.teamA,
      teamB: r.teamB,
      startsAt: r.startsAt ? r.startsAt.toISOString() : undefined,
    })),
    clanes: clanes.map((c) => ({ id: c.id, name: c.name })),
  });
}

async function setStateDb(next: PublicState): Promise<PublicState> {
  await ensureDbSchema();
  const pool = getPool();
  const normalized = { ...normalizeState(next), updatedAt: new Date().toISOString() };

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM tournament_standings");
    await client.query("DELETE FROM tournaments");
    await client.query("DELETE FROM scrim_standings");
    await client.query("DELETE FROM scrims");
    await client.query("DELETE FROM player_kills");
    await client.query("DELETE FROM team_rankings");
    await client.query("DELETE FROM upcoming_scrims");
    await client.query("DELETE FROM upcoming_tournaments");
    await client.query("DELETE FROM upcoming_versus");
    await client.query("DELETE FROM official_clans");

    let activeTournamentId: string | null = null;
    if (normalized.activeTournament) {
      const t = normalized.activeTournament;
      activeTournamentId = t.id;
      await client.query(
        "INSERT INTO tournaments (id, name, season, status, starts_at) VALUES ($1, $2, $3, $4, $5)",
        [t.id, t.name, t.season ?? null, t.status, t.startsAt ?? null],
      );
      for (const r of t.standings ?? []) {
        await client.query(
          "INSERT INTO tournament_standings (tournament_id, pos, team, players, played, wins, losses, points, kills) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
          [t.id, r.pos, r.team, r.players ?? null, r.played ?? null, r.wins ?? null, r.losses ?? null, r.points ?? null, r.kills ?? null],
        );
      }
    }

    let activeScrimId: string | null = null;
    if (normalized.activeScrim) {
      const s = normalized.activeScrim;
      activeScrimId = s.id;
      await client.query("INSERT INTO scrims (id, name, status, starts_at) VALUES ($1,$2,$3,$4)", [
        s.id,
        s.name,
        s.status,
        s.startsAt ?? null,
      ]);
      for (const r of s.standings ?? []) {
        await client.query(
          "INSERT INTO scrim_standings (scrim_id, pos, team, players, played, points, kills) VALUES ($1,$2,$3,$4,$5,$6,$7)",
          [s.id, r.pos, r.team, r.players ?? null, r.played ?? null, r.points ?? null, r.kills ?? null],
        );
      }
    }

    for (const r of normalized.topPlayerKills) {
      await client.query("INSERT INTO player_kills (pos, player, team, kills, matches) VALUES ($1,$2,$3,$4,$5)", [
        r.pos,
        r.player,
        r.team ?? null,
        r.kills,
        r.matches ?? null,
      ]);
    }

    for (const r of normalized.topTeams) {
      await client.query(
        "INSERT INTO team_rankings (pos, team, players, points, kills, matches) VALUES ($1,$2,$3,$4,$5,$6)",
        [r.pos, r.team, r.players ?? null, r.points ?? null, r.kills ?? null, r.matches ?? null],
      );
    }

    for (const r of normalized.upcomingScrims) {
      await client.query("INSERT INTO upcoming_scrims (id, title, subtitle, starts_at) VALUES ($1,$2,$3,$4)", [
        r.id,
        r.title,
        r.subtitle ?? null,
        r.startsAt,
      ]);
    }

    for (const r of normalized.upcomingTournaments) {
      await client.query("INSERT INTO upcoming_tournaments (id, title, subtitle, starts_at) VALUES ($1,$2,$3,$4)", [
        r.id,
        r.title,
        r.subtitle ?? null,
        r.startsAt,
      ]);
    }

    for (const r of normalized.upcomingVersus) {
      await client.query("INSERT INTO upcoming_versus (id, team_a, team_b, starts_at) VALUES ($1,$2,$3,$4)", [
        r.id,
        r.teamA,
        r.teamB,
        r.startsAt ?? null,
      ]);
    }

    for (const c of normalized.clanes) {
      await client.query("INSERT INTO official_clans (id, name) VALUES ($1,$2)", [c.id, c.name]);
    }

    await client.query(
      "UPDATE public_meta SET updated_at = now(), active_tournament_id = $1, active_scrim_id = $2 WHERE id = 'main'",
      [activeTournamentId, activeScrimId],
    );

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }

  store.cache = normalized;
  store.emitter.emit("update", normalized);
  return normalized;
}

export async function getState(): Promise<PublicState> {
  if (hasDb()) {
    const next = await getStateDb().catch(() => normalizeState(mockState));
    store.cache = next;
    return next;
  }
  await ensureDir();
  try {
    const raw = await readFile(statePath, "utf8");
    const parsed = JSON.parse(raw) as PublicState;
    store.cache = normalizeState(parsed);
  } catch {
    store.cache = normalizeState({
      topPlayerKills: [],
      topTeams: [],
      upcomingScrims: [],
      upcomingTournaments: [],
      upcomingVersus: [],
      clanes: [],
    });
    await writeFile(statePath, JSON.stringify(store.cache, null, 2), "utf8");
  }
  return store.cache!;
}

export async function setState(next: PublicState): Promise<PublicState> {
  if (hasDb()) {
    return await setStateDb(next);
  }
  await ensureDir();
  const normalized = { ...normalizeState(next), updatedAt: new Date().toISOString() };
  await writeFile(tmpPath, JSON.stringify(normalized, null, 2), "utf8");
  await rename(tmpPath, statePath);
  store.cache = normalized;
  store.emitter.emit("update", normalized);
  return normalized;
}

export function onStateUpdate(handler: (state: PublicState) => void) {
  store.emitter.on("update", handler);
  return () => store.emitter.off("update", handler);
}

