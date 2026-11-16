import { AdminPageHeader } from "@/features/admin/components/page-header";
import { RaceForm } from "@/features/races/components/race-form";
export const metadata = { title: "New race" };
export default function Page() {
  return (<><AdminPageHeader title="New race" backHref="/admin/races" /><RaceForm /></>);
}
