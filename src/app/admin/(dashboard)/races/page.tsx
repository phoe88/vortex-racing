import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { adminList } from "@/features/admin/queries";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { DataTable, EmptyState, Td, Th } from "@/features/admin/components/data-table";
import { DeleteButton } from "@/features/admin/components/delete-button";
import { SavedFlash } from "@/features/admin/components/flash";
import { Badge } from "@/components/ui/badge";
import { deleteRace } from "@/actions/races";
import { flagEmoji, formatDate } from "@/lib/utils";

export const metadata = { title: "Races" };

export default async function AdminRaces() {
  const races = (await adminList("races", { orderBy: "race_start", ascending: false }));
  return (
    <>
      <AdminPageHeader title="Races" description="Calendar, session times and results." actions={<Link href="/admin/races/new" className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white"><Plus className="size-4" /> New race</Link>} />
      <Suspense><SavedFlash /></Suspense>
      {races.length === 0 ? <EmptyState title="No races yet" /> : (
        <DataTable head={<><Th>Rd</Th><Th>Race</Th><Th>Date</Th><Th>Status</Th><Th className="text-right">Actions</Th></>}>
          {races.map((r) => (
            <tr key={r.id} className="hover:bg-white/3">
              <Td className="font-display text-lg font-bold">{r.round}</Td>
              <Td><Link href={`/admin/races/${r.id}`} className="font-semibold hover:text-accent-2">{flagEmoji(r.country_code)} {r.name}</Link><p className="text-xs text-muted">{r.circuit_name} · {r.season}</p></Td>
              <Td className="text-muted">{formatDate(r.race_start, { day: "numeric", month: "short", year: "numeric" })}</Td>
              <Td><Badge tone={r.status === "completed" ? "muted" : r.status === "live" ? "accent" : "yellow"}>{r.status}</Badge></Td>
              <Td className="text-right">
                <div className="inline-flex items-center gap-2">
                  <Link href={`/admin/races/${r.id}/results`} className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-semibold hover:bg-white/6">Results</Link>
                  <Link href={`/admin/races/${r.id}`} className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-semibold hover:bg-white/6">Edit</Link>
                  <DeleteButton action={deleteRace.bind(null, r.id, r.slug)} compact />
                </div>
              </Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
