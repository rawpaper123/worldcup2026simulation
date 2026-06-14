import type {
  ConfidenceLabel,
  ControlAdjustment,
  EvolutionAgent,
  LeadAgentId,
  ModelRecord,
  PaperBankrollEntry,
  PaperBankrollState,
  PredictionDirection,
  PredictionStatus,
  SimulationBatch,
  SimulationBatchStatus,
} from "./worldModelTypes";

export type RuntimeOutputSourceKind = "seed" | "runtime_snapshot";

export type RuntimeOutputVisibility = "public_safe" | "restricted";

export type RuntimeOutputSource = {
  kind: RuntimeOutputSourceKind;
  visibility: RuntimeOutputVisibility;
  name: "Nira Bounded World Model";
  notes?: string;
};

export type RuntimePrediction = {
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

export type RuntimeSimulationBatch = SimulationBatch & {
  directionOverrideReason?: string;
};

export type RuntimeControlAdjustment = ControlAdjustment;

export type RuntimeAgentDebate = {
  debateId: string;
  generatedAt: string;
  leadAgents: LeadAgentId[];
  subAgentCount: number;
  summaryZh: string;
  summaryEn: string;
  controlAdjustments: RuntimeControlAdjustment[];
};

export type RuntimeMatchDisplayStatus =
  | "scheduled"
  | "ready"
  | "running"
  | "locked"
  | "settled";

export type RuntimeMatchOutput = {
  matchId: string;
  prediction: RuntimePrediction;
  simulationBatch: RuntimeSimulationBatch;
  agentDebate?: RuntimeAgentDebate;
  displayStatus: RuntimeMatchDisplayStatus;
};

export type RuntimeEvolutionLog = {
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

export type RuntimeModelRecord = ModelRecord;

export type RuntimePaperBankrollEntry = PaperBankrollEntry;

export type RuntimePaperBankrollState = PaperBankrollState;

export type RuntimeOutputSnapshot = {
  id: string;
  tournamentId: "worldcup2026";
  generatedAt: string;
  runtimeVersion: string;
  fixtureSourceVersion: string;
  outputSource: RuntimeOutputSource;
  modelRecord: RuntimeModelRecord;
  matchOutputs: RuntimeMatchOutput[];
  evolutionLogs: RuntimeEvolutionLog[];
  paperBankroll: RuntimePaperBankrollState;
};

export type RuntimeSnapshotValidationContext = {
  publicSurface: boolean;
};

export type RuntimeSnapshotValidationIssue = {
  code: string;
  path: string;
  message: string;
};

export type RuntimeSnapshotValidationResult = {
  ok: boolean;
  issues: RuntimeSnapshotValidationIssue[];
};

export type RuntimeBatchStatus = SimulationBatchStatus;
