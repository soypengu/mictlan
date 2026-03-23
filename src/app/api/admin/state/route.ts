import { verifyAdminToken } from "@/lib/adminAuth";
import { getState, setState } from "@/lib/stateStore";
import type { PublicState } from "@/lib/types";

export const runtime = "nodejs";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isPublicState(v: unknown): v is PublicState {
  if (!isRecord(v)) return false;
  return (
    Array.isArray(v.topPlayerKills) &&
    Array.isArray(v.topTeams) &&
    Array.isArray(v.upcomingScrims) &&
    Array.isArray(v.upcomingTournaments)
  );
}

function unauthorized(reason: string) {
  return Response.json(
    { ok: false, error: "unauthorized", reason },
    { status: 401, headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET(request: Request) {
  const auth = verifyAdminToken(request);
  if (!auth.ok) return unauthorized(auth.reason);
  const state = await getState();
  return Response.json(state, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  const auth = verifyAdminToken(request);
  if (!auth.ok) return unauthorized(auth.reason);
  const body = (await request.json().catch(() => null)) as unknown;
  if (!isPublicState(body)) {
    return Response.json(
      { ok: false, error: "invalid_payload" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
  const next = await setState(body);
  return Response.json(next, { headers: { "Cache-Control": "no-store" } });
}

