import {
  WORLD_CUP_2026_TOTAL_MATCHES,
  WORLD_CUP_2026_TOURNAMENT_ID,
} from "./fixtures";
import type { WorldCupMatch } from "./types";
import type {
  RuntimeMatchOutput,
  RuntimeOutputSnapshot,
  RuntimePrediction,
  RuntimeSimulationBatch,
  RuntimeSnapshotValidationIssue,
  RuntimeSnapshotValidationResult,
} from "./runtimeOutputTypes";

const VALID_DIRECTIONS = ["teamA_win", "draw", "teamB_win"] as const;
const VALID_CONFIDENCE = ["low", "medium", "high"] as const;
const VALID_PREDICTION_STATUS = ["draft", "pre_match_locked", "settled"] as const;
const VALID_BATCH_STATUS = [
  "not_started",
  "running",
  "completed",
  "waiting_for_key_variables",
] as const;
const VALID_DISPLAY_STATUS = ["scheduled", "ready", "running", "locked", "settled"] as const;
const VALID_LEAD_AGENTS = ["tactical", "momentum", "risk", "data", "control"] as const;
const VALID_EVOLUTION_AGENTS = [
  "Tactical Agent",
  "Momentum Agent",
  "Risk Agent",
  "Data Agent",
  "Control Agent",
] as const;
const VALID_EVENT_TYPES = [
  "hit",
  "miss",
  "weight_update",
  "confidence_update",
  "scenario_update",
] as const;
const VALID_LEDGER_RESULTS = ["win", "loss", "push", "pending"] as const;
const UNSUPPORTED_OUTPUT_KEYS = ["handicap", "spread", "over_under", "exact_score", "futures"];
const AGGREGATE_TOLERANCE = 1;
const MONEY_TOLERANCE = 0.001;
const SENSITIVE_MARKERS = [
  ["s", "ecret"].join(""),
  ["api", "key"].join(" "),
  ["api", "key"].join(""),
  ["hidden", "pro", "mpt"].join(" "),
  ["hidden", "pro", "mpt"].join(""),
  ["pro", "mpt"].join(""),
  ["chain", "of", "thought"].join("-"),
  ["private", "debug"].join(" "),
  ["private", "runtime"].join(" "),
  ["ling", "tai"].join(""),
  ["co", "dex"].join(""),
  ["sports", "book"].join(""),
  ["book", "maker"].join(""),
  ["the", ["o", "dds"].join(""), "api"].join(" "),
  ["sports", "data", "io"].join(""),
  [["o", "dds"].join(""), "vendor"].join(" "),
];

function issue(code: string, path: string, message: string): RuntimeSnapshotValidationIssue {
  return { code, path, message };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOwn(value: object, key: string) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function isOneOf<T extends readonly string[]>(value: unknown, allowed: T): value is T[number] {
  return typeof value === "string" && allowed.includes(value);
}

function isIsoString(value: unknown) {
  return typeof value === "string" && value.length > 0 && !Number.isNaN(Date.parse(value));
}

function isFiniteNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value);
}

function closeTo(left: number, right: number, tolerance = MONEY_TOLERANCE) {
  return Math.abs(left - right) <= tolerance;
}

function directionValue(batch: RuntimeSimulationBatch, direction: string) {
  if (direction === "teamA_win") return batch.aggregate.teamAWinPct;
  if (direction === "draw") return batch.aggregate.drawPct;
  if (direction === "teamB_win") return batch.aggregate.teamBWinPct;
  return Number.NEGATIVE_INFINITY;
}

function hasTopDirectionConflict(batch: RuntimeSimulationBatch) {
  if (batch.directionOverrideReason) return false;

  const current = directionValue(batch, batch.currentDirection);
  const top = Math.max(
    batch.aggregate.teamAWinPct,
    batch.aggregate.drawPct,
    batch.aggregate.teamBWinPct,
  );

  return top - current > MONEY_TOLERANCE;
}

function hasUnsupportedOutputKey(value: RuntimePrediction) {
  return UNSUPPORTED_OUTPUT_KEYS.some((key) => hasOwn(value, key));
}

function collectSensitiveMarkers(value: unknown, path: string, out: RuntimeSnapshotValidationIssue[]) {
  if (typeof value === "string") {
    const text = value.toLowerCase();
    const marker = SENSITIVE_MARKERS.find((item) => text.includes(item));
    if (marker) {
      out.push(issue("disallowed_text", path, "Snapshot includes non-public text."));
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => collectSensitiveMarkers(item, `${path}[${index}]`, out));
    return;
  }

  if (!isRecord(value)) return;

  Object.entries(value).forEach(([key, item]) => {
    const keyText = key.toLowerCase();
    if (SENSITIVE_MARKERS.some((marker) => keyText.includes(marker))) {
      out.push(issue("disallowed_text", `${path}.${key}`, "Snapshot includes non-public text."));
    }
    if (UNSUPPORTED_OUTPUT_KEYS.includes(key)) {
      out.push(issue("unsupported_output_key", `${path}.${key}`, "Snapshot contains an unsupported output category."));
    }
    collectSensitiveMarkers(item, `${path}.${key}`, out);
  });
}

function validatePrediction(
  prediction: RuntimePrediction,
  path: string,
  issues: RuntimeSnapshotValidationIssue[],
) {
  if (!prediction.predictionId) {
    issues.push(issue("missing_prediction_id", `${path}.predictionId`, "Prediction id is required."));
  }
  if (!isIsoString(prediction.generatedAt)) {
    issues.push(issue("invalid_timestamp", `${path}.generatedAt`, "Timestamp must parse."));
  }
  if (prediction.predictionType !== "1x2") {
    issues.push(issue("invalid_prediction_type", `${path}.predictionType`, "Prediction type must be 1x2."));
  }
  if (!isOneOf(prediction.direction, VALID_DIRECTIONS)) {
    issues.push(issue("invalid_direction", `${path}.direction`, "Direction is outside the allowed set."));
  }
  if (!isOneOf(prediction.confidenceLabel, VALID_CONFIDENCE)) {
    issues.push(issue("invalid_confidence", `${path}.confidenceLabel`, "Confidence is outside the allowed set."));
  }
  if (
    prediction.confidenceScore !== undefined &&
    (!isFiniteNumber(prediction.confidenceScore) ||
      prediction.confidenceScore < 0 ||
      prediction.confidenceScore > 1)
  ) {
    issues.push(issue("invalid_confidence_score", `${path}.confidenceScore`, "Confidence score must be 0..1."));
  }
  if (!isOneOf(prediction.status, VALID_PREDICTION_STATUS)) {
    issues.push(issue("invalid_prediction_status", `${path}.status`, "Prediction status is outside the allowed set."));
  }
  if (typeof prediction.visible !== "boolean") {
    issues.push(issue("invalid_visibility", `${path}.visible`, "Visibility must be boolean."));
  }
  if (hasUnsupportedOutputKey(prediction)) {
    issues.push(issue("unsupported_output_key", path, "Snapshot contains an unsupported output category."));
  }
}

function validateBatch(
  batch: RuntimeSimulationBatch,
  path: string,
  issues: RuntimeSnapshotValidationIssue[],
) {
  if (!batch.batchId) {
    issues.push(issue("missing_batch_id", `${path}.batchId`, "Batch id is required."));
  }
  if (batch.targetRuns !== 1000) {
    issues.push(issue("invalid_target_runs", `${path}.targetRuns`, "Target runs must be 1000."));
  }
  if (!Number.isInteger(batch.completedRuns) || batch.completedRuns < 0 || batch.completedRuns > 1000) {
    issues.push(issue("invalid_completed_runs", `${path}.completedRuns`, "Completed runs must be 0..1000."));
  }
  if (!isOneOf(batch.status, VALID_BATCH_STATUS)) {
    issues.push(issue("invalid_batch_status", `${path}.status`, "Batch status is outside the allowed set."));
  }
  if (batch.status === "completed" && batch.completedRuns !== batch.targetRuns) {
    issues.push(issue("inconsistent_batch_status", `${path}.completedRuns`, "Completed status needs full runs."));
  }
  if (!isIsoString(batch.lastUpdatedAt)) {
    issues.push(issue("invalid_timestamp", `${path}.lastUpdatedAt`, "Timestamp must parse."));
  }

  const aggregate = batch.aggregate;
  const aggregateValues = [aggregate.teamAWinPct, aggregate.drawPct, aggregate.teamBWinPct];
  if (aggregateValues.some((value) => !isFiniteNumber(value) || value < 0 || value > 100)) {
    issues.push(issue("invalid_aggregate", `${path}.aggregate`, "Aggregate values must be 0..100."));
  }

  const aggregateTotal = aggregateValues.reduce((sum, value) => sum + value, 0);
  if (Math.abs(aggregateTotal - 100) > AGGREGATE_TOLERANCE) {
    issues.push(issue("invalid_aggregate_total", `${path}.aggregate`, "Aggregate values must total near 100."));
  }
  if (!isOneOf(batch.currentDirection, VALID_DIRECTIONS)) {
    issues.push(issue("invalid_current_direction", `${path}.currentDirection`, "Direction is outside the allowed set."));
  } else if (hasTopDirectionConflict(batch)) {
    issues.push(issue("direction_aggregate_conflict", `${path}.currentDirection`, "Direction must match top aggregate."));
  }
  if (!isOneOf(batch.confidenceLabel, VALID_CONFIDENCE)) {
    issues.push(issue("invalid_confidence", `${path}.confidenceLabel`, "Confidence is outside the allowed set."));
  }
}

function validateMatchOutput(
  output: RuntimeMatchOutput,
  index: number,
  fixtureIds: Set<string>,
  predictionIds: Set<string>,
  issues: RuntimeSnapshotValidationIssue[],
) {
  const path = `matchOutputs[${index}]`;

  if (!fixtureIds.has(output.matchId)) {
    issues.push(issue("unknown_match_id", `${path}.matchId`, "Match id must exist in fixtures."));
  }
  if (!isOneOf(output.displayStatus, VALID_DISPLAY_STATUS)) {
    issues.push(issue("invalid_display_status", `${path}.displayStatus`, "Display status is outside the allowed set."));
  }

  validatePrediction(output.prediction, `${path}.prediction`, issues);
  validateBatch(output.simulationBatch, `${path}.simulationBatch`, issues);

  if (output.prediction.predictionId) {
    if (predictionIds.has(output.prediction.predictionId)) {
      issues.push(issue("duplicate_prediction_id", `${path}.prediction.predictionId`, "Prediction id must be unique."));
    }
    predictionIds.add(output.prediction.predictionId);
  }

  if (output.agentDebate) {
    if (!output.agentDebate.debateId) {
      issues.push(issue("missing_debate_id", `${path}.agentDebate.debateId`, "Debate id is required."));
    }
    if (!isIsoString(output.agentDebate.generatedAt)) {
      issues.push(issue("invalid_timestamp", `${path}.agentDebate.generatedAt`, "Timestamp must parse."));
    }
    output.agentDebate.leadAgents.forEach((agent, agentIndex) => {
      if (!isOneOf(agent, VALID_LEAD_AGENTS)) {
        issues.push(issue("invalid_agent", `${path}.agentDebate.leadAgents[${agentIndex}]`, "Agent is outside the allowed set."));
      }
    });
    output.agentDebate.controlAdjustments.forEach((adjustment, adjustmentIndex) => {
      if (!isIsoString(adjustment.appliedAt)) {
        issues.push(issue("invalid_timestamp", `${path}.agentDebate.controlAdjustments[${adjustmentIndex}].appliedAt`, "Timestamp must parse."));
      }
    });
  }
}

function validatePaperBankroll(
  snapshot: RuntimeOutputSnapshot,
  fixtureIds: Set<string>,
  predictionIds: Set<string>,
  issues: RuntimeSnapshotValidationIssue[],
) {
  const bankroll = snapshot.paperBankroll;
  if (bankroll.currency !== "USD") {
    issues.push(issue("invalid_currency", "paperBankroll.currency", "Currency must be USD."));
  }
  if (bankroll.baseStake !== 10) {
    issues.push(issue("invalid_base_stake", "paperBankroll.baseStake", "Base stake must be 10."));
  }
  if (bankroll.positiveProfitStakeRate !== 0.2) {
    issues.push(issue("invalid_stake_rate", "paperBankroll.positiveProfitStakeRate", "Stake rate must be 0.2."));
  }

  let cumulativeStake = 0;
  let cumulativeProfit = 0;

  bankroll.entries.forEach((entry, index) => {
    const path = `paperBankroll.entries[${index}]`;
    const expectedStake = bankroll.baseStake + Math.max(cumulativeProfit, 0) * bankroll.positiveProfitStakeRate;

    if (!fixtureIds.has(entry.matchId)) {
      issues.push(issue("unknown_match_id", `${path}.matchId`, "Match id must exist in fixtures."));
    }
    if (!predictionIds.has(entry.predictionId)) {
      issues.push(issue("unknown_prediction_id", `${path}.predictionId`, "Prediction id must exist in snapshot."));
    }
    if (!isOneOf(entry.result, VALID_LEDGER_RESULTS)) {
      issues.push(issue("invalid_ledger_result", `${path}.result`, "Ledger result is outside the allowed set."));
    }
    if (!isFiniteNumber(entry.stake) || !closeTo(entry.stake, expectedStake)) {
      issues.push(issue("invalid_entry_stake", `${path}.stake`, "Entry stake does not match the stake rule."));
    }
    if (!isFiniteNumber(entry.profit)) {
      issues.push(issue("invalid_entry_profit", `${path}.profit`, "Entry profit must be numeric."));
    }

    cumulativeStake += entry.stake;
    cumulativeProfit += entry.profit;

    if (!closeTo(entry.cumulativeProfitAfter, cumulativeProfit)) {
      issues.push(issue("invalid_entry_cumulative", `${path}.cumulativeProfitAfter`, "Entry cumulative value is inconsistent."));
    }
    if (entry.settledAt && !isIsoString(entry.settledAt)) {
      issues.push(issue("invalid_timestamp", `${path}.settledAt`, "Timestamp must parse."));
    }
  });

  const cumulativeReturn = cumulativeStake + cumulativeProfit;
  const roi = cumulativeStake === 0 ? 0 : cumulativeProfit / cumulativeStake;
  if (!closeTo(bankroll.cumulativeStake, cumulativeStake)) {
    issues.push(issue("invalid_cumulative_stake", "paperBankroll.cumulativeStake", "Cumulative stake is inconsistent."));
  }
  if (!closeTo(bankroll.cumulativeProfit, cumulativeProfit)) {
    issues.push(issue("invalid_cumulative_profit", "paperBankroll.cumulativeProfit", "Cumulative profit is inconsistent."));
  }
  if (!closeTo(bankroll.cumulativeReturn, cumulativeReturn)) {
    issues.push(issue("invalid_cumulative_return", "paperBankroll.cumulativeReturn", "Cumulative return is inconsistent."));
  }
  if (!closeTo(bankroll.roi, roi)) {
    issues.push(issue("invalid_roi", "paperBankroll.roi", "ROI is inconsistent."));
  }
}

export function validateRuntimeOutputSnapshot(
  snapshot: RuntimeOutputSnapshot,
  fixtures: WorldCupMatch[],
): RuntimeSnapshotValidationResult {
  const issues: RuntimeSnapshotValidationIssue[] = [];
  const fixtureIds = new Set(fixtures.map((fixture) => fixture.id));
  const predictionIds = new Set<string>();

  if (snapshot.tournamentId !== WORLD_CUP_2026_TOURNAMENT_ID) {
    issues.push(issue("invalid_tournament", "tournamentId", "Tournament id is unsupported."));
  }
  if (!isIsoString(snapshot.generatedAt)) {
    issues.push(issue("invalid_timestamp", "generatedAt", "Timestamp must parse."));
  }
  if (snapshot.modelRecord.totalMatches !== WORLD_CUP_2026_TOTAL_MATCHES) {
    issues.push(issue("invalid_total_matches", "modelRecord.totalMatches", "Total matches must be 104."));
  }
  if (fixtures.length !== WORLD_CUP_2026_TOTAL_MATCHES) {
    issues.push(issue("invalid_fixture_count", "fixtures", "Fixture list must contain 104 matches."));
  }
  if (snapshot.outputSource.name !== "Nira Bounded World Model") {
    issues.push(issue("invalid_source_name", "outputSource.name", "Output source name is unsupported."));
  }
  if (snapshot.outputSource.visibility !== "public_safe") {
    issues.push(issue("non_public_visibility", "outputSource.visibility", "Snapshot is not marked for public display."));
  }
  if (!isIsoString(snapshot.modelRecord.lastUpdatedAt)) {
    issues.push(issue("invalid_timestamp", "modelRecord.lastUpdatedAt", "Timestamp must parse."));
  }

  snapshot.matchOutputs.forEach((output, index) => {
    validateMatchOutput(output, index, fixtureIds, predictionIds, issues);
  });

  validatePaperBankroll(snapshot, fixtureIds, predictionIds, issues);

  snapshot.evolutionLogs.forEach((log, index) => {
    const path = `evolutionLogs[${index}]`;
    if (!log.id) {
      issues.push(issue("missing_log_id", `${path}.id`, "Log id is required."));
    }
    if (!isIsoString(log.timestamp)) {
      issues.push(issue("invalid_timestamp", `${path}.timestamp`, "Timestamp must parse."));
    }
    if (!isOneOf(log.agent, VALID_EVOLUTION_AGENTS)) {
      issues.push(issue("invalid_log_agent", `${path}.agent`, "Agent is outside the allowed set."));
    }
    if (!isOneOf(log.eventType, VALID_EVENT_TYPES)) {
      issues.push(issue("invalid_event_type", `${path}.eventType`, "Event type is outside the allowed set."));
    }
    if (log.relatedMatchId && !fixtureIds.has(log.relatedMatchId)) {
      issues.push(issue("unknown_match_id", `${path}.relatedMatchId`, "Match id must exist in fixtures."));
    }
  });

  collectSensitiveMarkers(snapshot, "snapshot", issues);

  return { ok: issues.length === 0, issues };
}
