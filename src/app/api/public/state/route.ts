import { getState } from "@/lib/stateStore";

export const runtime = "nodejs";

export async function GET() {
  const state = await getState();
  return Response.json(state, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

