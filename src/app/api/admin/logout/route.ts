import { buildSetCookie, getAdminCookieName, logoutAdmin } from "@/lib/adminSession";

export const runtime = "nodejs";

export async function POST(request: Request) {
  await logoutAdmin(request);
  const secure = process.env.NODE_ENV === "production";
  const cookie = buildSetCookie(getAdminCookieName(), "", {
    httpOnly: true,
    secure,
    sameSite: "Lax",
    path: "/",
    maxAge: 0,
  });
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json", "Set-Cookie": cookie, "Cache-Control": "no-store" },
  });
}

