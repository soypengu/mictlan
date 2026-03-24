import { ClanesClient } from "@/components/pages/ClanesClient";
import { getState } from "@/lib/stateStore";

export default async function ClanesPage() {
  const state = await getState();
  return <ClanesClient initialState={state} />;
}
