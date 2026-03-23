import { TorneosClient } from "@/components/pages/TorneosClient";
import { getState } from "@/lib/stateStore";

export default async function TorneosPage() {
  const state = await getState();
  return <TorneosClient initialState={state} />;
}

