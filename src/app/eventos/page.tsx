import { EventosClient } from "@/components/pages/EventosClient";
import { getState } from "@/lib/stateStore";

export default async function EventosPage() {
  const state = await getState();
  return <EventosClient initialState={state} />;
}

