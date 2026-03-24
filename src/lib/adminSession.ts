import { createHash, randomBytes, randomUUID } from "node:crypto";

import bcrypt from "bcryptjs";

import { getPool } from "@/lib/db";
import { ensureDbSchema } from "@/lib/dbSchema";

export type AdminUser = { id: string; email: string; role: string };

const cookieName = "mictlan_admin_session";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getAdminCookieName() {
  return cookieName;
}

export function getCookieFromRequest(request: Request, name: string) {
  const header = request.headers.get("cookie");
  if (!header) return null;
  const parts = header.split(";").map((p) => p.trim());
  for (const part of parts) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const k = part.slice(0, eq).trim();
    if (k !== name) continue;
    return decodeURIComponent(part.slice(eq + 1));
  }
  return null;
}

export function buildSetCookie(
  name: string,
  value: string,
  opts: { httpOnly: boolean; secure: boolean; sameSite: "Lax" | "Strict"; path: string; maxAge?: number },
) {
  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${opts.path}`, `SameSite=${opts.sameSite}`];
  if (opts.httpOnly) parts.push("HttpOnly");
  if (opts.secure) parts.push("Secure");
  if (typeof opts.maxAge === "number") parts.push(`Max-Age=${opts.maxAge}`);
  return parts.join("; ");
}

export async function requireAdminUser(request: Request): Promise<AdminUser | null> {
  await ensureDbSchema();
  const token = getCookieFromRequest(request, cookieName);
  if (!token) return null;
  const pool = getPool();
  const tokenHash = hashToken(token);
  const res = await pool.query<AdminUser & { expires_at: string }>(
    `
      SELECT u.id, u.email, u.role, s.expires_at
      FROM admin_sessions s
      JOIN admin_users u ON u.id = s.user_id
      WHERE s.token_hash = $1
      LIMIT 1
    `,
    [tokenHash],
  );
  const row = res.rows[0];
  if (!row) return null;
  if (new Date(row.expires_at).getTime() <= Date.now()) return null;
  return { id: row.id, email: row.email, role: row.role };
}

export async function loginAdmin(email: string, password: string) {
  await ensureDbSchema();
  const pool = getPool();
  const res = await pool.query<{ id: string; email: string; password_hash: string; role: string }>(
    "SELECT id, email, password_hash, role FROM admin_users WHERE email = $1 LIMIT 1",
    [email.toLowerCase()],
  );
  const user = res.rows[0];
  if (!user) return { ok: false as const, reason: "invalid_credentials" as const };
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return { ok: false as const, reason: "invalid_credentials" as const };

  const raw = randomBytes(32).toString("hex");
  const tokenHash = hashToken(raw);
  const id = randomUUID();
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  await pool.query(
    "INSERT INTO admin_sessions (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)",
    [id, user.id, tokenHash, expires.toISOString()],
  );

  return { ok: true as const, token: raw, user: { id: user.id, email: user.email, role: user.role } };
}

export async function logoutAdmin(request: Request) {
  await ensureDbSchema();
  const token = getCookieFromRequest(request, cookieName);
  if (!token) return;
  const pool = getPool();
  await pool.query("DELETE FROM admin_sessions WHERE token_hash = $1", [hashToken(token)]);
}

