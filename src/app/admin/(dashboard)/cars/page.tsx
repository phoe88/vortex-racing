import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { adminList } from "@/features/admin/queries";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { DataTable, EmptyState, Td, Th } from "@/features/admin/components/data-table";
import { DeleteButton } from "@/features/admin/components/delete-button";
import { SavedFlash } from "@/features/admin/components/flash";
import { Lozenge } from "@/components/ui/lozenge";
import { deleteCar } from "@/actions/cars";
import { buttonClass } from "@/components/ui/button";

export const metadata = { title: "Cars" };

export default async function AdminCars() {
  const cars = await adminList("cars", { orderBy: "season" });
  return (
    <>
      <AdminPageHeader title="Cars" description="Vehicle specifications by season." actions={<Link href="/admin/cars/new" className={buttonClass({ appearance: "primary" })}><Plus className="size-4" aria-hidden /> New car</Link>} />
      <Suspense><SavedFlash /></Suspense>
      {cars.length === 0 ? <EmptyState title="No cars yet" /> : (
        <DataTable head={<><Th>Car</Th><Th>Season</Th><Th>Specs</Th><Th className="text-right">Actions</Th></>}>
          {cars.map((c) => (
            <tr key={c.id}>
              <Td><Link href={`/admin/cars/${c.id}`} className="font-medium text-link hover:underline">{c.name}</Link>{c.is_current && <Lozenge appearance="information" className="ml-2">Current</Lozenge>}<p className="type-body-small text-subtlest">{c.tagline}</p></Td>
              <Td className="text-subtle">{c.season}</Td>
              <Td className="text-subtle">{Array.isArray(c.specs) ? c.specs.length : 0} entries</Td>
              <Td className="text-right"><div className="inline-flex gap-2"><Link href={`/admin/cars/${c.id}`} className={buttonClass()}>Edit</Link><DeleteButton action={deleteCar.bind(null, c.id, c.slug)} compact /></div></Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
