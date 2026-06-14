import type { AgentDebate, LeadAgentId } from "./worldModelTypes";
import type { LocalizedText } from "./types";

export type AgentProfile = {
  id: LeadAgentId;
  name: string;
  role: LocalizedText;
  subAgentCount: 5;
};

export const worldCup2026AgentProfiles: AgentProfile[] = [
  {
    id: "tactical",
    name: "Tactical Agent",
    role: { zh: "判断阵型、空间、压迫和攻防结构。", en: "Reads formation, spacing, pressure, and match structure." },
    subAgentCount: 5,
  },
  {
    id: "momentum",
    name: "Momentum Agent",
    role: { zh: "判断压力、节奏、士气和比赛势能。", en: "Reads pressure, rhythm, morale, and match momentum." },
    subAgentCount: 5,
  },
  {
    id: "risk",
    name: "Risk Agent",
    role: { zh: "寻找冷门、红牌、伤病和极端路径。", en: "Searches for upset paths, red cards, injuries, and edge cases." },
    subAgentCount: 5,
  },
  {
    id: "data",
    name: "Data Agent",
    role: { zh: "处理排名、近期表现和基础统计信号。", en: "Reads ranking, recent form, and baseline statistical signals." },
    subAgentCount: 5,
  },
  {
    id: "control",
    name: "Control Agent",
    role: { zh: "检查过度自信，防止错误信号污染模型。", en: "Checks overconfidence and prevents noisy feedback from corrupting the model." },
    subAgentCount: 5,
  },
];

export const worldCup2026SeedAgentDebates: AgentDebate[] = [
  {
    matchId: "wc2026-001",
    debateId: "debate-wc2026-001",
    generatedAt: "2026-06-11T18:10:00.000Z",
    leadAgents: ["tactical", "momentum", "risk", "data", "control"],
    subAgentCount: 25,
    summaryZh: "战术与节奏代理给出主队倾向，风险代理保留平局扰动，控制代理下调过度自信。",
    summaryEn: "Tactical and momentum reads lean toward the home side, while risk and control agents keep the edge moderated.",
    controlAdjustments: [
      {
        type: "overconfidence_downshift",
        descriptionZh: "控制代理下调开幕战主场变量的过度自信。",
        descriptionEn: "Control Agent reduced overconfidence around opening-match home variables.",
        appliedAt: "2026-06-11T18:16:00.000Z",
      },
    ],
  },
  {
    matchId: "wc2026-003",
    debateId: "debate-wc2026-003",
    generatedAt: "2026-06-12T16:00:00.000Z",
    leadAgents: ["tactical", "momentum", "risk", "data", "control"],
    subAgentCount: 25,
    summaryZh: "数据代理要求延后锁定，风险代理提高了压力变量权重。",
    summaryEn: "Data checks delay the lock, and risk checks increase pressure-variable weight.",
    controlAdjustments: [
      {
        type: "risk_weight_increase",
        descriptionZh: "风险代理提高首轮压力变量权重。",
        descriptionEn: "Risk Agent increased pressure-variable weight for the opening round.",
        appliedAt: "2026-06-12T16:12:00.000Z",
      },
    ],
  },
];
