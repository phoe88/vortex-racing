import { notFound } from "next/navigation";
import { adminGet } from "@/features/admin/queries";
import { DynamicRoute } from "@/components/shared/dynamic-route";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { TeamMemberForm } from "@/features/team/components/team-forms";
export const metadata = { title: "Edit team member" };
export default async function Page({ params }: PageProps<"/admin/team/[id]">) {
  const { id } = await params;
  const member = await adminGet("team_members", id);
  if (!member) notFound();
  return (
    <>
      <DynamicRoute /><AdminPageHeader title={member.name} backHref="/admin/team" /><TeamMemberForm member={member} /></>);
}
