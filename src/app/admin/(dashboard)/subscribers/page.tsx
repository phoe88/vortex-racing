import { Download } from "lucide-react";
import { adminList } from "@/features/admin/queries";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { DataTable, EmptyState, Td, Th } from "@/features/admin/components/data-table";
import { SubscriberActions } from "@/features/newsletter/components/subscriber-actions";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Subscribers" };

export default async function AdminSubscribers() {
  const subs = await adminList("newsletter_subscribers", { orderBy: "created_at", limit: 2000 });
  const active = subs.filter((s) => s.status === "subscribed").length;
  return (
    <>
      <AdminPageHeader
        title="Newsletter subscribers"
        description={`${active} active · ${subs.length - active} unsubscribed`}
        actions={<a href="/api/admin/subscribers/export" className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-xs font-semibold uppercase tracking-[0.12em] hover:bg-white/6"><Download className="size-4" /> Export CSV</a>}
      />
      {subs.length === 0 ? <EmptyState title="No subscribers yet" hint="Sign-ups from the website appear here." /> : (
        <DataTable head={<><Th>Email</Th><Th>Status</Th><Th>Source</Th><Th>Joined</Th><Th className="text-right">Actions</Th></>}>
          {subs.map((s) => (
            <tr key={s.id} className="hover:bg-white/3">
              <Td className="font-medium">{s.email}</Td>
              <Td><Badge tone={s.status === "subscribed" ? "success" : "muted"}>{s.status}</Badge></Td>
              <Td className="text-muted">{s.source}</Td>
              <Td className="text-muted">{formatDate(s.created_at, { day: "numeric", month: "short", year: "numeric" })}</Td>
              <Td className="text-right"><SubscriberActions id={s.id} status={s.status} /></Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
