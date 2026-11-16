import { AdminPageHeader } from "@/features/admin/components/page-header";
import { CarForm } from "@/features/cars/components/car-form";
export const metadata = { title: "New car" };
export default function Page() {
  return (<><AdminPageHeader title="New car" backHref="/admin/cars" /><CarForm /></>);
}
