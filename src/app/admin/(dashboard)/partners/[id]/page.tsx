import { notFound } from "next/navigation";
import { adminGet } from "@/features/admin/queries";
import { DynamicRoute } from "@/components/shared/dynamic-route";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { PartnerForm } from "@/features/partners/components/partner-form";
export const metadata = { title: "Edit partner" };
export default async function Page({ params }: PageProps<"/admin/partners/[id]">) {
  const { id } = await params;
  const partner = await adminGet("partners", id);
  if (!partner) notFound();
  return (
    <>
      <DynamicRoute /><AdminPageHeader title={partner.name} backHref="/admin/partners" /><PartnerForm partner={partner} /></>);
}
