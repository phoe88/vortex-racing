import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { adminCounts, adminList } from "@/features/admin/queries";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { Badge } from "@/components/ui/badge";
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
          <form action={async () => { "use server"; await revalidateEverything(); }}>
            <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-xs font-semibold uppercase tracking-[0.12em] hover:bg-white/6">
              <RefreshCw className="size-3.5" /> Refresh public cache
            </button>
          </form>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map(([label, value, href]) => (
          <Link key={label} href={href} className="card group p-5 transition hover:border-white/25">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{label}</p>
            <p className="display mt-2 text-4xl">{value}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs text-muted group-hover:text-accent-2">Manage <ArrowUpRight className="size-3" /></span>
          </Link>
        ))}
        <Link href="/admin/news/new" className="flex items-center justify-center rounded-xl border border-dashed border-accent/50 p-5 font-display text-lg font-bold uppercase text-accent-2 transition hover:bg-accent-soft">+ New article</Link>
      </div>

      <section className="mt-10">
        <h2 className="mb-3 font-display text-lg font-bold uppercase tracking-wide">Recently edited</h2>
        <Suspense>
          <ul className="divide-y divide-line/60 rounded-xl border border-line">
            {recent.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <Link href={`/admin/news/${a.id}`} className="truncate font-semibold hover:text-accent-2">{a.title}</Link>
                  <p className="text-xs text-muted">Updated {formatDate(a.updated_at, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <Badge tone={a.status === "published" ? "success" : "muted"}>{a.status}</Badge>
              </li>
            ))}
            {recent.length === 0 && <li className="px-4 py-6 text-sm text-muted">No content yet.</li>}
          </ul>
        </Suspense>
      </section>
    </>
  );
}
