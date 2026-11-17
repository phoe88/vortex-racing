import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { adminList } from "@/features/admin/queries";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { DataTable, EmptyState, Td, Th } from "@/features/admin/components/data-table";
import { DeleteButton } from "@/features/admin/components/delete-button";
import { SavedFlash } from "@/features/admin/components/flash";
import { Lozenge } from "@/components/ui/lozenge";
import { deleteDriver } from "@/actions/drivers";
import { flagEmoji } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";

export const metadata = { title: "Drivers" };

export default async function AdminDrivers() {
  const drivers = await adminList("drivers", { orderBy: "sort_order", ascending: true });
  return (
    <>
      <AdminPageHeader title="Drivers" description="Race, reserve and academy drivers." actions={<Link href="/admin/drivers/new" className={buttonClass({ appearance: "primary" })}><Plus className="size-4" aria-hidden /> New driver</Link>} />
      <Suspense><SavedFlash /></Suspense>
      {drivers.length === 0 ? <EmptyState title="No drivers yet" /> : (
        <DataTable head={<><Th>Driver</Th><Th>Role</Th><Th>Stats</Th><Th>Active</Th><Th className="text-right">Actions</Th></>}>
          {drivers.map((d) => (
            <tr key={d.id}>
              <Td>
                <div className="flex items-center gap-3">
                  <div className="relative size-10 overflow-hidden rounded-full bg-neutral">{d.image_url && <Image src={d.image_url} alt="" fill sizes="40px" className="object-cover object-top" />}</div>
                  <div>
                    <Link href={`/admin/drivers/${d.id}`} className="font-medium text-link hover:underline">{flagEmoji(d.country_code)} {d.first_name} {d.last_name} {d.number != null && <span className="text-subtle">#{d.number}</span>}</Link>
                    <p className="type-body-small text-subtlest">/team/{d.slug}</p>
                  </div>
                </div>
              </Td>
              <Td className="capitalize text-subtle">{d.role}</Td>
              <Td className="text-subtle">{d.career_wins}W · {d.career_podiums}P · {d.career_poles}PP</Td>
              <Td><Lozenge appearance={d.is_active ? "success" : "neutral"}>{d.is_active ? "Yes" : "Hidden"}</Lozenge></Td>
              <Td className="text-right">
                <div className="inline-flex items-center gap-2">
                  <Link href={`/admin/drivers/${d.id}`} className={buttonClass()}>Edit</Link>
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
