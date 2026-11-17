import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Plus, RefreshCw } from "lucide-react";
import { adminCounts, adminList } from "@/features/admin/queries";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { Button, ButtonLink } from "@/components/ui/button";
import { Lozenge } from "@/components/ui/lozenge";
import { revalidateEverything } from "@/actions/settings";
import { formatDate } from "@/lib/utils";
import { getSessionUser } from "@/lib/auth";

export default async function AdminDashboard() {
  const [counts, recent, user] = await Promise.all([
    adminCounts(),
    adminList("articles", { orderBy: "updated_at", limit: 6 }),
    getSessionUser(),
  ]);
  const tiles = counts
    ? [
        ["News articles", counts.articles, "/admin/news"],
        ["Drivers", counts.drivers, "/admin/drivers"],
        ["Races", counts.races, "/admin/races"],
        ["Cars", counts.cars, "/admin/cars"],
        ["Partners", counts.partners, "/admin/partners"],
        ["Subscribers", counts.newsletter_subscribers, "/admin/subscribers"],
        ["Media files", counts.media, "/admin/media"],
      ] as const
    : [];

  return (
    <>
      <AdminPageHeader
        title={`Welcome back${user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}`}
        description="Everything on the public site is managed from here. Changes go live immediately."
        actions={
          <>
            <form action={async () => { "use server"; await revalidateEverything(); }}>
              <Button type="submit"><RefreshCw className="size-4" aria-hidden /> Refresh public cache</Button>
            </form>
            <ButtonLink href="/admin/news/new" appearance="primary"><Plus className="size-4" aria-hidden /> New article</ButtonLink>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map(([label, value, href]) => (
          <Link key={label} href={href} className="card group p-4 transition-colors hover:bg-surface-raised-hovered active:bg-surface-raised-pressed">
            <p className="type-body-small text-subtle">{label}</p>
            <p className="type-metric-large mt-0.5 tabular-nums">{value}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-link group-hover:underline">Manage <ArrowRight className="size-4" aria-hidden /></span>
          </Link>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="type-heading-small mb-2">Recently edited</h2>
        <Suspense>
          <ul className="card divide-y">
            {recent.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <Link href={`/admin/news/${a.id}`} className="block truncate font-medium text-link hover:underline">{a.title}</Link>
                  <p className="type-body-small text-subtlest">Updated {formatDate(a.updated_at, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <Lozenge appearance={a.status === "published" ? "success" : "neutral"} className="capitalize">{a.status}</Lozenge>
              </li>
            ))}
            {recent.length === 0 && <li className="px-4 py-6 text-sm text-subtle">No content yet.</li>}
          </ul>
        </Suspense>
      </section>
    </>
  );
}
