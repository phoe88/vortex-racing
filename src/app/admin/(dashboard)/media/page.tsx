import { adminList } from "@/features/admin/queries";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { MediaManager } from "@/features/media/components/media-manager";

export const metadata = { title: "Media" };

export default async function AdminMedia() {
  const items = await adminList("media", { orderBy: "created_at", limit: 500 });
  return (
    <>
      <AdminPageHeader title="Media library" description={`${items.length} files in Supabase Storage. Uploads go straight from your browser to the bucket.`} />
      <MediaManager items={items} />
    </>
  );
}
