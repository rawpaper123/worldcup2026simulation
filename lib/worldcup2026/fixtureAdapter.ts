import { worldCup2026Matches } from "./fixtures";
import type { WorldCupMatch, WorldCupMatchStage } from "./types";

export function getWorldCup2026Fixtures(stage?: WorldCupMatchStage): WorldCupMatch[] {
  return stage
    ? worldCup2026Matches.filter((fixture) => fixture.stage === stage)
    : worldCup2026Matches;
}

export function getWorldCup2026Match(matchId: string): WorldCupMatch | undefined {
  return worldCup2026Matches.find((fixture) => fixture.id === matchId);
}
