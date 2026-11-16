import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { adminList } from "@/features/admin/queries";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { DataTable, EmptyState, Td, Th } from "@/features/admin/components/data-table";
import { DeleteButton } from "@/features/admin/components/delete-button";
import { SavedFlash } from "@/features/admin/components/flash";
import { PartnerLogo } from "@/components/shared/partner-logo";
import { Badge } from "@/components/ui/badge";
import { deletePartner } from "@/actions/partners";

export const metadata = { title: "Partners" };

export default async function AdminPartners() {
  const partners = await adminList("partners", { orderBy: "sort_order", ascending: true });
  return (
    <>
      <AdminPageHeader title="Partners" description="Sponsors and technical suppliers." actions={<Link href="/admin/partners/new" className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white"><Plus className="size-4" /> Add partner</Link>} />
      <Suspense><SavedFlash /></Suspense>
      {partners.length === 0 ? <EmptyState title="No partners yet" /> : (
        <DataTable head={<><Th>Partner</Th><Th>Tier</Th><Th>Active</Th><Th className="text-right">Actions</Th></>}>
          {partners.map((p) => (
            <tr key={p.id} className="hover:bg-white/3">
              <Td><div className="flex items-center gap-3"><PartnerLogo partner={p} size="sm" /><Link href={`/admin/partners/${p.id}`} className="text-xs text-muted hover:text-ice">edit</Link></div></Td>
              <Td className="capitalize text-muted">{p.tier}</Td>
              <Td><Badge tone={p.is_active ? "success" : "muted"}>{p.is_active ? "Yes" : "Hidden"}</Badge></Td>
              <Td className="text-right"><div className="inline-flex gap-2"><Link href={`/admin/partners/${p.id}`} className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-semibold hover:bg-white/6">Edit</Link><DeleteButton action={deletePartner.bind(null, p.id)} compact /></div></Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
