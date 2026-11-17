import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { adminList } from "@/features/admin/queries";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { DataTable, EmptyState, Td, Th } from "@/features/admin/components/data-table";
import { DeleteButton } from "@/features/admin/components/delete-button";
import { SavedFlash } from "@/features/admin/components/flash";
import { CategoryLozenge } from "@/components/shared/category-lozenge";
import { Lozenge } from "@/components/ui/lozenge";
import { deleteArticle } from "@/actions/articles";
import { formatDate } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";

export const metadata = { title: "News" };

export default async function AdminNews() {
  const articles = await adminList("articles", { orderBy: "updated_at" });
  return (
    <>
      <AdminPageHeader title="News" description={`${articles.length} articles`} actions={<Link href="/admin/news/new" className={buttonClass({ appearance: "primary" })}><Plus className="size-4" aria-hidden /> New article</Link>} />
      <Suspense><SavedFlash /></Suspense>
      {articles.length === 0 ? <EmptyState title="No articles yet" hint="Create your first story or run pnpm seed." /> : (
        <DataTable head={<><Th>Title</Th><Th>Category</Th><Th>Status</Th><Th>Published</Th><Th className="text-right">Actions</Th></>}>
          {articles.map((a) => (
            <tr key={a.id}>
              <Td>
                <Link href={`/admin/news/${a.id}`} className="font-medium text-link hover:underline">{a.title}</Link>
                {a.is_featured && <Lozenge appearance="discovery" className="ml-2">Featured</Lozenge>}
                <p className="type-body-small text-subtlest">/news/{a.slug}</p>
              </Td>
              <Td><CategoryLozenge category={a.category} /></Td>
              <Td><Lozenge appearance={a.status === "published" ? "success" : "neutral"}>{a.status}</Lozenge></Td>
              <Td className="text-subtle">{formatDate(a.published_at, { day: "numeric", month: "short", year: "numeric" }) || "—"}</Td>
              <Td className="text-right">
                <div className="inline-flex items-center gap-2">
                  {a.status === "published" && <Link href={`/news/${a.slug}`} target="_blank" className="link text-sm">View</Link>}
                  <Link href={`/admin/news/${a.id}`} className={buttonClass()}>Edit</Link>
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
