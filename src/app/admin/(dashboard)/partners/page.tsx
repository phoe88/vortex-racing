import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { adminList } from "@/features/admin/queries";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { DataTable, EmptyState, Td, Th } from "@/features/admin/components/data-table";
import { DeleteButton } from "@/features/admin/components/delete-button";
import { SavedFlash } from "@/features/admin/components/flash";
import { Lozenge } from "@/components/ui/lozenge";
import { deletePartner } from "@/actions/partners";
import { buttonClass } from "@/components/ui/button";

export const metadata = { title: "Partners" };

export default async function AdminPartners() {
  const partners = await adminList("partners", { orderBy: "sort_order", ascending: true });
  return (
    <>
      <AdminPageHeader title="Partners" description="Sponsors and technical suppliers." actions={<Link href="/admin/partners/new" className={buttonClass({ appearance: "primary" })}><Plus className="size-4" aria-hidden /> Add partner</Link>} />
      <Suspense><SavedFlash /></Suspense>
      {partners.length === 0 ? <EmptyState title="No partners yet" /> : (
        <DataTable head={<><Th>Partner</Th><Th>Tier</Th><Th>Active</Th><Th className="text-right">Actions</Th></>}>
          {partners.map((p) => (
            <tr key={p.id}>
              <Td><Link href={`/admin/partners/${p.id}`} className="font-medium text-link hover:underline">{p.name}</Link></Td>
              <Td className="capitalize text-subtle">{p.tier}</Td>
              <Td><Lozenge appearance={p.is_active ? "success" : "neutral"}>{p.is_active ? "Yes" : "Hidden"}</Lozenge></Td>
              <Td className="text-right"><div className="inline-flex gap-2"><Link href={`/admin/partners/${p.id}`} className={buttonClass()}>Edit</Link><DeleteButton action={deletePartner.bind(null, p.id)} compact /></div></Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
