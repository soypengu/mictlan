import { HomeClient } from "@/components/pages/HomeClient";
import { getState } from "@/lib/stateStore";

export default async function Home() {
  const state = await getState();
  return <HomeClient initialState={state} />;
}
