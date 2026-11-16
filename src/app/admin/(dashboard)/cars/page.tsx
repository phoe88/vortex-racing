import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { adminList } from "@/features/admin/queries";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { DataTable, EmptyState, Td, Th } from "@/features/admin/components/data-table";
import { DeleteButton } from "@/features/admin/components/delete-button";
import { SavedFlash } from "@/features/admin/components/flash";
import { Badge } from "@/components/ui/badge";
import { deleteCar } from "@/actions/cars";

export const metadata = { title: "Cars" };

export default async function AdminCars() {
  const cars = await adminList("cars", { orderBy: "season" });
  return (
    <>
      <AdminPageHeader title="Cars" description="Vehicle specifications by season." actions={<Link href="/admin/cars/new" className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white"><Plus className="size-4" /> New car</Link>} />
      <Suspense><SavedFlash /></Suspense>
      {cars.length === 0 ? <EmptyState title="No cars yet" /> : (
        <DataTable head={<><Th>Car</Th><Th>Season</Th><Th>Specs</Th><Th className="text-right">Actions</Th></>}>
          {cars.map((c) => (
            <tr key={c.id} className="hover:bg-white/3">
              <Td><Link href={`/admin/cars/${c.id}`} className="font-display text-lg font-bold hover:text-accent-2">{c.name}</Link>{c.is_current && <Badge tone="accent" className="ml-2">Current</Badge>}<p className="text-xs text-muted">{c.tagline}</p></Td>
              <Td className="text-muted">{c.season}</Td>
              <Td className="text-muted">{Array.isArray(c.specs) ? c.specs.length : 0} entries</Td>
              <Td className="text-right"><div className="inline-flex gap-2"><Link href={`/admin/cars/${c.id}`} className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-semibold hover:bg-white/6">Edit</Link><DeleteButton action={deleteCar.bind(null, c.id, c.slug)} compact /></div></Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
