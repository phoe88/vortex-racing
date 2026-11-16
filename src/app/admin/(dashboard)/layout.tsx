import type { Metadata } from "next";
import { Suspense } from "react";
import { getSessionUser, requireUser } from "@/lib/auth";
import { signOut } from "@/actions/auth";
import { AdminShell } from "@/features/admin/components/admin-shell";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

/**
 * The guard and the page render in parallel: <Guard /> redirects anyone who
 * isn't signed in as editor/admin, while the shell receives the user as a
 * promise so navigation and page content can stream without waiting on it.
 * Data access on every admin page is additionally protected by RLS and by
 * `authorize()` in each server action.
 */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <Suspense fallback={null}>
        <Guard />
      </Suspense>
      <AdminShell userPromise={getSessionUser()} signOutAction={signOut}>
        {children}
      </AdminShell>
    </>
  );
}

async function Guard() {
  await requireUser("editor");
  return null;
}
