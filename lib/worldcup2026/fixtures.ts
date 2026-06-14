import { worldCup2026TeamsByCode } from "./teams";
import { worldCup2026VenuesById } from "./venues";
import type {
  DataSourceMeta,
  TeamSlot,
  WorldCupGroup,
  WorldCupMatch,
  WorldCupMatchStage,
} from "./types";

export const WORLD_CUP_2026_TOURNAMENT_ID = "worldcup2026";
export const WORLD_CUP_2026_TOTAL_MATCHES = 104;
export const WORLD_CUP_2026_GROUP_MATCHES = 72;
export const WORLD_CUP_2026_KNOCKOUT_MATCHES = 32;
export const WORLD_CUP_2026_NEXT_MATCH_ID = "wc2026-001";

export const worldCup2026FixtureSource: DataSourceMeta = {
  sourceName: "FIFA World Cup 26 match schedule",
  sourceUrl:
    "https://digitalhub.fifa.com/asset/4b5d4417-3343-4732-9cdf-14b6662af407/FWC26-Match-Schedule_English.pdf",
  sourceUpdatedAt: "2026-04-10T00:00:00.000Z",
  notes: "Checked-in schedule seed with UTC kickoff timestamps.",
};

type GroupFixtureRow = [
  matchNumber: number,
  group: WorldCupGroup,
  kickoffUtc: string,
  venueId: string,
  teamACode: string,
  teamBCode: string,
];

const groupFixtureRows: GroupFixtureRow[] = [
  [1, "A", "2026-06-11T19:00:00.000Z", "mexico-city", "MEX", "RSA"],
  [2, "A", "2026-06-12T02:00:00.000Z", "guadalajara", "KOR", "CZE"],
  [3, "B", "2026-06-12T19:00:00.000Z", "toronto", "CAN", "BIH"],
  [4, "D", "2026-06-13T01:00:00.000Z", "los-angeles", "USA", "PAR"],
  [5, "C", "2026-06-14T01:00:00.000Z", "boston", "HAI", "SCO"],
  [6, "D", "2026-06-14T04:00:00.000Z", "vancouver", "AUS", "TUR"],
  [7, "C", "2026-06-13T22:00:00.000Z", "new-york-new-jersey", "BRA", "MAR"],
  [8, "B", "2026-06-13T19:00:00.000Z", "san-francisco-bay-area", "QAT", "SUI"],
  [9, "E", "2026-06-14T23:00:00.000Z", "philadelphia", "CIV", "ECU"],
  [10, "E", "2026-06-14T17:00:00.000Z", "houston", "GER", "CUW"],
  [11, "F", "2026-06-14T20:00:00.000Z", "dallas", "NED", "JPN"],
  [12, "F", "2026-06-15T02:00:00.000Z", "monterrey", "SWE", "TUN"],
  [13, "H", "2026-06-15T22:00:00.000Z", "miami", "KSA", "URU"],
  [14, "H", "2026-06-15T16:00:00.000Z", "atlanta", "ESP", "CPV"],
  [15, "G", "2026-06-16T01:00:00.000Z", "los-angeles", "IRN", "NZL"],
  [16, "G", "2026-06-15T19:00:00.000Z", "vancouver", "BEL", "EGY"],
  [17, "I", "2026-06-16T19:00:00.000Z", "new-york-new-jersey", "FRA", "SEN"],
  [18, "I", "2026-06-16T22:00:00.000Z", "boston", "IRQ", "NOR"],
  [19, "J", "2026-06-17T01:00:00.000Z", "kansas-city", "ARG", "ALG"],
  [20, "J", "2026-06-17T04:00:00.000Z", "san-francisco-bay-area", "AUT", "JOR"],
  [21, "L", "2026-06-17T23:00:00.000Z", "toronto", "GHA", "PAN"],
  [22, "L", "2026-06-17T20:00:00.000Z", "dallas", "ENG", "CRO"],
  [23, "K", "2026-06-17T17:00:00.000Z", "houston", "POR", "COD"],
  [24, "K", "2026-06-18T02:00:00.000Z", "mexico-city", "UZB", "COL"],
  [25, "A", "2026-06-18T16:00:00.000Z", "atlanta", "CZE", "RSA"],
  [26, "B", "2026-06-18T19:00:00.000Z", "los-angeles", "SUI", "BIH"],
  [27, "B", "2026-06-18T22:00:00.000Z", "vancouver", "CAN", "QAT"],
  [28, "A", "2026-06-19T01:00:00.000Z", "guadalajara", "MEX", "KOR"],
  [29, "C", "2026-06-20T00:30:00.000Z", "philadelphia", "BRA", "HAI"],
  [30, "C", "2026-06-19T22:00:00.000Z", "boston", "SCO", "MAR"],
  [31, "D", "2026-06-20T03:00:00.000Z", "san-francisco-bay-area", "TUR", "PAR"],
  [32, "D", "2026-06-19T19:00:00.000Z", "seattle", "USA", "AUS"],
  [33, "E", "2026-06-20T20:00:00.000Z", "toronto", "GER", "CIV"],
  [34, "E", "2026-06-21T03:00:00.000Z", "kansas-city", "ECU", "CUW"],
  [35, "F", "2026-06-20T17:00:00.000Z", "houston", "NED", "SWE"],
  [36, "F", "2026-06-21T04:00:00.000Z", "monterrey", "TUN", "JPN"],
  [37, "H", "2026-06-21T22:00:00.000Z", "miami", "URU", "CPV"],
  [38, "H", "2026-06-21T16:00:00.000Z", "atlanta", "ESP", "KSA"],
  [39, "G", "2026-06-21T19:00:00.000Z", "los-angeles", "BEL", "IRN"],
  [40, "G", "2026-06-22T01:00:00.000Z", "vancouver", "NZL", "EGY"],
  [41, "I", "2026-06-23T00:00:00.000Z", "new-york-new-jersey", "NOR", "SEN"],
  [42, "I", "2026-06-22T21:00:00.000Z", "philadelphia", "FRA", "IRQ"],
  [43, "J", "2026-06-22T17:00:00.000Z", "dallas", "ARG", "AUT"],
  [44, "J", "2026-06-23T03:00:00.000Z", "san-francisco-bay-area", "JOR", "ALG"],
  [45, "L", "2026-06-23T20:00:00.000Z", "boston", "ENG", "GHA"],
  [46, "L", "2026-06-23T23:00:00.000Z", "toronto", "PAN", "CRO"],
  [47, "K", "2026-06-23T17:00:00.000Z", "houston", "POR", "UZB"],
  [48, "K", "2026-06-24T02:00:00.000Z", "guadalajara", "COL", "COD"],
  [49, "C", "2026-06-24T22:00:00.000Z", "miami", "SCO", "BRA"],
  [50, "C", "2026-06-24T22:00:00.000Z", "atlanta", "MAR", "HAI"],
  [51, "B", "2026-06-24T19:00:00.000Z", "vancouver", "SUI", "CAN"],
  [52, "B", "2026-06-24T19:00:00.000Z", "seattle", "BIH", "QAT"],
  [53, "A", "2026-06-25T01:00:00.000Z", "mexico-city", "CZE", "MEX"],
  [54, "A", "2026-06-25T01:00:00.000Z", "monterrey", "RSA", "KOR"],
  [55, "E", "2026-06-25T20:00:00.000Z", "philadelphia", "CUW", "CIV"],
  [56, "E", "2026-06-25T20:00:00.000Z", "new-york-new-jersey", "ECU", "GER"],
  [57, "F", "2026-06-25T23:00:00.000Z", "dallas", "JPN", "SWE"],
  [58, "F", "2026-06-25T23:00:00.000Z", "kansas-city", "TUN", "NED"],
  [59, "D", "2026-06-26T02:00:00.000Z", "los-angeles", "TUR", "USA"],
  [60, "D", "2026-06-26T02:00:00.000Z", "san-francisco-bay-area", "PAR", "AUS"],
  [61, "I", "2026-06-26T19:00:00.000Z", "boston", "NOR", "FRA"],
  [62, "I", "2026-06-26T19:00:00.000Z", "toronto", "SEN", "IRQ"],
  [63, "G", "2026-06-27T03:00:00.000Z", "seattle", "EGY", "IRN"],
  [64, "G", "2026-06-27T03:00:00.000Z", "vancouver", "NZL", "BEL"],
  [65, "H", "2026-06-27T00:00:00.000Z", "houston", "CPV", "KSA"],
  [66, "H", "2026-06-27T00:00:00.000Z", "guadalajara", "URU", "ESP"],
  [67, "L", "2026-06-27T21:00:00.000Z", "new-york-new-jersey", "PAN", "ENG"],
  [68, "L", "2026-06-27T21:00:00.000Z", "philadelphia", "CRO", "GHA"],
  [69, "J", "2026-06-28T02:00:00.000Z", "kansas-city", "ALG", "AUT"],
  [70, "J", "2026-06-28T02:00:00.000Z", "dallas", "JOR", "ARG"],
  [71, "K", "2026-06-27T23:30:00.000Z", "miami", "COL", "POR"],
  [72, "K", "2026-06-27T23:30:00.000Z", "atlanta", "COD", "UZB"],
];

type KnockoutFixtureRow = [
  matchNumber: number,
  stage: WorldCupMatchStage,
  kickoffUtc: string,
  venueId: string,
  slotA: string,
  slotB: string,
];

const knockoutFixtureRows: KnockoutFixtureRow[] = [
  [73, "round_of_32", "2026-06-28T19:00:00.000Z", "los-angeles", "2A", "2B"],
  [74, "round_of_32", "2026-06-29T20:30:00.000Z", "boston", "1E", "3A/B/C/D/F"],
  [75, "round_of_32", "2026-06-30T01:00:00.000Z", "monterrey", "1F", "2C"],
  [76, "round_of_32", "2026-06-29T17:00:00.000Z", "houston", "1C", "2F"],
  [77, "round_of_32", "2026-06-30T21:00:00.000Z", "new-york-new-jersey", "1I", "3C/D/F/G/H"],
  [78, "round_of_32", "2026-06-30T17:00:00.000Z", "dallas", "2E", "2I"],
  [79, "round_of_32", "2026-07-01T01:00:00.000Z", "mexico-city", "1A", "3C/E/F/H/I"],
  [80, "round_of_32", "2026-07-01T16:00:00.000Z", "atlanta", "1L", "3E/H/I/J/K"],
  [81, "round_of_32", "2026-07-02T00:00:00.000Z", "san-francisco-bay-area", "1D", "3B/E/F/I/J"],
  [82, "round_of_32", "2026-07-01T20:00:00.000Z", "seattle", "1G", "3A/E/H/I/J"],
  [83, "round_of_32", "2026-07-02T23:00:00.000Z", "toronto", "2K", "2L"],
  [84, "round_of_32", "2026-07-02T19:00:00.000Z", "los-angeles", "1H", "2J"],
  [85, "round_of_32", "2026-07-03T03:00:00.000Z", "vancouver", "1B", "3E/F/G/I/J"],
  [86, "round_of_32", "2026-07-03T22:00:00.000Z", "miami", "1J", "2H"],
  [87, "round_of_32", "2026-07-04T01:30:00.000Z", "kansas-city", "1K", "3D/E/I/J/L"],
  [88, "round_of_32", "2026-07-03T18:00:00.000Z", "dallas", "2D", "2G"],
  [89, "round_of_16", "2026-07-04T21:00:00.000Z", "philadelphia", "W74", "W77"],
  [90, "round_of_16", "2026-07-04T17:00:00.000Z", "houston", "W73", "W75"],
  [91, "round_of_16", "2026-07-05T20:00:00.000Z", "new-york-new-jersey", "W76", "W78"],
  [92, "round_of_16", "2026-07-06T00:00:00.000Z", "mexico-city", "W79", "W80"],
  [93, "round_of_16", "2026-07-06T19:00:00.000Z", "dallas", "W83", "W84"],
  [94, "round_of_16", "2026-07-07T00:00:00.000Z", "seattle", "W81", "W82"],
  [95, "round_of_16", "2026-07-07T16:00:00.000Z", "atlanta", "W86", "W88"],
  [96, "round_of_16", "2026-07-07T20:00:00.000Z", "vancouver", "W85", "W87"],
  [97, "quarter_final", "2026-07-09T20:00:00.000Z", "boston", "W89", "W90"],
  [98, "quarter_final", "2026-07-10T19:00:00.000Z", "los-angeles", "W93", "W94"],
  [99, "quarter_final", "2026-07-11T20:00:00.000Z", "miami", "W91", "W92"],
  [100, "quarter_final", "2026-07-12T01:00:00.000Z", "kansas-city", "W95", "W96"],
  [101, "semi_final", "2026-07-14T19:00:00.000Z", "dallas", "W97", "W98"],
  [102, "semi_final", "2026-07-15T19:00:00.000Z", "atlanta", "W99", "W100"],
  [103, "third_place", "2026-07-18T21:00:00.000Z", "miami", "L101", "L102"],
  [104, "final", "2026-07-19T19:00:00.000Z", "new-york-new-jersey", "W101", "W102"],
];

function matchId(matchNumber: number) {
  return `wc2026-${String(matchNumber).padStart(3, "0")}`;
}

function venuePayload(venueId: string) {
  const venue = worldCup2026VenuesById.get(venueId);
  if (!venue) throw new Error(`Unknown World Cup 2026 venue: ${venueId}`);
  return { city: venue.city, country: venue.country };
}

function teamSlotFromCode(code: string): TeamSlot {
  const team = worldCup2026TeamsByCode.get(code);
  if (!team) throw new Error(`Unknown World Cup 2026 team code: ${code}`);

  return {
    type: "team",
    teamId: team.id,
    nameZh: team.name.zh,
    nameEn: team.name.en,
    code: team.code,
  };
}

function labelForSlot(slot: string) {
  if (/^[12][A-L]$/.test(slot)) {
    const rank = slot[0] === "1" ? { zh: "第一", en: "winner" } : { zh: "第二", en: "runner-up" };
    return {
      zh: `${slot[1]}组${rank.zh}`,
      en: `Group ${slot[1]} ${rank.en}`,
    };
  }

  if (/^3[A-L/]+$/.test(slot)) {
    const groups = slot.slice(1).split("/").join("/");
    return {
      zh: `${groups}组第三名之一`,
      en: `Third place from Group ${groups}`,
    };
  }

  if (/^W\d+$/.test(slot)) {
    const number = slot.slice(1);
    return {
      zh: `第${number}场胜者`,
      en: `Winner Match ${number}`,
    };
  }

  if (/^L\d+$/.test(slot)) {
    const number = slot.slice(1);
    return {
      zh: `第${number}场负者`,
      en: `Loser Match ${number}`,
    };
  }

  return { zh: "TBD", en: "TBD" };
}

function placeholderSlot(slot: string): TeamSlot {
  const label = labelForSlot(slot);
  return {
    type: "placeholder",
    code: slot,
    placeholderZh: label.zh,
    placeholderEn: label.en,
  };
}

function buildGroupFixture([
  matchNumber,
  group,
  kickoffUtc,
  venueId,
  teamACode,
  teamBCode,
]: GroupFixtureRow): WorldCupMatch {
  return {
    id: matchId(matchNumber),
    matchNumber,
    stage: "group",
    group,
    kickoffUtc,
    venueId,
    ...venuePayload(venueId),
    teamA: teamSlotFromCode(teamACode),
    teamB: teamSlotFromCode(teamBCode),
    status: "scheduled",
    source: worldCup2026FixtureSource,
  };
}

function buildKnockoutFixture([
  matchNumber,
  stage,
  kickoffUtc,
  venueId,
  slotA,
  slotB,
]: KnockoutFixtureRow): WorldCupMatch {
  return {
    id: matchId(matchNumber),
    matchNumber,
    stage,
    kickoffUtc,
    venueId,
    ...venuePayload(venueId),
    teamA: placeholderSlot(slotA),
    teamB: placeholderSlot(slotB),
    status: "tbd",
    source: worldCup2026FixtureSource,
  };
}

export const worldCup2026GroupMatches = groupFixtureRows.map(buildGroupFixture);

export const worldCup2026KnockoutMatches = knockoutFixtureRows.map(buildKnockoutFixture);

export const worldCup2026Matches = [
  ...worldCup2026GroupMatches,
  ...worldCup2026KnockoutMatches,
].sort((a, b) => a.matchNumber - b.matchNumber);

export const worldCup2026MatchesById = new Map(
  worldCup2026Matches.map((match) => [match.id, match]),
);
