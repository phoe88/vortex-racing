/** Cache tags shared by cached queries and the server actions that mutate them. */
export const TAGS = {
  articles: "articles",
  article: (slug: string) => `article:${slug}`,
  drivers: "drivers",
  driver: (slug: string) => `driver:${slug}`,
  team: "team",
  races: "races",
  race: (slug: string) => `race:${slug}`,
  standings: "standings",
  cars: "cars",
  car: (slug: string) => `car:${slug}`,
  partners: "partners",
  settings: "settings",
} as const;

export const ALL_CONTENT_TAGS = [
  TAGS.articles,
  TAGS.drivers,
  TAGS.team,
  TAGS.races,
  TAGS.standings,
  TAGS.cars,
  TAGS.partners,
  TAGS.settings,
];
