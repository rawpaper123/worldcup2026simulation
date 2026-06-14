export type WorldCupLanguage = "zh" | "en";

export type LocalizedText = Record<WorldCupLanguage, string>;

export type WorldCupGroup =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L";

export type WorldCupMatchStage =
  | "group"
  | "round_of_32"
  | "round_of_16"
  | "quarter_final"
  | "semi_final"
  | "third_place"
  | "final";

export type WorldCupMatchStatus =
  | "scheduled"
  | "live"
  | "completed"
  | "postponed"
  | "tbd";

export type WorldCupTeam = {
  id: string;
  code: string;
  name: LocalizedText;
  group?: WorldCupGroup;
};

export type TeamSlot = {
  type: "team" | "placeholder";
  teamId?: string;
  nameZh?: string;
  nameEn?: string;
  code?: string;
  placeholderZh?: string;
  placeholderEn?: string;
};

export type MatchScore = {
  teamA: number;
  teamB: number;
  afterExtraTime?: boolean;
  penalties?: {
    teamA: number;
    teamB: number;
  };
};

export type DataSourceMeta = {
  sourceName: string;
  sourceUrl?: string;
  sourceUpdatedAt: string;
  notes?: string;
};

export type WorldCupMatch = {
  id: string;
  matchNumber: number;
  stage: WorldCupMatchStage;
  group?: WorldCupGroup;
  kickoffUtc: string;
  venueId: string;
  city: string;
  country: string;
  teamA: TeamSlot;
  teamB: TeamSlot;
  status: WorldCupMatchStatus;
  score?: MatchScore;
  winnerTeamId?: string;
  source: DataSourceMeta;
};

export type Team = {
  id: string;
  code: string;
  name: LocalizedText;
};

export type MatchStage = "group" | "knockout";

export type MatchStatus = "scheduled" | "simulating" | "settled";

export type PredictionDirection = "home" | "draw" | "away";

export type PredictionConfidence = "low" | "medium" | "high";

export type WorldCupFixture = {
  id: string;
  matchNumber: number;
  stage: MatchStage;
  group?: string;
  kickoffUtc: string;
  home: Team;
  away: Team;
  status: MatchStatus;
  score?: {
    home: number;
    away: number;
  };
  predictionId?: string;
};

export type KnockoutNode = {
  id: string;
  round: LocalizedText;
  matchNumber: number;
  slotA: LocalizedText;
  slotB: LocalizedText;
  pathNote: LocalizedText;
};

export type WorldCupPrediction = {
  id: string;
  matchId: string;
  direction: PredictionDirection;
  confidence: PredictionConfidence;
  probability: {
    home: number;
    draw: number;
    away: number;
  };
  predictedAtUtc: string;
  settledCorrect?: boolean;
};

export type WorldCupModelRecord = {
  accuracy: number;
  predictedMatches: number;
  correctMatches: number;
  totalMatches: number;
  currentCorrectStreak: number;
  bestCorrectStreak: number;
  updatedAtUtc: string;
};

export type PaperBankrollLedgerEntry = {
  match_id: string;
  prediction_direction: PredictionDirection;
  stake_amount: number;
  settled_result: PredictionDirection;
  paper_profit: number;
  cumulative_profit: number;
  cumulative_stake: number;
  cumulative_return: number;
  roi: number;
  settled_at: string;
};

export type PaperBankroll = {
  currency: "USD";
  cumulativeProfit: number;
  cumulativeStake: number;
  cumulativeReturn: number;
  roi: number;
  ledger: PaperBankrollLedgerEntry[];
};

export type SimulatedMatchStatus = "completed" | "running";

export type SimulatedMatchCard = {
  id: string;
  matchId: string;
  status: SimulatedMatchStatus;
  completedRuns: number;
  totalRuns: number;
  updatedAtUtc: string;
  resultShare: {
    home: number;
    draw: number;
    away: number;
  };
  direction?: PredictionDirection;
};

export type AgentCluster = {
  id: string;
  name: string;
  role: LocalizedText;
  subAgentCount: number;
  load: number;
};

export type EvolutionLogEntry = {
  id: string;
  timestampUtc: string;
  agent: string;
  message: LocalizedText;
};

export type SocialCardAction = {
  id: string;
  label: LocalizedText;
};
