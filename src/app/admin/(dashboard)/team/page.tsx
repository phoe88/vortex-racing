import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { adminList, adminGet } from "@/features/admin/queries";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { DataTable, EmptyState, Td, Th } from "@/features/admin/components/data-table";
import { DeleteButton } from "@/features/admin/components/delete-button";
import { SavedFlash } from "@/features/admin/components/flash";
import { TeamAboutForm } from "@/features/team/components/team-forms";
import { deleteTeamMember } from "@/actions/drivers";
import { seed } from "@/lib/seed/data";
import type { TeamAbout } from "@/features/team/queries";

export const metadata = { title: "Team" };

export default async function AdminTeam() {
  const [members, aboutRow] = await Promise.all([
    adminList("team_members", { orderBy: "sort_order", ascending: true }),
    adminGet("site_settings", "team_about"),
  ]);
  const about = (aboutRow?.value as unknown as TeamAbout | undefined) ?? (seed.siteSettings[0].value as unknown as TeamAbout);
  return (
    <>
      <AdminPageHeader title="Team & about" description="Leadership profiles and the team page introduction." actions={<Link href="/admin/team/new" className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white"><Plus className="size-4" /> Add member</Link>} />
      <Suspense><SavedFlash /></Suspense>
      {members.length === 0 ? <EmptyState title="No team members yet" /> : (
        <DataTable head={<><Th>Name</Th><Th>Title</Th><Th>Order</Th><Th className="text-right">Actions</Th></>}>
          {members.map((m) => (
            <tr key={m.id} className="hover:bg-white/3">
              <Td><Link href={`/admin/team/${m.id}`} className="font-semibold hover:text-accent-2">{m.name}</Link>{!m.is_active && <span className="ml-2 text-xs text-muted">(hidden)</span>}</Td>
              <Td className="text-muted">{m.role_title}</Td>
              <Td className="text-muted">{m.sort_order}</Td>
              <Td className="text-right"><div className="inline-flex gap-2"><Link href={`/admin/team/${m.id}`} className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-semibold hover:bg-white/6">Edit</Link><DeleteButton action={deleteTeamMember.bind(null, m.id)} compact /></div></Td>
            </tr>
          ))}
        </DataTable>
      )}
      <div className="mt-10"><TeamAboutForm about={about} /></div>
    </>
  );
}
