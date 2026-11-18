/**
 * Seed content for Vortex Racing. Used by:
 *  - scripts/seed.ts        → pushes everything into Supabase
 *  - src/lib/seed/demo.ts   → in-memory fallback when Supabase isn't configured
 *
 * All IDs are deterministic so relationships survive re-seeding.
 */
import type {
  ArticleRow, CarRow, ConstructorStandingRow, DriverRow, DriverStandingRow,
  PartnerRow, RaceResultRow, RaceRow, TeamMemberRow,
} from "@/types/database";
import { IMG, unsplash, unsplashFace } from "./images";

const SEASON = 2026;
const NOW = "2026-11-15T09:00:00.000Z";
const TEAM = "Vortex Racing";

const uid = (prefix: string, n: number) =>
  `${prefix.padEnd(8, "0").slice(0, 8)}-0000-4000-8000-${String(n).padStart(12, "0")}`;

const stamp = (iso: string) => ({ created_at: iso, updated_at: iso });

// ─── Drivers ────────────────────────────────────────────────────────────────
export const drivers: DriverRow[] = [
  {
    id: uid("d0000000", 1), slug: "luca-moretti", first_name: "Luca", last_name: "Moretti",
    number: 27, nationality: "Italian", country_code: "IT", role: "race",
    tagline: "Late on the brakes, early on the throttle.",
    bio: `Luca Moretti joined Vortex Racing in 2023 after two seasons in Formula 2, where he took the vice-championship with six wins. Raised in Bergamo, he started karting at six and was a European junior champion by fourteen.

Known for a brutally late braking style and an almost telepathic feel for tyre degradation, Moretti has become the reference point in the garage for race-day set-up. His maiden victory at Monaco in 2025 came from fourth on the grid, with a one-stop strategy the pit wall still talks about.

Away from the track he restores vintage motorcycles and is a vocal supporter of grassroots karting in northern Italy.`,
    date_of_birth: "1999-04-18", place_of_birth: "Bergamo, Italy",
    image_url: "/images/drivers/luca-moretti.webp", card_image_url: "/images/drivers/luca-moretti-card.webp", hero_image_url: "/images/drivers/luca-moretti-banner.webp",
    helmet_image_url: null, instagram_url: "https://instagram.com", x_url: "https://x.com",
    career_starts: 78, career_wins: 7, career_podiums: 23, career_poles: 5, career_points: 812.5,
    championships: 0, is_active: true, sort_order: 1, ...stamp("2023-01-10T00:00:00Z"),
  },
  {
    id: uid("d0000000", 2), slug: "kai-nakamura", first_name: "Kai", last_name: "Nakamura",
    number: 30, nationality: "Japanese", country_code: "JP", role: "race",
    tagline: "Precision is a habit.",
    bio: `Kai Nakamura graduated from the Vortex Academy in 2025, becoming the first driver to progress from the team's junior programme to a full-time race seat. He won the 2024 Formula 3 title at his first attempt, then finished third in Formula 2 while juggling simulator duties for the senior team.

Nakamura is a qualifying specialist: smooth inputs, immaculate tyre preparation and an unflappable radio voice. His first podium came in only his seventh start, at Suzuka in front of a home crowd.

He is studying aeronautical engineering part-time and spends his winters cycling in the Japanese Alps.`,
    date_of_birth: "2004-09-02", place_of_birth: "Nagoya, Japan",
    image_url: "/images/drivers/kai-nakamura.webp", card_image_url: "/images/drivers/kai-nakamura-card.webp", hero_image_url: unsplash(IMG.cockpitSeated, 2000),
    helmet_image_url: null, instagram_url: "https://instagram.com", x_url: "https://x.com",
    career_starts: 18, career_wins: 1, career_podiums: 4, career_poles: 2, career_points: 176,
    championships: 0, is_active: true, sort_order: 2, ...stamp("2025-12-01T00:00:00Z"),
  },
  {
    id: uid("d0000000", 3), slug: "elena-voss", first_name: "Elena", last_name: "Voss",
    number: 9, nationality: "German", country_code: "DE", role: "reserve",
    tagline: "Ready at a moment's notice.",
    bio: `Elena Voss is Vortex Racing's reserve and development driver. A former DTM race winner and endurance class champion, she leads the team's simulator correlation programme and has completed more than 4,000 kilometres of private testing in the VR-26.

Voss made two race starts for the team in 2025 as a stand-in, scoring points on both occasions.`,
    date_of_birth: "1996-01-27", place_of_birth: "Stuttgart, Germany",
    image_url: unsplashFace(IMG.racerFlameJacket), card_image_url: unsplash(IMG.racerFlameJacket, 1200), hero_image_url: unsplash(IMG.f1BlackRedWet, 2000),
    helmet_image_url: null, instagram_url: "https://instagram.com", x_url: null,
    career_starts: 2, career_wins: 0, career_podiums: 0, career_poles: 0, career_points: 14,
    championships: 0, is_active: true, sort_order: 3, ...stamp("2024-02-01T00:00:00Z"),
  },
  {
    id: uid("d0000000", 4), slug: "tomas-ferreira", first_name: "Tomás", last_name: "Ferreira",
    number: 44, nationality: "Brazilian", country_code: "BR", role: "academy",
    tagline: "The next one through the door.",
    bio: `Tomás Ferreira is the senior member of the Vortex Academy and the reigning Formula 3 champion. He races in Formula 2 in 2026 and drives for the team in young-driver tests.`,
    date_of_birth: "2007-05-11", place_of_birth: "Curitiba, Brazil",
    image_url: unsplashFace(IMG.driverRedSuit), card_image_url: unsplash(IMG.driverRedSuit, 1200), hero_image_url: unsplash(IMG.f1RedKerb, 2000),
    helmet_image_url: null, instagram_url: "https://instagram.com", x_url: null,
    career_starts: 0, career_wins: 0, career_podiums: 0, career_poles: 0, career_points: 0,
    championships: 0, is_active: true, sort_order: 4, ...stamp("2025-06-01T00:00:00Z"),
  },
];

// ─── Team members ───────────────────────────────────────────────────────────
export const teamMembers: TeamMemberRow[] = [
  { name: "Mara Lindqvist", role_title: "Team Principal", bio: "Joined as Head of Strategy in 2016 and took over the team in 2021. Oversaw the move to the Silverstone campus and the launch of the Vortex Academy." },
  { name: "Daniel Okafor", role_title: "Technical Director", bio: "Aerodynamicist by trade. Led the VR-26 concept, including the sidepod undercut that defines the car's look." },
  { name: "Priya Raman", role_title: "Head of Race Strategy", bio: "Runs the pit wall. Known for aggressive undercuts and an encyclopaedic memory for tyre data." },
  { name: "Sebastian Kuhn", role_title: "Chief Race Engineer", bio: "Race engineer to Luca Moretti since 2023." },
  { name: "Aiko Tanaka", role_title: "Head of Vortex Academy", bio: "Former single-seater racer who built the junior programme from scratch in 2022." },
  { name: "Grace Mbeki", role_title: "Chief Operating Officer", bio: "Keeps 640 people, two trucks and one wind tunnel moving in the same direction." },
].map((m, i) => ({
  id: uid("e0000000", i + 1), image_url: null, sort_order: i + 1, is_active: true,
  ...m, ...stamp("2026-01-01T00:00:00Z"),
}));

// ─── Rival grid (for results & standings) ──────────────────────────────────
type GridEntry = { name: string; team: string; cc: string; pace: number; driverId?: string };
const GRID: GridEntry[] = [
  { name: "Luca Moretti", team: TEAM, cc: "IT", pace: 96, driverId: drivers[0].id },
  { name: "Kai Nakamura", team: TEAM, cc: "JP", pace: 91, driverId: drivers[1].id },
  { name: "Mateo Reyes", team: "Meridian GP", cc: "ES", pace: 98 },
  { name: "Henrik Dahl", team: "Meridian GP", cc: "DK", pace: 93 },
  { name: "Oliver Hart", team: "Halcyon Racing", cc: "GB", pace: 94 },
  { name: "Noah Brandt", team: "Halcyon Racing", cc: "AT", pace: 89 },
  { name: "Amara Diallo", team: "Aurora F1 Team", cc: "FR", pace: 92 },
  { name: "Jonas Weber", team: "Aurora F1 Team", cc: "DE", pace: 88 },
  { name: "Ravi Menon", team: "Kestrel Motorsport", cc: "IN", pace: 87 },
  { name: "Liam Carter", team: "Kestrel Motorsport", cc: "AU", pace: 86 },
  { name: "Santiago Cruz", team: "Solaris Racing", cc: "MX", pace: 85 },
  { name: "Felix Andersson", team: "Solaris Racing", cc: "SE", pace: 84 },
  { name: "Diego Alves", team: "Northwind", cc: "BR", pace: 83 },
  { name: "Yusuf Demir", team: "Northwind", cc: "TR", pace: 82 },
];
const POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

// Deterministic pseudo-random so every seed run produces the same season.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

// ─── Races ──────────────────────────────────────────────────────────────────
type RaceSeed = [
  slug: string, name: string, country: string, cc: string, city: string, circuit: string,
  date: string, tz: string, lengthKm: number, laps: number, record: string, img: string,
];
const RACES: RaceSeed[] = [
  ["australian-grand-prix", "Australian Grand Prix", "Australia", "AU", "Melbourne", "Albert Park Circuit", "2026-03-08T04:00:00Z", "Australia/Melbourne", 5.278, 58, "1:19.813", IMG.aerialWater],
  ["chinese-grand-prix", "Chinese Grand Prix", "China", "CN", "Shanghai", "Shanghai International Circuit", "2026-03-15T07:00:00Z", "Asia/Shanghai", 5.451, 56, "1:32.238", IMG.carsCurbs],
  ["japanese-grand-prix", "Japanese Grand Prix", "Japan", "JP", "Suzuka", "Suzuka International Racing Course", "2026-03-29T05:00:00Z", "Asia/Tokyo", 5.807, 53, "1:30.983", IMG.aerialTrees],
  ["bahrain-grand-prix", "Bahrain Grand Prix", "Bahrain", "BH", "Sakhir", "Bahrain International Circuit", "2026-04-12T15:00:00Z", "Asia/Bahrain", 5.412, 57, "1:31.447", IMG.aerialSunrise],
  ["saudi-arabian-grand-prix", "Saudi Arabian Grand Prix", "Saudi Arabia", "SA", "Jeddah", "Jeddah Corniche Circuit", "2026-04-19T17:00:00Z", "Asia/Riyadh", 6.174, 50, "1:30.734", IMG.streetCircuit],
  ["miami-grand-prix", "Miami Grand Prix", "United States", "US", "Miami", "Miami International Autodrome", "2026-05-03T20:00:00Z", "America/New_York", 5.412, 57, "1:29.708", IMG.crowdBlur],
  ["monaco-grand-prix", "Monaco Grand Prix", "Monaco", "MC", "Monte Carlo", "Circuit de Monaco", "2026-06-07T13:00:00Z", "Europe/Monaco", 3.337, 78, "1:12.909", IMG.monaco],
  ["spanish-grand-prix", "Spanish Grand Prix", "Spain", "ES", "Barcelona", "Circuit de Barcelona-Catalunya", "2026-06-14T13:00:00Z", "Europe/Madrid", 4.657, 66, "1:16.330", IMG.spaCars],
  ["austrian-grand-prix", "Austrian Grand Prix", "Austria", "AT", "Spielberg", "Red Bull Ring", "2026-06-28T13:00:00Z", "Europe/Vienna", 4.318, 71, "1:05.619", IMG.redGrid],
  ["british-grand-prix", "British Grand Prix", "United Kingdom", "GB", "Silverstone", "Silverstone Circuit", "2026-07-05T14:00:00Z", "Europe/London", 5.891, 52, "1:27.097", IMG.gridLineup],
  ["belgian-grand-prix", "Belgian Grand Prix", "Belgium", "BE", "Stavelot", "Circuit de Spa-Francorchamps", "2026-07-19T13:00:00Z", "Europe/Brussels", 7.004, 44, "1:44.701", IMG.spaCars],
  ["hungarian-grand-prix", "Hungarian Grand Prix", "Hungary", "HU", "Budapest", "Hungaroring", "2026-07-26T13:00:00Z", "Europe/Budapest", 4.381, 70, "1:16.627", IMG.aerialKart],
  ["dutch-grand-prix", "Dutch Grand Prix", "Netherlands", "NL", "Zandvoort", "Circuit Zandvoort", "2026-08-23T13:00:00Z", "Europe/Amsterdam", 4.259, 72, "1:11.097", IMG.fansGrandstand],
  ["italian-grand-prix", "Italian Grand Prix", "Italy", "IT", "Monza", "Autodromo Nazionale Monza", "2026-09-06T13:00:00Z", "Europe/Rome", 5.793, 53, "1:21.046", IMG.redYellowCar],
  ["singapore-grand-prix", "Singapore Grand Prix", "Singapore", "SG", "Singapore", "Marina Bay Street Circuit", "2026-10-11T12:00:00Z", "Asia/Singapore", 4.940, 62, "1:34.486", IMG.streetCircuit],
  ["united-states-grand-prix", "United States Grand Prix", "United States", "US", "Austin", "Circuit of The Americas", "2026-10-25T19:00:00Z", "America/Chicago", 5.513, 56, "1:36.169", IMG.sunsetStadium],
  ["mexico-city-grand-prix", "Mexico City Grand Prix", "Mexico", "MX", "Mexico City", "Autódromo Hermanos Rodríguez", "2026-11-01T20:00:00Z", "America/Mexico_City", 4.304, 71, "1:17.774", IMG.pitLaneCrowd],
  ["sao-paulo-grand-prix", "São Paulo Grand Prix", "Brazil", "BR", "São Paulo", "Autódromo José Carlos Pace", "2026-11-08T17:00:00Z", "America/Sao_Paulo", 4.309, 71, "1:10.540", IMG.blueWhiteCar],
  ["las-vegas-grand-prix", "Las Vegas Grand Prix", "United States", "US", "Las Vegas", "Las Vegas Strip Circuit", "2026-11-22T06:00:00Z", "America/Los_Angeles", 6.201, 50, "1:34.876", IMG.sunsetStadium],
  ["qatar-grand-prix", "Qatar Grand Prix", "Qatar", "QA", "Lusail", "Lusail International Circuit", "2026-11-29T16:00:00Z", "Asia/Qatar", 5.419, 57, "1:22.384", IMG.aerialSunrise],
  ["abu-dhabi-grand-prix", "Abu Dhabi Grand Prix", "United Arab Emirates", "AE", "Abu Dhabi", "Yas Marina Circuit", "2026-12-06T13:00:00Z", "Asia/Dubai", 5.281, 58, "1:26.103", IMG.aerialWater],
];

function sessionsFor(raceStart: string, tz: string) {
  const start = new Date(raceStart).getTime();
  const h = 3600_000;
  const d = 24 * h;
  return [
    { name: "Practice 1", starts_at: new Date(start - 2 * d - 3.5 * h).toISOString() },
    { name: "Practice 2", starts_at: new Date(start - 2 * d).toISOString() },
    { name: "Practice 3", starts_at: new Date(start - d - 3.5 * h).toISOString() },
    { name: "Qualifying", starts_at: new Date(start - d).toISOString() },
    { name: "Grand Prix", starts_at: raceStart },
  ].map((s) => ({ ...s, tz }));
}

export const races: RaceRow[] = RACES.map((r, i) => {
  const [slug, name, country, cc, city, circuit, date, tz, lengthKm, laps, record, img] = r;
  const completed = new Date(date).getTime() < new Date(NOW).getTime();
  return {
    id: uid("c0000000", i + 1), slug, season: SEASON, round: i + 1, name,
    official_name: `Formula ${name} ${SEASON}`, country, country_code: cc, city,
    circuit_name: circuit, circuit_image_url: unsplash(img, 1200), hero_image_url: unsplash(img, 2000),
    circuit_length_km: lengthKm, laps, lap_record: record, timezone: tz,
    sessions: sessionsFor(date, tz).map(({ name, starts_at }) => ({ name, starts_at })),
    race_start: date, status: completed ? "completed" : "upcoming", summary: "",
    ...stamp("2025-12-15T00:00:00Z"),
  };
});

// ─── Results (generated) ───────────────────────────────────────────────────
export const raceResults: RaceResultRow[] = [];
{
  let n = 0;
  for (const race of races) {
    if (race.status !== "completed") continue;
    const rand = rng(race.round * 7919);
    const grid = GRID.map((g) => ({ g, q: g.pace + rand() * 9 })).sort((a, b) => b.q - a.q);
    const order = grid
      .map(({ g }, gridPos) => ({ g, gridPos: gridPos + 1, s: g.pace + rand() * 12 - (gridPos * 0.6) }))
      .sort((a, b) => b.s - a.s);
    const dnfCount = rand() < 0.5 ? 1 : 2;
    const dnfIdx = new Set<number>();
    while (dnfIdx.size < dnfCount) dnfIdx.add(6 + Math.floor(rand() * (order.length - 6)));
    const fastest = Math.floor(rand() * 5);
    const finishers = order.filter((_, i) => !dnfIdx.has(i));
    const dnfs = order.filter((_, i) => dnfIdx.has(i));
    let pos = 0;
    for (const e of finishers) {
      pos += 1;
      raceResults.push({
        id: uid("f0000000", ++n), race_id: race.id, driver_id: e.g.driverId ?? null,
        driver_name: e.g.name, team_name: e.g.team, position: pos, grid: e.gridPos,
        points: POINTS[pos - 1] ?? 0, status: "Finished", fastest_lap: order.indexOf(e) === fastest,
        time_text: pos === 1 ? `1:${30 + Math.floor(rand() * 15)}:${String(Math.floor(rand() * 60)).padStart(2, "0")}.${String(Math.floor(rand() * 999)).padStart(3, "0")}` : `+${(pos * 3.2 + rand() * 6).toFixed(3)}s`,
        created_at: race.race_start,
      });
    }
    for (const e of dnfs) {
      raceResults.push({
        id: uid("f0000000", ++n), race_id: race.id, driver_id: e.g.driverId ?? null,
        driver_name: e.g.name, team_name: e.g.team, position: null, grid: e.gridPos,
        points: 0, status: rand() < 0.5 ? "Retired" : "Collision", fastest_lap: false,
        time_text: "DNF", created_at: race.race_start,
      });
    }
  }
}

// ─── Standings (derived from results) ──────────────────────────────────────
export const driverStandings: DriverStandingRow[] = (() => {
  const totals = new Map<string, { pts: number; wins: number; podiums: number; g: GridEntry }>();
  for (const g of GRID) totals.set(g.name, { pts: 0, wins: 0, podiums: 0, g });
  for (const r of raceResults) {
    const t = totals.get(r.driver_name)!;
    t.pts += r.points;
    if (r.position === 1) t.wins++;
    if (r.position && r.position <= 3) t.podiums++;
  }
  return [...totals.values()]
    .sort((a, b) => b.pts - a.pts || b.wins - a.wins)
    .map((t, i) => ({
      id: uid("a0000000", i + 1), season: SEASON, position: i + 1, driver_name: t.g.name,
      team_name: t.g.team, country_code: t.g.cc, points: t.pts, wins: t.wins, podiums: t.podiums,
      driver_id: t.g.driverId ?? null, is_team: t.g.team === TEAM, updated_at: NOW,
    }));
})();

export const constructorStandings: ConstructorStandingRow[] = (() => {
  const totals = new Map<string, { pts: number; wins: number }>();
  for (const r of raceResults) {
    const t = totals.get(r.team_name) ?? { pts: 0, wins: 0 };
    t.pts += r.points;
    if (r.position === 1) t.wins++;
    totals.set(r.team_name, t);
  }
  return [...totals.entries()]
    .sort((a, b) => b[1].pts - a[1].pts)
    .map(([team, t], i) => ({
      id: uid("b0000000", i + 1), season: SEASON, position: i + 1, team_name: team,
      points: t.pts, wins: t.wins, is_team: team === TEAM, updated_at: NOW,
    }));
})();

// ─── Cars ───────────────────────────────────────────────────────────────────
export const cars: CarRow[] = [
  {
    id: uid("ca000000", 1), slug: "vr-26", name: "VR-26", season: 2026, chassis: "VR-26 carbon-composite monocoque",
    power_unit: "Vortex-Halcyon VH-7 1.6L V6 turbo hybrid",
    tagline: "Our most complete car. Built for the edge of grip.",
    description: `The VR-26 is the product of a clean-sheet aerodynamic philosophy led by Technical Director Daniel Okafor. A radical sidepod undercut feeds a reprofiled floor, while a new pull-rod front suspension frees airflow to the leading edge of the venturi tunnels.

Mechanically, the car runs a lighter gearbox casing and a revised cooling layout that allowed the engineers to close the bodywork by 40 mm across the rear. The result is a car that is kinder to its rear tyres in traffic and markedly stronger in high-speed corners than its predecessor.`,
    image_url: unsplash(IMG.darkCar, 1600), hero_image_url: unsplash(IMG.garageRear, 2000),
    specs: [
      { group: "Power unit", label: "Engine", value: "1.6L V6 turbo hybrid" },
      { group: "Power unit", label: "Max RPM", value: "15,000" },
      { group: "Power unit", label: "Battery energy", value: "4 MJ" },
      { group: "Power unit", label: "MGU-K power", value: "350 kW" },
      { group: "Chassis", label: "Monocoque", value: "Carbon-fibre composite" },
      { group: "Chassis", label: "Front suspension", value: "Pull-rod, carbon wishbones" },
      { group: "Chassis", label: "Rear suspension", value: "Push-rod, torsion bars" },
      { group: "Chassis", label: "Gearbox", value: "8-speed sequential, seamless shift" },
      { group: "Dimensions", label: "Wheelbase", value: "3,400 mm" },
      { group: "Dimensions", label: "Minimum weight", value: "768 kg" },
      { group: "Dimensions", label: "Fuel capacity", value: "70 kg" },
      { group: "Dimensions", label: "Wheels", value: "18-inch, Pirelli" },
    ],
    achievements: [
      { label: "Wins", value: "5" }, { label: "Podiums", value: "14" },
      { label: "Pole positions", value: "4" }, { label: "Fastest laps", value: "6" },
    ],
    is_current: true, ...stamp("2026-02-10T00:00:00Z"),
  },
  {
    id: uid("ca000000", 2), slug: "vr-25", name: "VR-25", season: 2025, chassis: "VR-25",
    power_unit: "Vortex-Halcyon VH-6 1.6L V6 turbo hybrid",
    tagline: "The breakthrough.",
    description: `The VR-25 delivered the team's first win in five years at Monaco and finished third in the Constructors' standings. Its high-rake concept proved strong on street circuits but struggled with porpoising on smoother tracks early in the season until a floor update in Barcelona.`,
    image_url: unsplash(IMG.yellowCar, 1600), hero_image_url: unsplash(IMG.carsCurbs, 2000),
    specs: [
      { group: "Power unit", label: "Engine", value: "1.6L V6 turbo hybrid" },
      { group: "Power unit", label: "MGU-K power", value: "120 kW" },
      { group: "Chassis", label: "Gearbox", value: "8-speed sequential" },
      { group: "Dimensions", label: "Minimum weight", value: "798 kg" },
    ],
    achievements: [
      { label: "Wins", value: "2" }, { label: "Podiums", value: "9" },
      { label: "Constructors'", value: "P3" },
    ],
    is_current: false, ...stamp("2025-02-10T00:00:00Z"),
  },
  {
    id: uid("ca000000", 3), slug: "vr-24", name: "VR-24", season: 2024, chassis: "VR-24",
    power_unit: "Vortex-Halcyon VH-5 1.6L V6 turbo hybrid",
    tagline: "The foundation.",
    description: `A transitional car that introduced the team's current suspension architecture. It scored points in 19 of 24 races and finished fifth in the Constructors' standings.`,
    image_url: unsplash(IMG.blueWhiteCar, 1600), hero_image_url: unsplash(IMG.redYellowCar, 2000),
    specs: [
      { group: "Power unit", label: "Engine", value: "1.6L V6 turbo hybrid" },
      { group: "Dimensions", label: "Minimum weight", value: "798 kg" },
    ],
    achievements: [{ label: "Podiums", value: "3" }, { label: "Constructors'", value: "P5" }],
    is_current: false, ...stamp("2024-02-10T00:00:00Z"),
  },
];

// ─── Partners ───────────────────────────────────────────────────────────────
export const partners: PartnerRow[] = (
  [
    ["Halcyon Cloud", "title", "Title partner and cloud platform. Every lap of telemetry lands in Halcyon within 200 ms of the car crossing the line."],
    ["Northgate Energy", "principal", "Sustainable fuel partner powering the VH-7 on 100% advanced sustainable fuel."],
    ["Kinetiq Timepieces", "principal", "Official timing partner."],
    ["Orbital Telecom", "official", "Connectivity between the garage and the Silverstone operations room."],
    ["Stratos Apparel", "official", "Official teamwear and fan merchandise."],
    ["Meridian Bank", "official", "Official financial services partner."],
    ["Veltro Lubricants", "supplier", "Lubricants and fluids."],
    ["Apex Composites", "supplier", "Carbon-fibre components."],
    ["Corsa Brakes", "supplier", "Brake discs and calipers."],
    ["Lumen Simulation", "supplier", "Driver-in-the-loop simulator technology."],
  ] as const
).map(([name, tier, description], i) => ({
  id: uid("ba000000", i + 1), slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name, tier,
  logo_url: null, website_url: "https://example.com", description, sort_order: i + 1,
  is_active: true, ...stamp("2026-01-05T00:00:00Z"),
}));

// ─── Articles ───────────────────────────────────────────────────────────────
type ArticleSeed = Omit<ArticleRow, "id" | "created_at" | "updated_at" | "status" | "author_name" | "is_featured" | "video_url"> &
  Partial<Pick<ArticleRow, "is_featured" | "video_url" | "author_name">>;

const ARTICLES: ArticleSeed[] = [
  {
    slug: "moretti-takes-sao-paulo-podium-in-the-rain",
    title: "Moretti holds off Reyes for a rain-soaked São Paulo podium",
    excerpt: "A late switch to intermediates and 14 laps of defending gave Luca Moretti his seventh podium of the season at Interlagos.",
    category: "race-report", tags: ["Interlagos", "Luca Moretti", "Race report"], is_featured: true,
    cover_image_url: "/images/news/moretti-sao-paulo-podium.webp", published_at: "2026-11-08T21:30:00Z",
    body: `Interlagos delivered, as it always does. After a dry opening stint that saw Luca Moretti run a comfortable fourth, the rain arrived on lap 44 and turned the São Paulo Grand Prix into a strategy lottery.

## The call

Head of Race Strategy Priya Raman had already positioned Moretti for a late stop. When the first drops hit the Senna S, the pit wall committed to intermediates a lap before the leaders. "We lost two seconds on the in-lap and gained eleven on the out-lap," Raman said afterwards. "Those are the laps you win races on."

Moretti rejoined second behind Oliver Hart and ahead of Mateo Reyes, who had stayed out one lap too long.

## Fourteen laps of defence

What followed was a masterclass in managing a car on a drying-then-wetting track. Reyes had the fresher tyres and the DRS, but Moretti used every centimetre of the kerb exiting Juncão to hold the inside line into Turn 1.

> "I could see him in both mirrors for fourteen laps. You just focus on your own braking points and let him make the mistake." — Luca Moretti

Reyes never made it. Moretti crossed the line 0.8 seconds clear to take second place and 18 points, cutting the gap in the Drivers' Championship.

## Nakamura's recovery

Kai Nakamura's afternoon was more complicated. A puncture from contact at Turn 4 dropped him to last, but a long middle stint on hards and the same well-timed switch to intermediates brought him back to eighth.

The team leaves Brazil second in the Constructors' standings with three rounds remaining.`,
  },
  {
    slug: "vr-26-floor-upgrade-explained",
    title: "Inside the VR-26 floor upgrade that changed our season",
    excerpt: "Technical Director Daniel Okafor on the Barcelona package, why it took eleven weeks to build and what it unlocked in the car.",
    category: "feature", tags: ["Technology", "VR-26", "Aerodynamics"],
    cover_image_url: "/images/news/vr-26-floor-upgrade.webp", published_at: "2026-10-30T10:00:00Z",
    body: `When the VR-26 rolled out at pre-season testing it was already a good car. What arrived in Barcelona in June made it a contender. Daniel Okafor sat down with us to explain the biggest upgrade the team has ever brought to a single race.

## The problem

"Through the first six rounds we had a car that was quick over one lap but inconsistent in the race," Okafor says. "The floor was sensitive to ride height. Every time the fuel load came down, the aero balance moved forward and the drivers lost confidence in the rear."

## The fix

The new floor reprofiled the venturi tunnel inlets and added a series of vortex generators along the floor edge. It was paired with revised rear brake ducts and a new beam wing.

- Eleven weeks from concept to car
- 1,400 CFD runs and 36 wind tunnel sessions
- 2.4 kg lighter than the launch floor

## The result

Since Barcelona, Moretti and Nakamura have scored 73 per cent of the team's points. "The lap time gain was modest," Okafor says. "The consistency gain was everything."`,
  },
  {
    slug: "nakamura-first-win-suzuka",
    title: "Nakamura wins at home: a first victory at Suzuka",
    excerpt: "From pole to flag, Kai Nakamura became the first Japanese driver to win at Suzuka for Vortex Racing.",
    category: "race-report", tags: ["Suzuka", "Kai Nakamura", "Win"],
    cover_image_url: "/images/news/nakamura-suzuka-win.webp", published_at: "2026-03-29T09:30:00Z",
    body: `Kai Nakamura led every lap of the Japanese Grand Prix to take his first win in only his third start for the team, in front of a crowd that had been chanting his name since Friday practice.

## Pole and control

A stunning final run in Q3 put Nakamura on pole by 0.212 seconds. On Sunday he converted it with a clean start and controlled the pace through both stints, never allowing Mateo Reyes within two seconds.

## The moment

Nakamura's radio message as he crossed the line was simply: "Arigatou. For everyone." The donuts on the pit straight that followed earned him a quiet word from the stewards and a loud one from the grandstands.

> "He drove like he has been doing this for ten years. The maturity is frightening." — Mara Lindqvist, Team Principal`,
  },
  {
    slug: "vortex-academy-2026-intake",
    title: "Vortex Academy announces 2026 intake",
    excerpt: "Three new junior drivers join the programme, including the youngest karting world champion in a decade.",
    category: "team", tags: ["Academy", "Junior programme"],
    cover_image_url: unsplash(IMG.driverTrophy, 1800), published_at: "2026-01-20T09:00:00Z",
    body: `The Vortex Academy welcomes three drivers for 2026. Head of Academy Aiko Tanaka: "We are not looking for finished products. We are looking for people who will be relentless about the details."

## The intake

1. **Sofia Marchetti** (15, Italy) — 2025 karting world champion
2. **Daniel Osei** (17, Ghana) — British F4 runner-up
3. **Mikkel Sørensen** (18, Denmark) — Formula Regional race winner

All three will have simulator access at Silverstone and a structured physical and media training programme.`,
  },
  {
    slug: "halcyon-cloud-title-partnership-extended",
    title: "Halcyon Cloud extends title partnership through 2030",
    excerpt: "A multi-year extension deepens the team's data and simulation partnership.",
    category: "partner", tags: ["Partners", "Halcyon Cloud"],
    cover_image_url: unsplash(IMG.mechanicEngine, 1800), published_at: "2026-02-14T08:00:00Z",
    body: `Vortex Racing and Halcyon Cloud have agreed a four-year extension to the title partnership that began in 2023.

The expanded agreement moves the team's entire simulation workload onto Halcyon infrastructure, including the driver-in-the-loop simulator at Silverstone and trackside telemetry processing.

"The partnership is at its best when it is invisible," said COO Grace Mbeki. "The strategists see a number appear on a screen. Behind that number is a lot of Halcyon engineering."`,
  },
  {
    slug: "pit-stop-record-silverstone",
    title: "1.92 seconds: how the crew set a new team pit-stop record",
    excerpt: "A frame-by-frame breakdown of the British Grand Prix stop that gained Moretti track position.",
    category: "feature", tags: ["Pit crew", "Silverstone"],
    cover_image_url: "/images/news/pit-stop-record.webp", published_at: "2026-07-08T10:00:00Z",
    body: `Twenty-two people, four wheels, 1.92 seconds. The stop on lap 31 of the British Grand Prix was the fastest in the team's history and the one that put Luca Moretti ahead of Oliver Hart for the final stint.

## The breakdown

- **0.00s** Car stops within 4 cm of the mark
- **0.31s** All four wheel guns engaged
- **1.10s** Rear wheels on
- **1.74s** Front wheels on
- **1.92s** Jacks drop, green light

"The gun operators get the credit, but the jack men and the wheel-off crew are the ones who make the timing work," said Chief Mechanic Rory Quinn.`,
  },
  {
    slug: "las-vegas-preview-what-to-expect",
    title: "Las Vegas preview: cold tyres, long straights and a title fight",
    excerpt: "Everything you need to know before the lights go out on the Strip.",
    category: "news", tags: ["Las Vegas", "Preview"],
    cover_image_url: "/images/news/las-vegas-preview.webp", published_at: "2026-11-14T12:00:00Z",
    body: `The Las Vegas Strip Circuit is unlike anything else on the calendar: a 6.2 km night race in track temperatures that can fall into single digits. Tyre warm-up will decide qualifying and the first lap of every stint.

## Our approach

The VR-26's strength in high-speed corners is less of an asset here, but the team has brought a low-downforce rear wing and a revised brake-duct package to manage the cold.

## The championship

Moretti sits second in the Drivers' standings. With three races left, every point counts. "We go there to win," said Mara Lindqvist. "Anything else is maths."`,
  },
  {
    slug: "behind-the-visor-moretti-video",
    title: "Behind the visor: a lap of Monaco with Luca Moretti",
    excerpt: "Onboard with commentary from the man himself on the lap that won the 2025 Monaco Grand Prix.",
    category: "video", tags: ["Video", "Monaco", "Onboard"],
    cover_image_url: unsplash(IMG.glovesWheel, 1800), published_at: "2026-06-03T16:00:00Z",
    video_url: "https://www.youtube.com/watch?v=Aw0L44rj364",
    body: `Ahead of this year's Monaco Grand Prix, Luca Moretti talks us through his pole lap from 2025, corner by corner. From the commitment through Casino Square to the "hold your breath" moment at the Swimming Pool, this is what a lap of the Principality feels like from the cockpit.`,
  },
  {
    slug: "fan-zone-silverstone-2026",
    title: "Fan Zone returns to Silverstone with driver Q&As and sim races",
    excerpt: "Free entry for grandstand ticket holders across all three days of the British Grand Prix.",
    category: "news", tags: ["Fans", "Silverstone"],
    cover_image_url: unsplash(IMG.fansGrandstand, 1800), published_at: "2026-06-20T09:00:00Z",
    body: `The Vortex Fan Zone is back for the British Grand Prix, bigger than last year and with a full schedule of driver appearances, pit-stop challenges and simulator races against Academy drivers.

Grandstand ticket holders enter free. The Fan Zone opens at 08:00 each day and closes one hour after the final session.`,
  },
  {
    slug: "draft-end-of-season-review",
    title: "End of season review (draft)",
    excerpt: "Work in progress — publishes after Abu Dhabi.",
    category: "feature", tags: ["Season review"],
    cover_image_url: unsplash(IMG.trophies, 1800), published_at: null,
    body: `Draft content. Not visible on the public site.`,
  },
];

export const articles: ArticleRow[] = ARTICLES.map((a, i) => ({
  id: uid("ab000000", i + 1),
  author_name: a.author_name ?? "Vortex Racing Media",
  is_featured: a.is_featured ?? false,
  video_url: a.video_url ?? null,
  status: a.published_at ? "published" : "draft",
  ...a,
  ...stamp(a.published_at ?? NOW),
}));

export const siteSettings: { key: string; value: Record<string, unknown> }[] = [
  {
    key: "team_about",
    value: {
      heading: "A racing team built on obsession with detail.",
      body: "Founded in 2011 and based at Silverstone, Vortex Racing has grown from a 90-person start-up into a 640-strong championship contender with its own wind tunnel, composites facility and driver academy.",
      stats: [
        { label: "Founded", value: "2011" },
        { label: "Base", value: "Silverstone, UK" },
        { label: "People", value: "640" },
        { label: "Race wins", value: "14" },
      ],
    },
  },
];

export const seed = {
  drivers, teamMembers, races, raceResults, driverStandings, constructorStandings,
  cars, partners, articles, siteSettings,
};
