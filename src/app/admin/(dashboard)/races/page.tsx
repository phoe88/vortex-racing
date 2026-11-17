import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { adminList } from "@/features/admin/queries";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { DataTable, EmptyState, Td, Th } from "@/features/admin/components/data-table";
import { DeleteButton } from "@/features/admin/components/delete-button";
import { SavedFlash } from "@/features/admin/components/flash";
import { Lozenge } from "@/components/ui/lozenge";
import { deleteRace } from "@/actions/races";
import { flagEmoji, formatDate } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";

export const metadata = { title: "Races" };

export default async function AdminRaces() {
  const races = (await adminList("races", { orderBy: "race_start", ascending: false }));
  return (
    <>
      <AdminPageHeader title="Races" description="Calendar, session times and results." actions={<Link href="/admin/races/new" className={buttonClass({ appearance: "primary" })}><Plus className="size-4" aria-hidden /> New race</Link>} />
      <Suspense><SavedFlash /></Suspense>
      {races.length === 0 ? <EmptyState title="No races yet" /> : (
        <DataTable head={<><Th>Rd</Th><Th>Race</Th><Th>Date</Th><Th>Status</Th><Th className="text-right">Actions</Th></>}>
          {races.map((r) => (
            <tr key={r.id}>
              <Td className="font-medium tabular-nums">{r.round}</Td>
              <Td><Link href={`/admin/races/${r.id}`} className="font-medium text-link hover:underline">{flagEmoji(r.country_code)} {r.name}</Link><p className="type-body-small text-subtlest">{r.circuit_name} · {r.season}</p></Td>
              <Td className="text-subtle">{formatDate(r.race_start, { day: "numeric", month: "short", year: "numeric" })}</Td>
              <Td><Lozenge appearance={r.status === "completed" ? "neutral" : r.status === "live" ? "success" : "information"}>{r.status}</Lozenge></Td>
              <Td className="text-right">
                <div className="inline-flex items-center gap-2">
                  <Link href={`/admin/races/${r.id}/results`} className={buttonClass()}>Results</Link>
                  <Link href={`/admin/races/${r.id}`} className={buttonClass()}>Edit</Link>
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
