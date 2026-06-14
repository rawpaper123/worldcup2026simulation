import type { WorldCupMatch } from "./types";
import type {
  AgentDebate,
  BoundedWorldState,
  MatchPrediction,
  SimulationBatch,
  WorldModelRuntime,
} from "./worldModelTypes";
import type {
  RuntimeMatchOutput,
  RuntimeOutputSnapshot,
  RuntimeSimulationBatch,
} from "./runtimeOutputTypes";

export type NormalizedRuntimeOutputSnapshot = RuntimeOutputSnapshot;

function fixtureOrder(fixtures: WorldCupMatch[]) {
  return new Map(fixtures.map((fixture, index) => [fixture.id, index]));
}

function sortMatchOutputs(
  outputs: RuntimeMatchOutput[],
  fixtures: WorldCupMatch[],
) {
  const order = fixtureOrder(fixtures);

  return outputs
    .slice()
    .sort((left, right) => (order.get(left.matchId) ?? 999) - (order.get(right.matchId) ?? 999));
}

function sortLogs(snapshot: RuntimeOutputSnapshot) {
  return snapshot.evolutionLogs.slice().sort((left, right) => {
    return right.timestamp.localeCompare(left.timestamp);
  });
}

export function normalizeRuntimeOutputSnapshot(
  snapshot: RuntimeOutputSnapshot,
  fixtures: WorldCupMatch[],
): NormalizedRuntimeOutputSnapshot {
  return {
    ...snapshot,
    matchOutputs: sortMatchOutputs(snapshot.matchOutputs, fixtures).map((output) => ({
      ...output,
      prediction: { ...output.prediction },
      simulationBatch: { ...output.simulationBatch },
      agentDebate: output.agentDebate
        ? {
            ...output.agentDebate,
            leadAgents: output.agentDebate.leadAgents.slice(),
            controlAdjustments: output.agentDebate.controlAdjustments.map((item) => ({ ...item })),
          }
        : undefined,
    })),
    evolutionLogs: sortLogs(snapshot).map((log) => ({ ...log })),
    paperBankroll: {
      ...snapshot.paperBankroll,
      entries: snapshot.paperBankroll.entries.map((entry) => ({ ...entry })),
    },
  };
}

function runtimeFromSnapshot(snapshot: RuntimeOutputSnapshot): WorldModelRuntime {
  return {
    id: snapshot.id,
    name: snapshot.outputSource.name,
    version: snapshot.runtimeVersion,
    generatedAt: snapshot.generatedAt,
    fixtureSourceVersion: snapshot.fixtureSourceVersion,
    predictionSourceVersion: snapshot.runtimeVersion,
    runtimeKind: snapshot.outputSource.kind === "seed" ? "seed" : "adapter",
  };
}

function predictionFromOutput(output: RuntimeMatchOutput): MatchPrediction {
  return {
    matchId: output.matchId,
    ...output.prediction,
  };
}

function batchFromOutput(output: RuntimeMatchOutput): SimulationBatch {
  const batch: RuntimeSimulationBatch = output.simulationBatch;

  return {
    matchId: output.matchId,
    batchId: batch.batchId,
    targetRuns: batch.targetRuns,
    completedRuns: batch.completedRuns,
    status: batch.status,
    lastUpdatedAt: batch.lastUpdatedAt,
    aggregate: { ...batch.aggregate },
    currentDirection: batch.currentDirection,
    confidenceLabel: batch.confidenceLabel,
    agentSummaryZh: batch.agentSummaryZh,
    agentSummaryEn: batch.agentSummaryEn,
  };
}

function debateFromOutput(output: RuntimeMatchOutput): AgentDebate | undefined {
  if (!output.agentDebate) return undefined;

  return {
    matchId: output.matchId,
    ...output.agentDebate,
    leadAgents: output.agentDebate.leadAgents.slice(),
    controlAdjustments: output.agentDebate.controlAdjustments.map((item) => ({ ...item })),
  };
}

export function runtimeSnapshotToWorldState(
  snapshot: NormalizedRuntimeOutputSnapshot,
  fixtures: WorldCupMatch[],
): BoundedWorldState {
  const visibleOutputs = snapshot.matchOutputs.filter((output) => output.prediction.visible);
  const activeSimulationOutputs = snapshot.matchOutputs.filter(
    (output) => output.simulationBatch.status !== "not_started",
  );
  const agentDebates = snapshot.matchOutputs
    .map(debateFromOutput)
    .filter((debate): debate is AgentDebate => Boolean(debate));

  return {
    id: `bounded-world-state-${snapshot.id}`,
    tournamentId: snapshot.tournamentId,
    runtime: runtimeFromSnapshot(snapshot),
    generatedAt: snapshot.generatedAt,
    fixtureSourceVersion: snapshot.fixtureSourceVersion,
    predictionSourceVersion: snapshot.runtimeVersion,
    modelRecord: { ...snapshot.modelRecord },
    fixtures: fixtures.slice(),
    predictions: visibleOutputs.map(predictionFromOutput),
    simulationBatches: activeSimulationOutputs.map(batchFromOutput),
    agentDebates,
    evolutionLogs: snapshot.evolutionLogs.map((log) => ({ ...log })),
    paperBankroll: {
      ...snapshot.paperBankroll,
      entries: snapshot.paperBankroll.entries.map((entry) => ({ ...entry })),
    },
  };
}
