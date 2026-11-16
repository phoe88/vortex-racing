import Link from "next/link";
import { signOut } from "@/actions/auth";

export const metadata = { title: "Access restricted", robots: { index: false } };

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card max-w-md p-8 text-center">
        <p className="eyebrow text-accent">403</p>
        <h1 className="display mt-2 text-4xl">Access restricted</h1>
        <p className="mt-3 text-sm text-muted">Your account is signed in but doesn&apos;t have an editor or admin role yet. Ask an administrator to grant access from <em>Users &amp; roles</em>.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold hover:bg-white/6">Website</Link>
          <form action={signOut}><button className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white">Sign out</button></form>
        </div>
      </div>
    </div>
  );
}
