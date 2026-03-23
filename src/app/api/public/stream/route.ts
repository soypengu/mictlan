import { getState } from "@/lib/stateStore";

export const runtime = "nodejs";

function toSse(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function GET(request: Request) {
  const encoder = new TextEncoder();
  const initial = await getState();

  let keepAlive: ReturnType<typeof setInterval> | undefined;
  let poll: ReturnType<typeof setInterval> | undefined;
  const abort = () => {
    if (keepAlive) clearInterval(keepAlive);
    if (poll) clearInterval(poll);
  };

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(toSse("state", initial)));

      let lastUpdatedAt = initial.updatedAt;

      keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(`event: ping\ndata: ${Date.now()}\n\n`));
      }, 25000);

      poll = setInterval(async () => {
        const state = await getState();
        if (state.updatedAt === lastUpdatedAt) return;
        lastUpdatedAt = state.updatedAt;
        controller.enqueue(encoder.encode(toSse("state", state)));
      }, 1000);
      request.signal.addEventListener(
        "abort",
        () => {
          abort();
          controller.close();
        },
        { once: true },
      );
    },
    cancel() {
      abort();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Connection: "keep-alive",
    },
  });
}

