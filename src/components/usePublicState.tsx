"use client";

import { useEffect, useRef, useState } from "react";

import type { PublicState } from "@/lib/types";

export function usePublicState(initialState: PublicState) {
  const [state, setState] = useState<PublicState>(initialState);
  const lastUpdatedAt = useRef(initialState.updatedAt);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      const res = await fetch("/api/public/state", { cache: "no-store" }).catch(() => null);
      if (!res || !res.ok) return;
      const next = (await res.json().catch(() => null)) as PublicState | null;
      if (!next || typeof next.updatedAt !== "string") return;
      if (next.updatedAt === lastUpdatedAt.current) return;
      lastUpdatedAt.current = next.updatedAt;
      if (!cancelled) setState(next);
    };

    const id = window.setInterval(tick, 3000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return state;
}

