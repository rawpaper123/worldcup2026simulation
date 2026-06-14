import type { WorldCupGroup, WorldCupTeam } from "./types";

const teamRows: Array<[string, string, string, string, WorldCupGroup]> = [
  ["mexico", "MEX", "墨西哥", "Mexico", "A"],
  ["south-africa", "RSA", "南非", "South Africa", "A"],
  ["korea-republic", "KOR", "韩国", "Korea Republic", "A"],
  ["czechia", "CZE", "捷克", "Czechia", "A"],
  ["canada", "CAN", "加拿大", "Canada", "B"],
  ["bosnia-herzegovina", "BIH", "波黑", "Bosnia and Herzegovina", "B"],
  ["qatar", "QAT", "卡塔尔", "Qatar", "B"],
  ["switzerland", "SUI", "瑞士", "Switzerland", "B"],
  ["brazil", "BRA", "巴西", "Brazil", "C"],
  ["morocco", "MAR", "摩洛哥", "Morocco", "C"],
  ["haiti", "HAI", "海地", "Haiti", "C"],
  ["scotland", "SCO", "苏格兰", "Scotland", "C"],
  ["united-states", "USA", "美国", "United States", "D"],
  ["paraguay", "PAR", "巴拉圭", "Paraguay", "D"],
  ["australia", "AUS", "澳大利亚", "Australia", "D"],
  ["turkiye", "TUR", "土耳其", "Turkiye", "D"],
  ["germany", "GER", "德国", "Germany", "E"],
  ["curacao", "CUW", "库拉索", "Curacao", "E"],
  ["cote-divoire", "CIV", "科特迪瓦", "Cote d'Ivoire", "E"],
  ["ecuador", "ECU", "厄瓜多尔", "Ecuador", "E"],
  ["netherlands", "NED", "荷兰", "Netherlands", "F"],
  ["japan", "JPN", "日本", "Japan", "F"],
  ["sweden", "SWE", "瑞典", "Sweden", "F"],
  ["tunisia", "TUN", "突尼斯", "Tunisia", "F"],
  ["belgium", "BEL", "比利时", "Belgium", "G"],
  ["egypt", "EGY", "埃及", "Egypt", "G"],
  ["iran", "IRN", "伊朗", "IR Iran", "G"],
  ["new-zealand", "NZL", "新西兰", "New Zealand", "G"],
  ["spain", "ESP", "西班牙", "Spain", "H"],
  ["cabo-verde", "CPV", "佛得角", "Cabo Verde", "H"],
  ["saudi-arabia", "KSA", "沙特阿拉伯", "Saudi Arabia", "H"],
  ["uruguay", "URU", "乌拉圭", "Uruguay", "H"],
  ["france", "FRA", "法国", "France", "I"],
  ["senegal", "SEN", "塞内加尔", "Senegal", "I"],
  ["iraq", "IRQ", "伊拉克", "Iraq", "I"],
  ["norway", "NOR", "挪威", "Norway", "I"],
  ["argentina", "ARG", "阿根廷", "Argentina", "J"],
  ["algeria", "ALG", "阿尔及利亚", "Algeria", "J"],
  ["austria", "AUT", "奥地利", "Austria", "J"],
  ["jordan", "JOR", "约旦", "Jordan", "J"],
  ["portugal", "POR", "葡萄牙", "Portugal", "K"],
  ["dr-congo", "COD", "刚果民主共和国", "DR Congo", "K"],
  ["uzbekistan", "UZB", "乌兹别克斯坦", "Uzbekistan", "K"],
  ["colombia", "COL", "哥伦比亚", "Colombia", "K"],
  ["england", "ENG", "英格兰", "England", "L"],
  ["croatia", "CRO", "克罗地亚", "Croatia", "L"],
  ["ghana", "GHA", "加纳", "Ghana", "L"],
  ["panama", "PAN", "巴拿马", "Panama", "L"],
];

export const worldCup2026Teams: WorldCupTeam[] = teamRows.map(
  ([id, code, zh, en, group]) => ({
    id,
    code,
    group,
    name: { zh, en },
  }),
);

export const worldCup2026TeamsByCode = new Map(
  worldCup2026Teams.map((team) => [team.code, team]),
);

export const worldCup2026TeamsById = new Map(
  worldCup2026Teams.map((team) => [team.id, team]),
);
