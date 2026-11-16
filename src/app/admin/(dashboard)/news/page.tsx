import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { adminList } from "@/features/admin/queries";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { DataTable, EmptyState, Td, Th } from "@/features/admin/components/data-table";
import { DeleteButton } from "@/features/admin/components/delete-button";
import { SavedFlash } from "@/features/admin/components/flash";
import { Badge, CATEGORY_LABEL } from "@/components/ui/badge";
import { deleteArticle } from "@/actions/articles";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "News" };

export default async function AdminNews() {
  const articles = await adminList("articles", { orderBy: "updated_at" });
  return (
    <>
      <AdminPageHeader title="News" description={`${articles.length} articles`} actions={<Link href="/admin/news/new" className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white"><Plus className="size-4" /> New article</Link>} />
      <Suspense><SavedFlash /></Suspense>
      {articles.length === 0 ? <EmptyState title="No articles yet" hint="Create your first story or run pnpm seed." /> : (
        <DataTable head={<><Th>Title</Th><Th>Category</Th><Th>Status</Th><Th>Published</Th><Th className="text-right">Actions</Th></>}>
          {articles.map((a) => (
            <tr key={a.id} className="hover:bg-white/3">
              <Td>
                <Link href={`/admin/news/${a.id}`} className="font-semibold hover:text-accent-2">{a.title}</Link>
                {a.is_featured && <Badge tone="yellow" className="ml-2">Featured</Badge>}
                <p className="text-xs text-muted">/news/{a.slug}</p>
              </Td>
              <Td className="text-muted">{CATEGORY_LABEL[a.category]}</Td>
              <Td><Badge tone={a.status === "published" ? "success" : "muted"}>{a.status}</Badge></Td>
              <Td className="text-muted">{formatDate(a.published_at, { day: "numeric", month: "short", year: "numeric" }) || "—"}</Td>
              <Td className="text-right">
                <div className="inline-flex items-center gap-2">
                  {a.status === "published" && <Link href={`/news/${a.slug}`} target="_blank" className="text-xs text-muted hover:text-ice">View</Link>}
                  <Link href={`/admin/news/${a.id}`} className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-semibold hover:bg-white/6">Edit</Link>
                  <DeleteButton action={deleteArticle.bind(null, a.id, a.slug)} compact />
                </div>
              </Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
