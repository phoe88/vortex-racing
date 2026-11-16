import { notFound } from "next/navigation";
import { adminGet } from "@/features/admin/queries";
import { DynamicRoute } from "@/components/shared/dynamic-route";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { DriverForm } from "@/features/drivers/components/driver-form";
export const metadata = { title: "Edit driver" };
export default async function Page({ params }: PageProps<"/admin/drivers/[id]">) {
  const { id } = await params;
  const driver = await adminGet("drivers", id);
  if (!driver) notFound();
  return (
    <>
      <DynamicRoute /><AdminPageHeader title={`${driver.first_name} ${driver.last_name}`} backHref="/admin/drivers" /><DriverForm driver={driver} /></>);
}
