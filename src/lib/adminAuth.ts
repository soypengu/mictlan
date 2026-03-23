const headerName = "x-admin-token";

export function getAdminTokenFromRequest(request: Request) {
  const direct = request.headers.get(headerName);
  if (direct) return direct.trim();
  const auth = request.headers.get("authorization");
  if (!auth) return null;
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

export function verifyAdminToken(request: Request) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return { ok: false as const, reason: "missing_server_token" as const };
  const token = getAdminTokenFromRequest(request);
  if (!token) return { ok: false as const, reason: "missing_token" as const };
  if (token !== expected) return { ok: false as const, reason: "invalid_token" as const };
  return { ok: true as const };
}

