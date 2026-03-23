import { EquiposClient } from "@/components/pages/EquiposClient";
import { getState } from "@/lib/stateStore";

export default async function EquiposPage() {
  const state = await getState();
  return <EquiposClient initialState={state} />;
}

