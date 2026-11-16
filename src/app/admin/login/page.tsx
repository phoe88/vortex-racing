import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LogoMark } from "@/components/shared/logo";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { siteConfig } from "@/config/site";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Team login", robots: { index: false, follow: false } };

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const configured = isSupabaseConfigured();
  return (
    <div className="grid-fade flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoMark className="size-12" />
          <h1 className="display mt-4 text-3xl">{siteConfig.shortName} Content Studio</h1>
          <p className="mt-1 text-sm text-muted">Sign in with your team account.</p>
        </div>
        <div className="card p-6">
          {configured ? (
            <Suspense fallback={null}>
              <LoginFormWithNext searchParams={searchParams} />
            </Suspense>
          ) : (
            <div className="space-y-3 text-sm text-muted">
              <p className="font-semibold text-ice">Supabase isn&apos;t configured.</p>
              <p>The public site runs on demo content, but the admin area needs a database. Copy <code className="rounded bg-white/10 px-1">.env.example</code> to <code className="rounded bg-white/10 px-1">.env.local</code>, run the migration and <code className="rounded bg-white/10 px-1">pnpm seed</code>.</p>
            </div>
          )}
        </div>
        <p className="mt-6 text-center text-xs text-muted"><Link href="/" className="hover:text-ice">← Back to the website</Link></p>
      </div>
    </div>
  );
}

async function LoginFormWithNext({ searchParams }: { searchParams: PageProps<"/admin/login">["searchParams"] }) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : undefined;
  return <LoginForm next={next} />;
}
