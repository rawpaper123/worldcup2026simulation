import type { WorldCupMatch } from "./types";
import type { BoundedWorldState } from "./worldModelTypes";
import type {
  RuntimeOutputSnapshot,
  RuntimeSnapshotValidationResult,
} from "./runtimeOutputTypes";
import { normalizeRuntimeOutputSnapshot, runtimeSnapshotToWorldState } from "./runtimeSnapshotAdapter";
import { validateRuntimeOutputSnapshot } from "./runtimeOutputValidator";

type BuildWorldStateInput = {
  fixtures: WorldCupMatch[];
  snapshot: RuntimeOutputSnapshot;
};

type BuildWorldStateResult =
  | {
      ok: true;
      state: BoundedWorldState;
      validation: RuntimeSnapshotValidationResult;
    }
  | {
      ok: false;
      validation: RuntimeSnapshotValidationResult;
    };

export function tryBuildBoundedWorldState({
  fixtures,
  snapshot,
}: BuildWorldStateInput): BuildWorldStateResult {
  const validation = validateRuntimeOutputSnapshot(snapshot, fixtures);
  if (!validation.ok) return { ok: false, validation };

  const normalized = normalizeRuntimeOutputSnapshot(snapshot, fixtures);

  return {
    ok: true,
    state: runtimeSnapshotToWorldState(normalized, fixtures),
    validation,
  };
}

export function buildBoundedWorldState(input: BuildWorldStateInput): BoundedWorldState {
  const result = tryBuildBoundedWorldState(input);
  if (!result.ok) {
    throw new Error("Runtime snapshot validation failed.");
  }

  return result.state;
}

function emptyPublicState(
  fixtures: WorldCupMatch[],
  snapshot: RuntimeOutputSnapshot,
): BoundedWorldState {
  return {
    id: `bounded-world-state-${snapshot.id}-fallback`,
    tournamentId: "worldcup2026",
    runtime: {
      id: snapshot.id,
      name: "Nira Bounded World Model",
      version: snapshot.runtimeVersion,
      generatedAt: snapshot.generatedAt,
      fixtureSourceVersion: snapshot.fixtureSourceVersion,
      predictionSourceVersion: snapshot.runtimeVersion,
      runtimeKind: "seed",
    },
    generatedAt: snapshot.generatedAt,
    fixtureSourceVersion: snapshot.fixtureSourceVersion,
    predictionSourceVersion: snapshot.runtimeVersion,
    modelRecord: {
      predictedCount: 0,
      correctCount: 0,
      totalMatches: 104,
      accuracy: 0,
      currentCorrectStreak: 0,
      bestCorrectStreak: 0,
      lastUpdatedAt: snapshot.generatedAt,
    },
    fixtures: fixtures.slice(),
    predictions: [],
    simulationBatches: [],
    agentDebates: [],
    evolutionLogs: [],
    paperBankroll: {
      currency: "USD",
      baseStake: 10,
      positiveProfitStakeRate: 0.2,
      cumulativeStake: 0,
      cumulativeReturn: 0,
      cumulativeProfit: 0,
      roi: 0,
      entries: [],
    },
  };
}

export function buildPublicSafeBoundedWorldState({
  fixtures,
  snapshot,
  fallbackSnapshot,
}: BuildWorldStateInput & { fallbackSnapshot?: RuntimeOutputSnapshot }): BoundedWorldState {
  const primary = tryBuildBoundedWorldState({ fixtures, snapshot });
  if (primary.ok) return primary.state;

  if (fallbackSnapshot && fallbackSnapshot !== snapshot) {
    const fallback = tryBuildBoundedWorldState({ fixtures, snapshot: fallbackSnapshot });
    if (fallback.ok) return fallback.state;
  }

  return emptyPublicState(fixtures, snapshot);
}
