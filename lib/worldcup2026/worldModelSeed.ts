import {
  WORLD_CUP_2026_TOURNAMENT_ID,
  worldCup2026FixtureSource,
  worldCup2026Matches,
} from "./fixtures";
import { worldCup2026SeedAgentDebates } from "./agentDebates";
import { worldCup2026SeedEvolutionLogs } from "./evolutionLogs";
import { worldCup2026SeedModelRecord } from "./modelRecord";
import { worldCup2026SeedPaperBankroll } from "./paperBankroll";
import { worldCup2026SeedPredictions } from "./predictions";
import { worldCup2026SeedSimulationBatches } from "./simulationRuns";
import type { BoundedWorldState, WorldModelRuntime } from "./worldModelTypes";

export const worldCup2026SeedRuntime: WorldModelRuntime = {
  id: "nira-bounded-world-seed-v2",
  name: "Nira Bounded World Model",
  version: "2026.06.phase2",
  generatedAt: "2026-06-14T08:30:00.000Z",
  fixtureSourceVersion: worldCup2026FixtureSource.sourceUpdatedAt,
  predictionSourceVersion: "2026-06-14.seed",
  runtimeKind: "seed",
};

export const worldCup2026SeedWorldState: BoundedWorldState = {
  id: "bounded-world-state-worldcup2026-phase2",
  tournamentId: WORLD_CUP_2026_TOURNAMENT_ID,
  runtime: worldCup2026SeedRuntime,
  generatedAt: worldCup2026SeedRuntime.generatedAt,
  fixtureSourceVersion: worldCup2026SeedRuntime.fixtureSourceVersion,
  predictionSourceVersion: worldCup2026SeedRuntime.predictionSourceVersion,
  modelRecord: worldCup2026SeedModelRecord,
  fixtures: worldCup2026Matches,
  predictions: worldCup2026SeedPredictions,
  simulationBatches: worldCup2026SeedSimulationBatches,
  agentDebates: worldCup2026SeedAgentDebates,
  evolutionLogs: worldCup2026SeedEvolutionLogs,
  paperBankroll: worldCup2026SeedPaperBankroll,
};
