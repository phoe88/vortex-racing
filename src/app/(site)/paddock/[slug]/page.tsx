import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { PERKS, getPerk, type Perk } from "@/features/paddock/content";
import { getPerkStories } from "@/features/paddock/queries";
import { getLastCompletedRace, getNextRace, getRaces } from "@/features/races/queries";
import { getTeamMembers } from "@/features/team/queries";
import { ArticleCard } from "@/components/shared/article-card";
import { NextSessionCountdown } from "@/components/shared/countdown";
import { NewsletterBlock } from "@/components/shared/newsletter-block";
import { PerkCard } from "@/components/shared/perk-card";
import { RaceCard, raceWeekendRange } from "@/components/shared/race-card";
import { TextBanner } from "@/components/shared/text-banner";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { flagEmoji, formatPoints } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export function generateStaticParams() {
  return PERKS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/paddock/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const perk = getPerk(slug);
  if (!perk) return { title: "Not found" };
  return {
    title: `${perk.title} | Paddock Pass`,
    description: perk.summary,
    alternates: { canonical: `/paddock/${perk.slug}` },
    openGraph: { title: `${perk.title} | ${siteConfig.name} Paddock Pass`, description: perk.summary, images: [perk.image] },
  };
}

export default async function PerkPage({ params }: PageProps<"/paddock/[slug]">) {
  const { slug } = await params;
  const perk = getPerk(slug);
  if (!perk) notFound();
  const stories = await getPerkStories(perk);
  const others = PERKS.filter((p) => p.slug !== perk.slug);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[88vh] flex-col justify-end overflow-hidden pb-14 pt-40">
        <Image src={perk.image} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="media-scrim-soft absolute inset-0 -z-10" />
        <div className="container-x">
          <Link href="/paddock" className="type-heading-xxsmall inline-flex items-center gap-3 text-subtle hover:text-default">
            <span className="h-px w-12 bg-red" aria-hidden /> Paddock Pass
          </Link>
          <h1 className="type-display-xl mt-4 max-w-5xl">{perk.title}</h1>
          <p className="type-body-large mt-5 max-w-xl text-subtle">{perk.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#signup" appearance="primary" spacing="large">Sign up free</ButtonLink>
            <ButtonLink href="/paddock" spacing="large">All benefits</ButtonLink>
          </div>
        </div>
      </section>

      {/* Two-tone statement */}
      <section className="container-x mt-24 sm:mt-32">
        <p className="type-heading-xxlarge max-w-5xl">
          {perk.statement[0]} <span className="text-subtle">{perk.statement[1]}</span>
        </p>
      </section>

      <TextBanner text={perk.banner} className="mt-16 sm:mt-24" />

      {/* What you get */}
      <section className="container-x mt-16 sm:mt-24">
        <h2 className="type-heading-xlarge">What you get</h2>
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2">
          {perk.highlights.map((h, i) => (
            <StaggerItem key={h.title} className="card h-full p-8">
              <p className="text-[2.5rem] font-extrabold leading-none tabular-nums text-red">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="type-heading-medium mt-6">{h.title}</h3>
              <p className="mt-3 text-subtle">{h.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <PerkLiveData perk={perk} />

      {stories.length > 0 && (
        <Carousel title={perk.stories.title} className="mt-24 sm:mt-32">
          {stories.map((a, i) => <ArticleCard key={a.id} article={a} number={i + 1} />)}
        </Carousel>
      )}

      {/* FAQ */}
      <section className="container-x mt-24 grid gap-10 sm:mt-32 lg:grid-cols-[22rem_1fr]">
        <h2 className="type-heading-xlarge">Questions</h2>
        <Accordion items={perk.faqs} />
      </section>

      <div id="signup" className="scroll-mt-0">
        <NewsletterBlock source={`paddock-${perk.slug}`} className="mt-24 sm:mt-32" />
      </div>

      {/* Other benefits */}
      <section className="container-x mt-24 sm:mt-32">
        <h2 className="type-heading-xlarge">More Paddock Pass benefits</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {others.map((p) => <PerkCard key={p.slug} perk={p} />)}
        </div>
      </section>
    </>
  );
}

/** Race and team data that goes with each benefit, straight from the site's own content. */
async function PerkLiveData({ perk }: { perk: Perk }) {
  if (perk.slug === "race-previews") {
    const [next, races] = await Promise.all([getNextRace(), getRaces()]);
    const upcoming = races.filter((r) => r.status !== "completed");
    if (!next) return null;
    return (
      <>
        <section className="container-x mt-24 sm:mt-32">
          <h2 className="type-heading-xlarge">Up next</h2>
          <div className="card mt-10 grid overflow-hidden sm:grid-cols-2">
            <Link href={`/races/${next.slug}`} className="group relative isolate flex min-h-72 flex-col justify-start p-8 sm:p-10">
              {next.hero_image_url && <Image src={next.hero_image_url} alt="" fill sizes="(min-width: 640px) 50vw, 100vw" className="-z-20 object-cover transition-transform duration-700 group-hover:scale-[1.04]" />}
              <div className="absolute inset-0 -z-10 bg-navy/55" />
              <p className="type-body-small text-subtle">Round {next.round}</p>
              <h3 className="type-heading-large mt-1">{next.name}</h3>
              <p className="mt-3 flex items-center gap-2"><CalendarDays className="size-4" aria-hidden /> {raceWeekendRange(next)}</p>
              <p className="mt-2 text-subtle"><span aria-hidden>{flagEmoji(next.country_code)}</span> {next.circuit_name}</p>
            </Link>
            <NextSessionCountdown sessions={next.sessions} className="flex flex-col p-8 sm:p-10" />
          </div>
        </section>
        {upcoming.length > 1 && (
          <Carousel title="Coming up on the calendar" className="mt-24 sm:mt-32" itemClassName="w-[78vw] sm:w-[20rem]">
            {upcoming.map((r) => <RaceCard key={r.id} race={r} highlight={r.id === next.id} />)}
          </Carousel>
        )}
      </>
    );
  }

  if (perk.slug === "team-debriefs") {
    const last = await getLastCompletedRace();
    if (!last) return null;
    const ours = last.results.filter((r) => r.team_name === siteConfig.name);
    const winner = last.results.find((r) => r.position === 1);
    return (
      <section className="container-x mt-24 sm:mt-32">
        <h2 className="type-heading-xlarge">Last time out</h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <Link href={`/races/${last.slug}`} className="group relative isolate flex min-h-72 flex-col justify-end overflow-hidden rounded-xl bg-navy-raised p-8">
            {last.hero_image_url && <Image src={last.hero_image_url} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="-z-20 object-cover transition-transform duration-700 group-hover:scale-[1.04]" />}
            <div className="media-scrim absolute inset-0 -z-10" />
            <p className="type-body-small text-subtle">Round {last.round}</p>
            <h3 className="type-heading-large mt-1">{last.name}</h3>
            {winner && <p className="mt-2 text-subtle">Won by {winner.driver_name}</p>}
            <span className="mt-4 font-medium underline-offset-4 group-hover:underline">Full classification</span>
          </Link>
          <div className="card p-8">
            <p className="type-heading-small">Our result</p>
            <ul className="mt-4">
              {ours.map((r) => (
                <li key={r.id} className="flex items-center gap-5 border-t py-4">
                  <span className="type-metric-medium w-16 tabular-nums">{r.position ? `P${r.position}` : "DNF"}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{r.driver_name}</span>
                    <span className="type-body-small block text-subtle">{r.status === "Finished" ? `Started P${r.grid} · ${r.time_text}` : r.status}</span>
                  </span>
                  <span className="type-metric-small tabular-nums">+{formatPoints(r.points)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  if (perk.slug === "behind-the-scenes") {
    const members = await getTeamMembers();
    if (members.length === 0) return null;
    return (
      <div className="mt-24 bg-red py-20 sm:mt-32 sm:py-28">
        <Carousel title="Meet the people" itemClassName="w-[78vw] sm:w-[24rem]">
          {members.map((m) => (
            <Reveal key={m.id} className="h-full">
              <article className="h-full rounded-xl bg-white/15 p-8 backdrop-blur-sm">
                <span className="inline-flex size-16 items-center justify-center rounded-full bg-white/20 text-2xl font-extrabold" aria-hidden>
                  {m.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </span>
                <h3 className="type-heading-small mt-6">{m.name}</h3>
                <p className="font-medium text-white/80">{m.role_title}</p>
                <p className="type-body-small mt-3 text-white/80">{m.bio}</p>
              </article>
            </Reveal>
          ))}
        </Carousel>
      </div>
    );
  }

  return null;
}
