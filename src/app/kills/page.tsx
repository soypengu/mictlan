import { KillsClient } from "@/components/pages/KillsClient";
import { getState } from "@/lib/stateStore";

export default async function KillsPage() {
  const state = await getState();
  return <KillsClient initialState={state} />;
}

