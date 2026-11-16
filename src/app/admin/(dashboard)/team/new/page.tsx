import { AdminPageHeader } from "@/features/admin/components/page-header";
import { TeamMemberForm } from "@/features/team/components/team-forms";
export const metadata = { title: "Add team member" };
export default function Page() {
  return (<><AdminPageHeader title="Add team member" backHref="/admin/team" /><TeamMemberForm /></>);
}
