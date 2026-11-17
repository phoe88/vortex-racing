import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LogoMark } from "@/components/shared/logo";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { siteConfig } from "@/config/site";
import { SectionMessage } from "@/components/ui/section-message";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Team login", robots: { index: false, follow: false } };

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const configured = isSupabaseConfigured();
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-sunken px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <LogoMark className="size-10" />
          <h1 className="type-heading-large mt-3">{siteConfig.name} content studio</h1>
          <p className="mt-1 text-sm text-subtle">Sign in with your team account.</p>
        </div>
        <div className="card p-6">
          {configured ? (
            <Suspense fallback={null}>
              <LoginFormWithNext searchParams={searchParams} />
            </Suspense>
          ) : (
            <SectionMessage appearance="warning" title="Supabase isn&apos;t configured">
              The public site runs on demo content, but the admin area needs a database. Copy <code className="type-code rounded-sm bg-neutral px-1">.env.example</code> to <code className="type-code rounded-sm bg-neutral px-1">.env.local</code>, run the migration and <code className="type-code rounded-sm bg-neutral px-1">pnpm seed</code>.
            </SectionMessage>
          )}
        </div>
        <p className="mt-4 text-center text-sm"><Link href="/" className="link">Back to the website</Link></p>
      </div>
    </div>
  );
}

async function LoginFormWithNext({ searchParams }: { searchParams: PageProps<"/admin/login">["searchParams"] }) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : undefined;
  return <LoginForm next={next} />;
}
