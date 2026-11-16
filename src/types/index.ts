export * from "./database";

import type {
  ArticleCategory,
  ArticleRow,
  CarRow,
  DriverRow,
  DriverStandingRow,
  ConstructorStandingRow,
  PartnerRow,
  PartnerTier,
  RaceRow,
  RaceResultRow,
  UserRole,
} from "./database";

export type Article = ArticleRow;
export type Driver = DriverRow;
export type Race = RaceRow;
export type RaceResult = RaceResultRow;
export type Car = CarRow;
export type Partner = PartnerRow;
export type DriverStanding = DriverStandingRow;
export type ConstructorStanding = ConstructorStandingRow;

export type RaceWithResults = Race & { results: RaceResult[] };

export interface SessionUser {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
}

/** Standard return shape for form-driven server actions. */
export type ActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: Record<string, FormDataEntryValue | null>;
} | null;

export const ARTICLE_CATEGORIES: { value: ArticleCategory; label: string }[] = [
  { value: "news", label: "News" },
  { value: "race-report", label: "Race report" },
  { value: "feature", label: "Feature" },
  { value: "video", label: "Video" },
  { value: "team", label: "Team" },
  { value: "partner", label: "Partners" },
];

export const PARTNER_TIERS: { value: PartnerTier; label: string }[] = [
  { value: "title", label: "Title partner" },
  { value: "principal", label: "Principal partner" },
  { value: "official", label: "Official partner" },
  { value: "supplier", label: "Technical supplier" },
];

export const USER_ROLES: UserRole[] = ["admin", "editor", "viewer"];
