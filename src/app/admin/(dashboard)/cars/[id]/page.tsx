import { notFound } from "next/navigation";
import { adminGet } from "@/features/admin/queries";
import { DynamicRoute } from "@/components/shared/dynamic-route";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { CarForm } from "@/features/cars/components/car-form";
export const metadata = { title: "Edit car" };
export default async function Page({ params }: PageProps<"/admin/cars/[id]">) {
  const { id } = await params;
  const car = await adminGet("cars", id);
  if (!car) notFound();
  return (
    <>
      <DynamicRoute /><AdminPageHeader title={car.name} backHref="/admin/cars" /><CarForm car={car as never} /></>);
}
