import type { WorldCupMatch } from "./types";

export type PredictionDirection = "teamA_win" | "draw" | "teamB_win";

export type ConfidenceLabel = "low" | "medium" | "high";

export type PredictionStatus = "draft" | "pre_match_locked" | "settled";

export type MatchPrediction = {
  matchId: string;
  predictionId: string;
  generatedAt: string;
  predictionType: "1x2";
  direction: PredictionDirection;
  confidenceLabel: ConfidenceLabel;
  confidenceScore?: number;
  status: PredictionStatus;
  settledCorrect?: boolean;
  visible: boolean;
};

export type SimulationBatchStatus =
  | "not_started"
  | "running"
  | "completed"
  | "waiting_for_key_variables";

export type SimulationBatch = {
  matchId: string;
  batchId: string;
  targetRuns: 1000;
  completedRuns: number;
  status: SimulationBatchStatus;
  lastUpdatedAt: string;
  aggregate: {
    teamAWinPct: number;
    drawPct: number;
    teamBWinPct: number;
  };
  currentDirection: PredictionDirection;
  confidenceLabel: ConfidenceLabel;
  agentSummaryZh: string;
  agentSummaryEn: string;
};

export type LeadAgentId = "tactical" | "momentum" | "risk" | "data" | "control";

export type ControlAdjustment = {
  type:
    | "overconfidence_downshift"
    | "risk_weight_increase"
    | "data_correction"
    | "scenario_rerun";
  descriptionZh: string;
  descriptionEn: string;
  appliedAt: string;
};

export type AgentDebate = {
  matchId: string;
  debateId: string;
  generatedAt: string;
  leadAgents: LeadAgentId[];
  subAgentCount: number;
  summaryZh: string;
  summaryEn: string;
  controlAdjustments: ControlAdjustment[];
};

export type EvolutionAgent =
  | "Tactical Agent"
  | "Momentum Agent"
  | "Risk Agent"
  | "Data Agent"
  | "Control Agent";

export type EvolutionLog = {
  id: string;
  timestamp: string;
  agent: EvolutionAgent;
  eventType:
    | "hit"
    | "miss"
    | "weight_update"
    | "confidence_update"
    | "scenario_update";
  textZh: string;
  textEn: string;
  relatedMatchId?: string;
};

export type ModelRecord = {
  predictedCount: number;
  correctCount: number;
  totalMatches: 104;
  accuracy: number;
  currentCorrectStreak: number;
  bestCorrectStreak: number;
  lastUpdatedAt: string;
};

export type PaperBankrollEntry = {
  matchId: string;
  predictionId: string;
  stake: number;
  result: "win" | "loss" | "push" | "pending";
  profit: number;
  cumulativeProfitAfter: number;
  settledAt?: string;
};

export type PaperBankrollState = {
  currency: "USD";
  baseStake: 10;
  positiveProfitStakeRate: 0.2;
  cumulativeStake: number;
  cumulativeReturn: number;
  cumulativeProfit: number;
  roi: number;
  entries: PaperBankrollEntry[];
};

export type WorldModelRuntime = {
  id: string;
  name: "Nira Bounded World Model";
  version: string;
  generatedAt: string;
  fixtureSourceVersion: string;
  predictionSourceVersion: string;
  runtimeKind: "seed" | "adapter";
};

export type BoundedWorldState = {
  id: string;
  tournamentId: "worldcup2026";
  runtime: WorldModelRuntime;
  generatedAt: string;
  fixtureSourceVersion: string;
  predictionSourceVersion: string;
  modelRecord: ModelRecord;
  fixtures: WorldCupMatch[];
  predictions: MatchPrediction[];
  simulationBatches: SimulationBatch[];
  agentDebates: AgentDebate[];
  evolutionLogs: EvolutionLog[];
  paperBankroll: PaperBankrollState;
};

export type SimulationEngine = {
  getWorldState(tournamentId: string): BoundedWorldState;
  getFixtures(): WorldCupMatch[];
  getMatch(matchId: string): WorldCupMatch | undefined;
  getPrediction(matchId: string): MatchPrediction | undefined;
  getSimulationBatch(matchId: string): SimulationBatch | undefined;
  getAgentDebate(matchId: string): AgentDebate | undefined;
  getEvolutionLogs(limit?: number): EvolutionLog[];
  getPaperBankroll(): PaperBankrollState;
  getModelRecord(): ModelRecord;
};
