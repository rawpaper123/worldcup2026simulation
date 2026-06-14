import { WORLD_CUP_2026_TOURNAMENT_ID } from "./fixtures";
import { worldCup2026SeedWorldState } from "./worldModelSeed";
import type {
  AgentDebate,
  BoundedWorldState,
  EvolutionLog,
  MatchPrediction,
  ModelRecord,
  PaperBankrollState,
  SimulationBatch,
  SimulationEngine,
} from "./worldModelTypes";
import type { WorldCupMatch } from "./types";

export class StaticSimulationEngine implements SimulationEngine {
  constructor(private readonly state: BoundedWorldState) {}

  getWorldState(tournamentId: string) {
    if (tournamentId !== this.state.tournamentId) {
      throw new Error(`Unsupported tournament: ${tournamentId}`);
    }

    return this.state;
  }

  getFixtures(): WorldCupMatch[] {
    return this.state.fixtures;
  }

  getMatch(matchId: string): WorldCupMatch | undefined {
    return this.state.fixtures.find((fixture) => fixture.id === matchId);
  }

  getPrediction(matchId: string): MatchPrediction | undefined {
    return this.state.predictions.find((prediction) => prediction.matchId === matchId);
  }

  getSimulationBatch(matchId: string): SimulationBatch | undefined {
    return this.state.simulationBatches.find((batch) => batch.matchId === matchId);
  }

  getAgentDebate(matchId: string): AgentDebate | undefined {
    return this.state.agentDebates.find((debate) => debate.matchId === matchId);
  }

  getEvolutionLogs(limit?: number): EvolutionLog[] {
    const logs = this.state.evolutionLogs
      .slice()
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    return typeof limit === "number" ? logs.slice(0, limit) : logs;
  }

  getPaperBankroll(): PaperBankrollState {
    return this.state.paperBankroll;
  }

  getModelRecord(): ModelRecord {
    return this.state.modelRecord;
  }
}

export const worldCup2026SimulationEngine = new StaticSimulationEngine(
  worldCup2026SeedWorldState,
);

export function getWorldCup2026WorldState() {
  return worldCup2026SimulationEngine.getWorldState(WORLD_CUP_2026_TOURNAMENT_ID);
}
