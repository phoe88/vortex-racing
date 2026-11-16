import { AdminPageHeader } from "@/features/admin/components/page-header";
import { DriverForm } from "@/features/drivers/components/driver-form";
export const metadata = { title: "New driver" };
export default function Page() {
  return (<><AdminPageHeader title="New driver" backHref="/admin/drivers" /><DriverForm /></>);
}
