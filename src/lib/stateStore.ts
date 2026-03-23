import { EventEmitter } from "node:events";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

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
  };
}

export async function getState(): Promise<PublicState> {
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
    });
    await writeFile(statePath, JSON.stringify(store.cache, null, 2), "utf8");
  }
  return store.cache!;
}

export async function setState(next: PublicState): Promise<PublicState> {
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

