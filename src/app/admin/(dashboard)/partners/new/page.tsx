import { AdminPageHeader } from "@/features/admin/components/page-header";
import { PartnerForm } from "@/features/partners/components/partner-form";
export const metadata = { title: "Add partner" };
export default function Page() {
  return (<><AdminPageHeader title="Add partner" backHref="/admin/partners" /><PartnerForm /></>);
}
