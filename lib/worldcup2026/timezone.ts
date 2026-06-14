import type { WorldCupLanguage, WorldCupMatch } from "./types";

export const WORLD_CUP_2026_TIME_PROFILE = {
  zh: {
    locale: "zh-CN",
    timeZone: "Asia/Shanghai",
    abbreviation: "BJT",
    label: "北京时间",
  },
  en: {
    locale: "en-US",
    timeZone: "America/New_York",
    abbreviation: "ET",
    label: "Eastern Time",
  },
} as const;

export function getWorldCupTimeProfile(language: WorldCupLanguage) {
  return WORLD_CUP_2026_TIME_PROFILE[language];
}

export function getTournamentDateKey(kickoffUtc: string, language: WorldCupLanguage) {
  const profile = getWorldCupTimeProfile(language);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: profile.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(kickoffUtc));

  const year = parts.find((part) => part.type === "year")?.value ?? "2026";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";

  return `${year}-${month}-${day}`;
}

export function formatFixtureDate(kickoffUtc: string, language: WorldCupLanguage) {
  const profile = getWorldCupTimeProfile(language);
  const date = new Date(kickoffUtc);

  if (language === "zh") {
    const parts = zhDateParts(date, profile.timeZone);
    return `${parts.weekday} ${parts.month}月${parts.day}日`;
  }

  return new Intl.DateTimeFormat(profile.locale, {
    timeZone: profile.timeZone,
    month: "short",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

export function formatFixtureRailParts(kickoffUtc: string, language: WorldCupLanguage) {
  const profile = getWorldCupTimeProfile(language);
  const date = new Date(kickoffUtc);

  if (language === "zh") {
    const parts = zhDateParts(date, profile.timeZone);
    return { weekday: parts.weekday, date: `${parts.month}月${parts.day}日` };
  }

  const weekday = new Intl.DateTimeFormat(profile.locale, {
    timeZone: profile.timeZone,
    weekday: "short",
  }).format(date);
  const day = new Intl.DateTimeFormat(profile.locale, {
    timeZone: profile.timeZone,
    month: "short",
    day: "numeric",
  }).format(date);

  return { weekday, date: day };
}

export function formatFixtureDateTitle(kickoffUtc: string, language: WorldCupLanguage) {
  const profile = getWorldCupTimeProfile(language);
  if (language === "zh") {
    const parts = zhDateParts(new Date(kickoffUtc), profile.timeZone);
    return `${parts.month}月${parts.day}日 · ${profile.label}`;
  }

  return `${formatFixtureDate(kickoffUtc, language)} · ${profile.abbreviation}`;
}

export function formatFixtureTime(kickoffUtc: string, language: WorldCupLanguage) {
  const profile = getWorldCupTimeProfile(language);
  const time = new Intl.DateTimeFormat(profile.locale, {
    timeZone: profile.timeZone,
    hour: language === "zh" ? "2-digit" : "numeric",
    minute: "2-digit",
    hour12: language === "en",
  }).format(new Date(kickoffUtc));

  return `${time} ${profile.abbreviation}`;
}

export function formatTimestampForLocale(timestampUtc: string, language: WorldCupLanguage) {
  const profile = getWorldCupTimeProfile(language);
  const formatted = new Intl.DateTimeFormat(profile.locale, {
    timeZone: profile.timeZone,
    month: language === "zh" ? "numeric" : "short",
    day: "numeric",
    hour: language === "zh" ? "2-digit" : "numeric",
    minute: "2-digit",
    hour12: language === "en",
  }).format(new Date(timestampUtc));

  return `${formatted} ${profile.abbreviation}`;
}

function zhDateParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone,
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).formatToParts(date);

  return {
    month: parts.find((part) => part.type === "month")?.value ?? "",
    day: parts.find((part) => part.type === "day")?.value ?? "",
    weekday: parts.find((part) => part.type === "weekday")?.value ?? "",
  };
}

export type DisplayDateBucket = {
  key: string;
  sampleUtc: string;
  fixtures: WorldCupMatch[];
};

export function groupFixturesByDisplayDate(
  fixtures: WorldCupMatch[],
  language: WorldCupLanguage,
) {
  const buckets = new Map<string, DisplayDateBucket>();

  fixtures
    .slice()
    .sort((a, b) => a.kickoffUtc.localeCompare(b.kickoffUtc))
    .forEach((fixture) => {
      const key = getTournamentDateKey(fixture.kickoffUtc, language);
      const existing = buckets.get(key);

      if (existing) {
        existing.fixtures.push(fixture);
        return;
      }

      buckets.set(key, {
        key,
        sampleUtc: fixture.kickoffUtc,
        fixtures: [fixture],
      });
    });

  return Array.from(buckets.values());
}

export function buildGroupStageDateRail(
  fixtures: WorldCupMatch[],
  language: WorldCupLanguage,
) {
  return groupFixturesByDisplayDate(
    fixtures.filter((fixture) => fixture.stage === "group"),
    language,
  );
}

export function getFixturesForDisplayDate(
  fixtures: WorldCupMatch[],
  dateKey: string,
  language: WorldCupLanguage,
) {
  return fixtures
    .filter((fixture) => getTournamentDateKey(fixture.kickoffUtc, language) === dateKey)
    .sort((a, b) => a.kickoffUtc.localeCompare(b.kickoffUtc));
}
