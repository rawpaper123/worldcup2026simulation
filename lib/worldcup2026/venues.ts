import type { LocalizedText } from "./types";

export type WorldCupVenue = {
  id: string;
  name: LocalizedText;
  city: string;
  country: string;
};

export const worldCup2026Venues: WorldCupVenue[] = [
  { id: "mexico-city", name: { zh: "墨西哥城体育场", en: "Mexico City Stadium" }, city: "Mexico City", country: "Mexico" },
  { id: "guadalajara", name: { zh: "瓜达拉哈拉体育场", en: "Estadio Guadalajara" }, city: "Zapopan", country: "Mexico" },
  { id: "monterrey", name: { zh: "蒙特雷体育场", en: "Estadio Monterrey" }, city: "Guadalupe", country: "Mexico" },
  { id: "toronto", name: { zh: "多伦多体育场", en: "Toronto Stadium" }, city: "Toronto", country: "Canada" },
  { id: "vancouver", name: { zh: "温哥华体育场", en: "BC Place" }, city: "Vancouver", country: "Canada" },
  { id: "los-angeles", name: { zh: "洛杉矶体育场", en: "Los Angeles Stadium" }, city: "Los Angeles", country: "United States" },
  { id: "san-francisco-bay-area", name: { zh: "旧金山湾区体育场", en: "San Francisco Bay Area Stadium" }, city: "San Francisco", country: "United States" },
  { id: "seattle", name: { zh: "西雅图体育场", en: "Seattle Stadium" }, city: "Seattle", country: "United States" },
  { id: "houston", name: { zh: "休斯敦体育场", en: "Houston Stadium" }, city: "Houston", country: "United States" },
  { id: "dallas", name: { zh: "达拉斯体育场", en: "Dallas Stadium" }, city: "Dallas", country: "United States" },
  { id: "kansas-city", name: { zh: "堪萨斯城体育场", en: "Kansas City Stadium" }, city: "Kansas City", country: "United States" },
  { id: "atlanta", name: { zh: "亚特兰大体育场", en: "Atlanta Stadium" }, city: "Atlanta", country: "United States" },
  { id: "miami", name: { zh: "迈阿密体育场", en: "Miami Stadium" }, city: "Miami", country: "United States" },
  { id: "new-york-new-jersey", name: { zh: "纽约新泽西体育场", en: "New York New Jersey Stadium" }, city: "New Jersey", country: "United States" },
  { id: "boston", name: { zh: "波士顿体育场", en: "Boston Stadium" }, city: "Boston", country: "United States" },
  { id: "philadelphia", name: { zh: "费城体育场", en: "Philadelphia Stadium" }, city: "Philadelphia", country: "United States" },
];

export const worldCup2026VenuesById = new Map(
  worldCup2026Venues.map((venue) => [venue.id, venue]),
);
