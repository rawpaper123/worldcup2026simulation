import { WORLD_CUP_2026_TOURNAMENT_ID, worldCup2026FixtureSource } from "./fixtures";
import { worldCup2026SeedAgentDebates } from "./agentDebates";
import { worldCup2026SeedEvolutionLogs } from "./evolutionLogs";
import { worldCup2026SeedModelRecord } from "./modelRecord";
import { worldCup2026SeedPaperBankroll } from "./paperBankroll";
import { worldCup2026SeedPredictions } from "./predictions";
import { worldCup2026SeedSimulationBatches } from "./simulationRuns";
import type {
  RuntimeMatchDisplayStatus,
  RuntimeMatchOutput,
  RuntimeOutputSnapshot,
  RuntimePrediction,
  RuntimeSimulationBatch,
} from "./runtimeOutputTypes";
import type { MatchPrediction, PredictionDirection, SimulationBatch } from "./worldModelTypes";

function aggregateForPrediction(prediction: MatchPrediction) {
  const primary = Math.max(34, Math.min(66, Math.round((prediction.confidenceScore ?? 0.4) * 100)));
  const remainder = 100 - primary;
  const secondary = Math.floor(remainder / 2);
  const tertiary = remainder - secondary;

  if (prediction.direction === "teamA_win") {
    return { teamAWinPct: primary, drawPct: tertiary, teamBWinPct: secondary };
  }

  if (prediction.direction === "teamB_win") {
    return { teamAWinPct: secondary, drawPct: tertiary, teamBWinPct: primary };
  }

  return { teamAWinPct: secondary, drawPct: primary, teamBWinPct: tertiary };
}

function fallbackBatch(prediction: MatchPrediction): RuntimeSimulationBatch {
  return {
    matchId: prediction.matchId,
    batchId: `batch-${prediction.matchId}-queued`,
    targetRuns: 1000,
    completedRuns: 0,
    status: "not_started",
    lastUpdatedAt: prediction.generatedAt,
    aggregate: aggregateForPrediction(prediction),
    currentDirection: prediction.direction,
    confidenceLabel: prediction.confidenceLabel,
    agentSummaryZh: "等待公开安全快照更新。",
    agentSummaryEn: "Waiting for the next public-safe snapshot update.",
  };
}

function runtimePrediction(prediction: MatchPrediction): RuntimePrediction {
  return {
    predictionId: prediction.predictionId,
    generatedAt: prediction.generatedAt,
    predictionType: prediction.predictionType,
    direction: prediction.direction,
    confidenceLabel: prediction.confidenceLabel,
    confidenceScore: prediction.confidenceScore,
    status: prediction.status,
    settledCorrect: prediction.settledCorrect,
    visible: prediction.visible,
  };
}

function displayStatus(
  prediction: MatchPrediction,
  batch: SimulationBatch | undefined,
): RuntimeMatchDisplayStatus {
  if (prediction.settledCorrect !== undefined) return "settled";
  if (batch?.status === "running") return "running";
  if (prediction.status === "pre_match_locked") return "locked";
  if (prediction.status === "draft") return "scheduled";
  return "ready";
}

function runtimeBatch(batch: SimulationBatch | undefined, prediction: MatchPrediction) {
  if (!batch) return fallbackBatch(prediction);

  return {
    ...batch,
    aggregate: { ...batch.aggregate },
  };
}

const matchOutputs: RuntimeMatchOutput[] = worldCup2026SeedPredictions.map((prediction) => {
  const batch = worldCup2026SeedSimulationBatches.find((item) => item.matchId === prediction.matchId);
  const agentDebate = worldCup2026SeedAgentDebates.find((item) => item.matchId === prediction.matchId);

  return {
    matchId: prediction.matchId,
    prediction: runtimePrediction(prediction),
    simulationBatch: runtimeBatch(batch, prediction),
    agentDebate: agentDebate
      ? {
          debateId: agentDebate.debateId,
          generatedAt: agentDebate.generatedAt,
          leadAgents: agentDebate.leadAgents.slice(),
          subAgentCount: agentDebate.subAgentCount,
          summaryZh: agentDebate.summaryZh,
          summaryEn: agentDebate.summaryEn,
          controlAdjustments: agentDebate.controlAdjustments.map((item) => ({ ...item })),
        }
      : undefined,
    displayStatus: displayStatus(prediction, batch),
  };
});

export const worldCup2026SeedRuntimeSnapshot: RuntimeOutputSnapshot = {
  id: "worldcup2026-seed-snapshot-phase3",
  tournamentId: WORLD_CUP_2026_TOURNAMENT_ID,
  generatedAt: "2026-06-14T08:30:00.000Z",
  runtimeVersion: "2026.06.phase3.seed",
  fixtureSourceVersion: worldCup2026FixtureSource.sourceUpdatedAt,
  outputSource: {
    kind: "seed",
    visibility: "public_safe",
    name: "Nira Bounded World Model",
    notes: "Sanitized seed snapshot for the public world model page.",
  },
  modelRecord: worldCup2026SeedModelRecord,
  matchOutputs,
  evolutionLogs: worldCup2026SeedEvolutionLogs.map((log) => ({ ...log })),
  paperBankroll: {
    ...worldCup2026SeedPaperBankroll,
    entries: worldCup2026SeedPaperBankroll.entries.map((entry) => ({ ...entry })),
  },
};
