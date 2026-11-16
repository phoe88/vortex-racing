import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { adminList } from "@/features/admin/queries";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { DataTable, EmptyState, Td, Th } from "@/features/admin/components/data-table";
import { DeleteButton } from "@/features/admin/components/delete-button";
import { SavedFlash } from "@/features/admin/components/flash";
import { Badge } from "@/components/ui/badge";
import { deleteDriver } from "@/actions/drivers";
import { flagEmoji } from "@/lib/utils";

export const metadata = { title: "Drivers" };

export default async function AdminDrivers() {
  const drivers = await adminList("drivers", { orderBy: "sort_order", ascending: true });
  return (
    <>
      <AdminPageHeader title="Drivers" description="Race, reserve and academy drivers." actions={<Link href="/admin/drivers/new" className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white"><Plus className="size-4" /> New driver</Link>} />
      <Suspense><SavedFlash /></Suspense>
      {drivers.length === 0 ? <EmptyState title="No drivers yet" /> : (
        <DataTable head={<><Th>Driver</Th><Th>Role</Th><Th>Stats</Th><Th>Active</Th><Th className="text-right">Actions</Th></>}>
          {drivers.map((d) => (
            <tr key={d.id} className="hover:bg-white/3">
              <Td>
                <div className="flex items-center gap-3">
                  <div className="relative size-10 overflow-hidden rounded-full bg-navy-2">{d.image_url && <Image src={d.image_url} alt="" fill sizes="40px" className="object-cover object-top" />}</div>
                  <div>
                    <Link href={`/admin/drivers/${d.id}`} className="font-semibold hover:text-accent-2">{flagEmoji(d.country_code)} {d.first_name} {d.last_name} {d.number != null && <span className="text-muted">#{d.number}</span>}</Link>
                    <p className="text-xs text-muted">/team/{d.slug}</p>
                  </div>
                </div>
              </Td>
              <Td className="capitalize text-muted">{d.role}</Td>
              <Td className="text-muted">{d.career_wins}W · {d.career_podiums}P · {d.career_poles}PP</Td>
              <Td><Badge tone={d.is_active ? "success" : "muted"}>{d.is_active ? "Yes" : "Hidden"}</Badge></Td>
              <Td className="text-right">
                <div className="inline-flex items-center gap-2">
                  <Link href={`/admin/drivers/${d.id}`} className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-semibold hover:bg-white/6">Edit</Link>
                  <DeleteButton action={deleteDriver.bind(null, d.id, d.slug)} compact />
                </div>
              </Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
