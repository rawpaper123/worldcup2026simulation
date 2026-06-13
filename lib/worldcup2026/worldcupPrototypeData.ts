import type { WorldCupLanguage } from "./types";

export type PrototypeText = Record<WorldCupLanguage, string>;

export type PrototypeDateChip = {
  weekday: PrototypeText;
  date: PrototypeText;
};

export type PrototypeScheduleMatch = {
  time: PrototypeText;
  group: PrototypeText;
  homeCode: string;
  home: PrototypeText;
  awayCode: string;
  away: PrototypeText;
  prediction: PrototypeText;
  state: "correct" | "pending";
  stateLabel: PrototypeText;
};

export type PrototypeScheduleSection = {
  title: PrototypeText;
  sub: PrototypeText;
  matches: PrototypeScheduleMatch[];
};

export type PrototypeSimulationCard = {
  meta: PrototypeText;
  teams: PrototypeText;
  statement: PrototypeText;
  status: PrototypeText;
  rows: Array<{ label: PrototypeText; value: number }>;
  tags: PrototypeText[];
};

export type PrototypeAgent = {
  name: string;
  desc: PrototypeText;
};

export type PrototypeLog = {
  time: string;
  text: PrototypeText;
};

export const prototypeDateChips: PrototypeDateChip[] = [
  ["周五", "Thu", "6月12日", "Jun 11"],
  ["周六", "Fri", "6月13日", "Jun 12"],
  ["周日", "Sat", "6月14日", "Jun 13"],
  ["周一", "Sun", "6月15日", "Jun 14"],
  ["周二", "Mon", "6月16日", "Jun 15"],
  ["周三", "Tue", "6月17日", "Jun 16"],
  ["周四", "Wed", "6月18日", "Jun 17"],
  ["周五", "Thu", "6月19日", "Jun 18"],
  ["周六", "Fri", "6月20日", "Jun 19"],
  ["周日", "Sat", "6月21日", "Jun 20"],
  ["周一", "Sun", "6月22日", "Jun 21"],
  ["周二", "Mon", "6月23日", "Jun 22"],
  ["周三", "Tue", "6月24日", "Jun 23"],
  ["周四", "Wed", "6月25日", "Jun 24"],
  ["周五", "Thu", "6月26日", "Jun 25"],
  ["周六", "Fri", "6月27日", "Jun 26"],
  ["周日", "Sat", "6月28日", "Jun 27"],
].map(([zhWeekday, enWeekday, zhDate, enDate]) => ({
  weekday: { zh: zhWeekday, en: enWeekday },
  date: { zh: zhDate, en: enDate },
}));

export const prototypeScheduleSections: PrototypeScheduleSection[] = [
  {
    title: { zh: "6月12日 · 北京时间", en: "Thu, Jun 11 · ET" },
    sub: { zh: "1 场比赛", en: "1 match" },
    matches: [
      {
        time: { zh: "09:00", en: "9:00 PM" },
        group: { zh: "A组", en: "Group A" },
        homeCode: "MEX",
        home: { zh: "墨西哥", en: "Mexico" },
        awayCode: "RSA",
        away: { zh: "南非", en: "South Africa" },
        prediction: { zh: "墨西哥胜 · 56%", en: "Mexico Win · 56%" },
        state: "correct",
        stateLabel: { zh: "命中 ✓", en: "Correct ✓" },
      },
    ],
  },
  {
    title: { zh: "6月13日 · 北京时间", en: "Fri, Jun 12 · ET" },
    sub: { zh: "2 场比赛", en: "2 matches" },
    matches: [
      {
        time: { zh: "18:00", en: "6:00 AM" },
        group: { zh: "A组", en: "Group A" },
        homeCode: "KOR",
        home: { zh: "韩国", en: "Republic of Korea" },
        awayCode: "CZE",
        away: { zh: "捷克", en: "Czechia" },
        prediction: { zh: "韩国胜 · 51%", en: "Korea Win · 51%" },
        state: "pending",
        stateLabel: { zh: "未开赛", en: "Pending" },
      },
      {
        time: { zh: "11:00", en: "11:00 PM" },
        group: { zh: "B组", en: "Group B" },
        homeCode: "CAN",
        home: { zh: "加拿大", en: "Canada" },
        awayCode: "BIH",
        away: { zh: "波黑", en: "Bosnia and Herzegovina" },
        prediction: { zh: "加拿大胜 · 54%", en: "Canada Win · 54%" },
        state: "pending",
        stateLabel: { zh: "未开赛", en: "Pending" },
      },
    ],
  },
];

export const prototypeSimulationCards: PrototypeSimulationCard[] = [
  {
    meta: { zh: "A组 · 6月12日 · 09:00 北京时间", en: "Group A · Jun 11 · 9:00 PM ET" },
    teams: { zh: "墨西哥 vs 南非", en: "Mexico vs South Africa" },
    statement: { zh: "已在模拟世界里跑完 1000 场。", en: "Completed 1,000 simulated matches." },
    status: { zh: "模拟状态：已完成 · 最近更新：6月12日 09:00 北京时间", en: "Status: completed · Last updated: Jun 11 · 9:00 PM ET" },
    rows: [
      { label: { zh: "墨西哥", en: "Mexico" }, value: 56 },
      { label: { zh: "平局", en: "Draw" }, value: 27 },
      { label: { zh: "南非", en: "South Africa" }, value: 17 },
    ],
    tags: [
      { zh: "墨西哥胜", en: "Mexico Win" },
      { zh: "56%", en: "56%" },
      { zh: "高一致性", en: "High consensus" },
    ],
  },
  {
    meta: { zh: "B组 · 6月13日 · 11:00 北京时间", en: "Group B · Jun 12 · 11:00 PM ET" },
    teams: { zh: "加拿大 vs 波黑", en: "Canada vs Bosnia and Herzegovina" },
    statement: { zh: "正在模拟：已完成 642 / 1000 场。", en: "Running match 642 / 1,000; direction is still being calibrated." },
    status: { zh: "最近更新：6月12日 09:00 北京时间", en: "Last updated: Jun 11 · 9:00 PM ET" },
    rows: [
      { label: { zh: "已完成", en: "Completed" }, value: 64 },
      { label: { zh: "加拿大胜", en: "Canada Win" }, value: 43 },
      { label: { zh: "平局", en: "Draw" }, value: 29 },
    ],
    tags: [
      { zh: "阶段性结果", en: "Interim" },
      { zh: "642 / 1000", en: "642 / 1000" },
      { zh: "每日更新", en: "Daily update" },
    ],
  },
  {
    meta: { zh: "D组 · 6月13日 · 17:00 北京时间", en: "Group D · Jun 13 · 5:00 AM ET" },
    teams: { zh: "美国 vs 巴拉圭", en: "USA vs Paraguay" },
    statement: { zh: "已在模拟世界里跑完 1000 场。", en: "Completed 1,000 simulated matches." },
    status: { zh: "模拟状态：已完成 · 最近更新：6月12日 09:00 北京时间", en: "Status: completed · Last updated: Jun 11 · 9:00 PM ET" },
    rows: [
      { label: { zh: "美国", en: "USA" }, value: 58 },
      { label: { zh: "平局", en: "Draw" }, value: 24 },
      { label: { zh: "巴拉圭", en: "Paraguay" }, value: 18 },
    ],
    tags: [
      { zh: "美国胜", en: "USA Win" },
      { zh: "58%", en: "58%" },
      { zh: "冷门预警", en: "Upset Watch" },
    ],
  },
];

export const prototypeAgents: PrototypeAgent[] = [
  {
    name: "Tactical Agent",
    desc: { zh: "判断阵型、空间、压迫和攻防结构。", en: "Reads formation, spacing, pressure, and match structure." },
  },
  {
    name: "Momentum Agent",
    desc: { zh: "判断压力、节奏、士气和比赛势能。", en: "Reads pressure, rhythm, morale, and match momentum." },
  },
  {
    name: "Risk Agent",
    desc: { zh: "寻找冷门、红牌、伤病和极端路径。", en: "Searches for upset paths, red cards, injuries, and edge cases." },
  },
  {
    name: "Data Agent",
    desc: { zh: "处理排名、近期表现和基础统计信号。", en: "Reads ranking, recent form, and baseline statistical signals." },
  },
  {
    name: "Control Agent",
    desc: { zh: "检查过度自信，防止错误信号污染模型。", en: "Checks overconfidence and prevents noisy feedback from corrupting the model." },
  },
];

export const prototypeLogs: PrototypeLog[] = [
  {
    time: "2026-06-12\n09:00 BJT",
    text: {
      zh: "Control Agent 下调了“控球优势直接转化为胜率”的可信度。",
      en: "Control Agent lowered confidence when possession advantage does not convert into outcome pressure.",
    },
  },
  {
    time: "2026-06-11\n21:40 BJT",
    text: {
      zh: "Risk Agent 提高了揭幕战压力变量的权重。",
      en: "Risk Agent increased the weight of opening-match pressure.",
    },
  },
  {
    time: "2026-06-11\n18:15 BJT",
    text: {
      zh: "Data Agent 修正了近期状态对小组赛首轮的影响系数。",
      en: "Data Agent adjusted recent-form weighting for first-round group matches.",
    },
  },
  {
    time: "2026-06-11\n13:20 BJT",
    text: {
      zh: "Momentum Agent 增加了主场情绪与开局节奏的交互变量。",
      en: "Momentum Agent added interaction variables for home energy and early rhythm.",
    },
  },
];
