import WorldCup2026Page from "@/components/worldcup2026/WorldCup2026Page";
import { getWorldCup2026WorldState } from "@/lib/worldcup2026/simulationEngine";

export default function Home() {
  return <WorldCup2026Page initialWorldState={getWorldCup2026WorldState()} />;
}
