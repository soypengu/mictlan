import { buildSetCookie, getAdminCookieName, loginAdmin } from "@/lib/adminSession";
import { ensureDbSchema } from "@/lib/dbSchema";

export const runtime = "nodejs";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export async function POST(request: Request) {
  await ensureDbSchema();
  const body = (await request.json().catch(() => null)) as unknown;
  if (!isRecord(body) || typeof body.email !== "string" || typeof body.password !== "string") {
    return Response.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const res = await loginAdmin(body.email, body.password);
  if (!res.ok) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const secure = process.env.NODE_ENV === "production";
  const cookie = buildSetCookie(getAdminCookieName(), res.token, {
    httpOnly: true,
    secure,
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return new Response(JSON.stringify({ ok: true, user: res.user }), {
    headers: { "Content-Type": "application/json", "Set-Cookie": cookie, "Cache-Control": "no-store" },
  });
}

