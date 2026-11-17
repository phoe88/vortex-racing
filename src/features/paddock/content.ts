import { IMG, unsplash } from "@/lib/seed/images";
import type { ArticleCategory } from "@/types";

/**
 * Paddock Pass: what newsletter members get. Each benefit has its own page,
 * linked from the "Get Closer to the Team" sign-up block.
 */
export type PerkSlug = "race-previews" | "team-debriefs" | "exclusive-content" | "behind-the-scenes";

export type Perk = {
  slug: PerkSlug;
  title: string;
  /** Short line used on cards and in metadata. */
  summary: string;
  image: string;
  /** Opening statement: the first part is set in white, the rest in grey. */
  statement: [string, string];
  /** Word repeated across the red banner. */
  banner: string;
  highlights: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  /** Stories shown on the page: these categories or tags first, then the latest news. */
  stories: { title: string; categories?: ArticleCategory[]; tags?: string[] };
};

export const PERKS: Perk[] = [
  {
    slug: "race-previews",
    title: "Race Previews",
    summary: "Everything you need before lights out: circuit guides, strategy calls and weather watch.",
    image: unsplash(IMG.sunsetStadium, 2400),
    statement: [
      "Arrive at every race weekend knowing what to watch for,",
      "from the corners that decide the lap to the tyre calls the pit wall is already planning.",
    ],
    banner: "Race Previews",
    highlights: [
      { title: "Circuit guide", body: "A lap of the track corner by corner with our race engineers: where time is won, where overtakes happen and where races are lost." },
      { title: "Strategy outlook", body: "The tyre allocation, likely pit windows and the one-stop versus two-stop debate, explained before Friday practice starts." },
      { title: "Session times in your time zone", body: "Every practice, qualifying and race start, converted to where you are, with a reminder the evening before." },
      { title: "Weather watch", body: "Forecasts for each session and what rain, heat or wind would change for the car and the drivers." },
    ],
    faqs: [
      { q: "When do race previews arrive?", a: "On the Wednesday of every race week, in time for the drivers' media day and before the first practice session." },
      { q: "Do previews cover sprint weekends?", a: "Yes. Sprint weekends get an extra note on the different format and how it changes the team's approach to Friday." },
      { q: "Can I get previews for one race only?", a: "Previews come with the newsletter for the whole season. You can unsubscribe at any time with one click." },
    ],
    stories: { title: "Latest Previews", tags: ["Preview"], categories: ["news"] },
  },
  {
    slug: "team-debriefs",
    title: "Team Debriefs",
    summary: "What really happened on Sunday, straight from the engineers who made the calls.",
    image: unsplash(IMG.pitCrewDark, 2400),
    statement: [
      "The chequered flag is only half the story.",
      "Debriefs take you through the decisions, the data and the moments that shaped every result.",
    ],
    banner: "Team Debriefs",
    highlights: [
      { title: "The key calls", body: "Why we pitted when we did, what the timing screens showed and what we would do differently with hindsight." },
      { title: "Driver reflections", body: "Both drivers on their race in their own words, including the radio messages that never made it to TV." },
      { title: "By the numbers", body: "Lap time charts, tyre stints and pit-stop times laid out simply so you can follow the race the way the pit wall did." },
      { title: "Looking ahead", body: "What the team takes from the weekend into the next round, and the upgrades on their way to the car." },
    ],
    faqs: [
      { q: "When do debriefs arrive?", a: "On the Monday after every race, once the engineers have finished their own review of the data." },
      { q: "Do you cover bad weekends too?", a: "Always. The weekends that go wrong are often the most interesting to explain." },
      { q: "Where can I see the full results?", a: "Every race page on this site has the full classification, and the standings page is updated after each round." },
    ],
    stories: { title: "Latest Debriefs", categories: ["race-report"] },
  },
  {
    slug: "exclusive-content",
    title: "Exclusive Content",
    summary: "Onboard video, technical explainers and interviews you will not find anywhere else.",
    image: unsplash(IMG.cockpitClose, 2400),
    statement: [
      "Go further than the broadcast.",
      "Members get onboard laps, tech deep dives and long-form interviews before anyone else.",
    ],
    banner: "Exclusive Content",
    highlights: [
      { title: "Onboard laps", body: "Ride along with our drivers for a full lap of each circuit, with their commentary on every braking point." },
      { title: "Tech explained", body: "Our engineers break down the latest upgrades on the car: what changed, why, and what it is worth in lap time." },
      { title: "Long-form interviews", body: "Extended conversations with drivers, engineers and mechanics about life on the road and the work behind the results." },
      { title: "Early access", body: "New videos and features land in your inbox first, a day before they go public on the site." },
    ],
    faqs: [
      { q: "Is exclusive content free?", a: "Yes. Everything is included with the free newsletter." },
      { q: "Where can I watch the videos?", a: "Every video opens on this site and works on phones, tablets and desktops." },
      { q: "How often is new content released?", a: "At least one new feature or video every week of the season, and regular extras during the winter break." },
    ],
    stories: { title: "Latest Videos & Features", categories: ["video", "feature"] },
  },
  {
    slug: "behind-the-scenes",
    title: "Behind the Scenes",
    summary: "Life in the garage, the factory and the academy: the people who make the team go faster.",
    image: unsplash(IMG.garageSilhouettes, 2400),
    statement: [
      "Meet the people behind the car.",
      "From the factory floor to the pit lane, see how hundreds of specialists turn ideas into lap time.",
    ],
    banner: "Behind the Scenes",
    highlights: [
      { title: "Inside the garage", body: "What happens in the hours before a race, from car build to the final checks on the grid." },
      { title: "Factory tours", body: "Walk through the wind tunnel, the composites shop and the simulator at our base." },
      { title: "Academy stories", body: "Follow our young drivers as they work their way up through the junior categories." },
      { title: "Meet the crew", body: "Mechanics, engineers and strategists on what their job really involves on a race weekend." },
    ],
    faqs: [
      { q: "Can I visit the factory?", a: "Members hear first about factory open days and fan events, including how to apply for places." },
      { q: "Who appears in behind-the-scenes stories?", a: "Everyone from team leadership to the pit crew and the academy drivers." },
      { q: "How do I join the academy?", a: "The academy scouts drivers from karting and junior single-seaters. Our academy stories explain how the programme works." },
    ],
    stories: { title: "Inside the Team", categories: ["team", "feature"] },
  },
];

export function getPerk(slug: string): Perk | undefined {
  return PERKS.find((p) => p.slug === slug);
}
