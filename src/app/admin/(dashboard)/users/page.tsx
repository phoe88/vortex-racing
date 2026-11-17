import { adminList } from "@/features/admin/queries";
import { requireUser } from "@/lib/auth";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { DataTable, Td, Th } from "@/features/admin/components/data-table";
import { RoleSelect } from "@/features/admin/components/role-select";
import { SectionMessage } from "@/components/ui/section-message";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Users & roles" };

export default async function AdminUsers() {
  const me = await requireUser("admin");
  const profiles = await adminList("profiles", { orderBy: "created_at", ascending: true });
  return (
    <>
      <AdminPageHeader title="Users & roles" description="Admins manage everything including roles. Editors manage content. Viewers have no admin access." />
      <SectionMessage className="mb-4">
        New accounts are created in the Supabase dashboard (Authentication → Users) or via invite email. They appear here as <em>viewer</em> until promoted.
      </SectionMessage>
      <DataTable head={<><Th>User</Th><Th>Joined</Th><Th className="text-right">Role</Th></>}>
        {profiles.map((p) => (
          <tr key={p.id}>
            <Td><p className="font-medium">{p.full_name || "—"}</p><p className="type-body-small text-subtlest">{p.email}{p.id === me.id && " (you)"}</p></Td>
            <Td className="text-subtle">{formatDate(p.created_at, { day: "numeric", month: "short", year: "numeric" })}</Td>
            <Td className="text-right"><RoleSelect userId={p.id} role={p.role} disabled={p.id === me.id} /></Td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
