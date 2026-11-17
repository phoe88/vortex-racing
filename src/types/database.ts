/**
 * Hand-maintained Supabase schema types. Keep in sync with
 * supabase/migrations/*.sql (or regenerate with `supabase gen types`).
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "admin" | "editor" | "viewer";
export type ContentStatus = "draft" | "published";
export type ArticleCategory =
  | "news"
  | "race-report"
  | "feature"
  | "video"
  | "partner"
  | "team";
export type DriverRole = "race" | "reserve" | "academy";
export type RaceStatus = "upcoming" | "live" | "completed" | "cancelled";
export type PartnerTier = "title" | "principal" | "official" | "supplier";
export type SubscriberStatus = "subscribed" | "unsubscribed";

type Timestamps = { created_at: string; updated_at: string };

export type ProfileRow = Timestamps & {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
}

export type ArticleRow = Timestamps & {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: ArticleCategory;
  cover_image_url: string | null;
  video_url: string | null;
  author_name: string;
  tags: string[];
  is_featured: boolean;
  status: ContentStatus;
  published_at: string | null;
}

export type DriverRow = Timestamps & {
  id: string;
  slug: string;
  first_name: string;
  last_name: string;
  number: number | null;
  nationality: string;
  country_code: string;
  role: DriverRole;
  tagline: string;
  bio: string;
  date_of_birth: string | null;
  place_of_birth: string | null;
  image_url: string | null;
  /** Photo for driver cards; falls back to image_url. */
  card_image_url: string | null;
  hero_image_url: string | null;
  helmet_image_url: string | null;
  instagram_url: string | null;
  x_url: string | null;
  career_starts: number;
  career_wins: number;
  career_podiums: number;
  career_poles: number;
  career_points: number;
  championships: number;
  is_active: boolean;
  sort_order: number;
}

export type TeamMemberRow = Timestamps & {
  id: string;
  name: string;
  role_title: string;
  bio: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export type RaceSession = {
  name: string;
  starts_at: string;
}

export type RaceRow = Timestamps & {
  id: string;
  slug: string;
  season: number;
  round: number;
  name: string;
  official_name: string | null;
  country: string;
  country_code: string;
  city: string | null;
  circuit_name: string;
  circuit_image_url: string | null;
  hero_image_url: string | null;
  circuit_length_km: number | null;
  laps: number | null;
  lap_record: string | null;
  timezone: string;
  sessions: RaceSession[];
  race_start: string;
  status: RaceStatus;
  summary: string;
}

export type RaceResultRow = {
  id: string;
  race_id: string;
  driver_id: string | null;
  driver_name: string;
  team_name: string;
  position: number | null;
  grid: number | null;
  points: number;
  status: string;
  fastest_lap: boolean;
  time_text: string | null;
  created_at: string;
}

export type DriverStandingRow = {
  id: string;
  season: number;
  position: number;
  driver_name: string;
  team_name: string;
  country_code: string;
  points: number;
  wins: number;
  podiums: number;
  driver_id: string | null;
  is_team: boolean;
  updated_at: string;
}

export type ConstructorStandingRow = {
  id: string;
  season: number;
  position: number;
  team_name: string;
  points: number;
  wins: number;
  is_team: boolean;
  updated_at: string;
}

export type CarSpec = {
  group: string;
  label: string;
  value: string;
}

export type CarAchievement = {
  label: string;
  value: string;
}

export type CarRow = Timestamps & {
  id: string;
  slug: string;
  name: string;
  season: number;
  chassis: string | null;
  power_unit: string | null;
  tagline: string;
  description: string;
  image_url: string | null;
  hero_image_url: string | null;
  specs: CarSpec[];
  achievements: CarAchievement[];
  is_current: boolean;
}

export type PartnerRow = Timestamps & {
  id: string;
  slug: string;
  name: string;
  tier: PartnerTier;
  logo_url: string | null;
  website_url: string | null;
  description: string;
  sort_order: number;
  is_active: boolean;
}

export type SubscriberRow = {
  id: string;
  email: string;
  status: SubscriberStatus;
  source: string;
  created_at: string;
  unsubscribed_at: string | null;
}

export type MediaRow = {
  id: string;
  bucket: string;
  path: string;
  url: string;
  alt: string;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  created_by: string | null;
  created_at: string;
}

export type SiteSettingRow = {
  key: string;
  value: Json;
  updated_at: string;
}

/** Build Insert/Update shapes: server-generated columns become optional. */
type Generated = "id" | "created_at" | "updated_at";
type InsertOf<Row, Optional extends keyof Row = never> = Omit<
  Row,
  Generated | Optional
> &
  Partial<Pick<Row, Extract<Generated | Optional, keyof Row>>>;
type UpdateOf<Row> = Partial<Row>;

type Table<Row, Insert = InsertOf<Row>, Update = UpdateOf<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<ProfileRow, InsertOf<ProfileRow, "role" | "full_name">>;
      articles: Table<
        ArticleRow,
        InsertOf<
          ArticleRow,
          | "excerpt" | "body" | "category" | "cover_image_url" | "video_url"
          | "author_name" | "tags" | "is_featured" | "status" | "published_at"
        >
      >;
      drivers: Table<
        DriverRow,
        InsertOf<
          DriverRow,
          | "number" | "nationality" | "country_code" | "role" | "tagline" | "bio"
          | "date_of_birth" | "place_of_birth" | "image_url" | "card_image_url" | "hero_image_url"
          | "helmet_image_url" | "instagram_url" | "x_url" | "career_starts"
          | "career_wins" | "career_podiums" | "career_poles" | "career_points"
          | "championships" | "is_active" | "sort_order"
        >
      >;
      team_members: Table<
        TeamMemberRow,
        InsertOf<TeamMemberRow, "bio" | "image_url" | "sort_order" | "is_active">
      >;
      races: Table<
        RaceRow,
        InsertOf<
          RaceRow,
          | "official_name" | "country_code" | "city" | "circuit_image_url"
          | "hero_image_url" | "circuit_length_km" | "laps" | "lap_record"
          | "timezone" | "sessions" | "status" | "summary"
        >
      >;
      race_results: Table<
        RaceResultRow,
        InsertOf<
          RaceResultRow,
          | "driver_id" | "position" | "grid" | "points" | "status"
          | "fastest_lap" | "time_text"
        >
      >;
      driver_standings: Table<
        DriverStandingRow,
        InsertOf<
          DriverStandingRow,
          "country_code" | "points" | "wins" | "podiums" | "driver_id" | "is_team"
        >
      >;
      constructor_standings: Table<
        ConstructorStandingRow,
        InsertOf<ConstructorStandingRow, "points" | "wins" | "is_team">
      >;
      cars: Table<
        CarRow,
        InsertOf<
          CarRow,
          | "chassis" | "power_unit" | "tagline" | "description" | "image_url"
          | "hero_image_url" | "specs" | "achievements" | "is_current"
        >
      >;
      partners: Table<
        PartnerRow,
        InsertOf<
          PartnerRow,
          "tier" | "logo_url" | "website_url" | "description" | "sort_order" | "is_active"
        >
      >;
      newsletter_subscribers: Table<
        SubscriberRow,
        InsertOf<SubscriberRow, "status" | "source" | "unsubscribed_at">
      >;
      media: Table<
        MediaRow,
        InsertOf<
          MediaRow,
          | "bucket" | "alt" | "mime_type" | "size_bytes" | "width" | "height"
          | "created_by"
        >
      >;
      site_settings: Table<SiteSettingRow, InsertOf<SiteSettingRow>>;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_staff: { Args: Record<string, never>; Returns: boolean };
      current_role_name: { Args: Record<string, never>; Returns: UserRole };
    };
    Enums: {
      user_role: UserRole;
      content_status: ContentStatus;
      article_category: ArticleCategory;
      driver_role: DriverRole;
      race_status: RaceStatus;
      partner_tier: PartnerTier;
      subscriber_status: SubscriberStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
