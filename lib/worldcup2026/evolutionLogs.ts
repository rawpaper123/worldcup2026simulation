import type { EvolutionLog } from "./worldModelTypes";

export const worldCup2026SeedEvolutionLogs: EvolutionLog[] = [
  {
    id: "log-2026-06-12-1320",
    timestamp: "2026-06-12T13:20:00.000Z",
    agent: "Control Agent",
    eventType: "confidence_update",
    textZh: "Control Agent 下调了控球优势直接转化为胜向的可信度。",
    textEn: "Control Agent lowered confidence when possession advantage does not convert into outcome pressure.",
    relatedMatchId: "wc2026-001",
  },
  {
    id: "log-2026-06-12-0940",
    timestamp: "2026-06-12T09:40:00.000Z",
    agent: "Risk Agent",
    eventType: "weight_update",
    textZh: "Risk Agent 提高了揭幕战压力变量的权重。",
    textEn: "Risk Agent increased the weight of opening-match pressure.",
    relatedMatchId: "wc2026-001",
  },
  {
    id: "log-2026-06-12-0615",
    timestamp: "2026-06-12T06:15:00.000Z",
    agent: "Data Agent",
    eventType: "weight_update",
    textZh: "Data Agent 修正了近期状态对小组赛首轮的影响系数。",
    textEn: "Data Agent adjusted recent-form weighting for first-round group matches.",
    relatedMatchId: "wc2026-003",
  },
  {
    id: "log-2026-06-11-2120",
    timestamp: "2026-06-11T21:20:00.000Z",
    agent: "Momentum Agent",
    eventType: "scenario_update",
    textZh: "Momentum Agent 增加了主场情绪与开局节奏的交互变量。",
    textEn: "Momentum Agent added interaction variables for home energy and early rhythm.",
    relatedMatchId: "wc2026-001",
  },
];
