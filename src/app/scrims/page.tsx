import { ScrimsClient } from "@/components/pages/ScrimsClient";
import { getState } from "@/lib/stateStore";

export default async function ScrimsPage() {
  const state = await getState();
  return <ScrimsClient initialState={state} />;
}

