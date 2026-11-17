import Link from "next/link";
import { notFound } from "next/navigation";
import { adminGet } from "@/features/admin/queries";
import { DynamicRoute } from "@/components/shared/dynamic-route";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { RaceForm } from "@/features/races/components/race-form";
import { buttonClass } from "@/components/ui/button";
export const metadata = { title: "Edit race" };
export default async function Page({ params }: PageProps<"/admin/races/[id]">) {
  const { id } = await params;
  const race = await adminGet("races", id);
  if (!race) notFound();
  return (
    <>
      <DynamicRoute />
      <AdminPageHeader title={race.name} description={`Round ${race.round} · ${race.season}`} backHref="/admin/races" actions={<Link href={`/admin/races/${race.id}/results`} className={buttonClass()}>Edit results</Link>} />
      <RaceForm race={race as never} />
    </>
  );
}
