import { worldCup2026SeedPredictions } from "./predictions";
import type { PaperBankrollEntry, PaperBankrollState } from "./worldModelTypes";

const BASE_STAKE = 10;
const POSITIVE_PROFIT_STAKE_RATE = 0.2;

function stakeFor(cumulativeProfit: number) {
  return BASE_STAKE + Math.max(cumulativeProfit, 0) * POSITIVE_PROFIT_STAKE_RATE;
}

function buildEntries(): PaperBankrollEntry[] {
  let cumulativeProfit = 0;

  return [
    { matchId: "wc2026-001", result: "win" as const, profit: 8, settledAt: "2026-06-11T21:00:00.000Z" },
    { matchId: "wc2026-002", result: "loss" as const, profit: -12, settledAt: "2026-06-12T04:05:00.000Z" },
    { matchId: "wc2026-003", result: "pending" as const, profit: 0 },
  ].map((entry) => {
    const prediction = worldCup2026SeedPredictions.find((item) => item.matchId === entry.matchId);
    const stake = stakeFor(cumulativeProfit);
    cumulativeProfit += entry.profit;

    return {
      matchId: entry.matchId,
      predictionId: prediction?.predictionId ?? `prediction-${entry.matchId}`,
      stake,
      result: entry.result,
      profit: entry.profit,
      cumulativeProfitAfter: cumulativeProfit,
      settledAt: entry.settledAt,
    };
  });
}

export const worldCup2026SeedPaperBankrollEntries = buildEntries();

const cumulativeStake = worldCup2026SeedPaperBankrollEntries.reduce(
  (sum, entry) => sum + entry.stake,
  0,
);
const cumulativeProfit = worldCup2026SeedPaperBankrollEntries.reduce(
  (sum, entry) => sum + entry.profit,
  0,
);
const cumulativeReturn = cumulativeStake + cumulativeProfit;

export const worldCup2026SeedPaperBankroll: PaperBankrollState = {
  currency: "USD",
  baseStake: BASE_STAKE,
  positiveProfitStakeRate: POSITIVE_PROFIT_STAKE_RATE,
  cumulativeStake,
  cumulativeReturn,
  cumulativeProfit,
  roi: cumulativeStake === 0 ? 0 : cumulativeProfit / cumulativeStake,
  entries: worldCup2026SeedPaperBankrollEntries,
};
