"use client";
import Link from "next/link";
import { Suspense, use, useState } from "react";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import { AdminNav } from "./admin-nav";
import { LogoMark } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button, buttonClass } from "@/components/ui/button";
import { Lozenge } from "@/components/ui/lozenge";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import type { SessionUser } from "@/types";

/** Admin frame: side navigation, a compact top bar on small screens, and the page area. */
export function AdminShell({ userPromise, signOutAction, children }: { userPromise: Promise<SessionUser | null>; signOutAction: () => Promise<void>; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const sidebar = (
    <>
      <div className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <LogoMark />
        <div className="min-w-0">
          <p className="type-heading-xsmall truncate">{siteConfig.name}</p>
          <p className="type-body-small text-subtlest">Content studio</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <Suspense fallback={<NavSkeleton />}>
          <NavForUser userPromise={userPromise} onNavigate={() => setOpen(false)} />
        </Suspense>
      </div>
      <div className="border-t p-3">
        <Suspense fallback={<div className="mb-3 h-9" />}>
          <UserChip userPromise={userPromise} />
        </Suspense>
        <div className="flex items-center gap-2">
          <Link href="/" target="_blank" className={buttonClass({ className: "min-w-0 flex-1!" })}>
            <ExternalLink className="size-4" aria-hidden /> View site
          </Link>
          <ThemeToggle />
          <form action={signOutAction}>
            <Button type="submit" appearance="subtle" iconOnly aria-label="Sign out" title="Sign out">
              <LogOut className="size-4" aria-hidden />
            </Button>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-surface lg:flex">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-blanket" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-surface-overlay shadow-overlay">
            <Button appearance="subtle" iconOnly onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-3 top-3">
              <X className="size-4" aria-hidden />
            </Button>
            {sidebar}
          </aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-surface px-4 lg:hidden">
          <Button appearance="subtle" iconOnly onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-4" aria-hidden />
          </Button>
          <LogoMark />
          <span className="type-heading-xsmall">{siteConfig.shortName} admin</span>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-8">
          <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}

function NavForUser({ userPromise, onNavigate }: { userPromise: Promise<SessionUser | null>; onNavigate: () => void }) {
  const user = use(userPromise);
  return <AdminNav role={user?.role ?? "viewer"} onNavigate={onNavigate} />;
}

function UserChip({ userPromise }: { userPromise: Promise<SessionUser | null> }) {
  const user = use(userPromise);
  if (!user) return <div className="mb-3 h-9" />;
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{user.fullName || user.email}</p>
        <p className="type-body-small truncate text-subtlest">{user.email}</p>
      </div>
      <Lozenge appearance={user.role === "admin" ? "discovery" : user.role === "editor" ? "information" : "neutral"} className="capitalize">{user.role}</Lozenge>
    </div>
  );
}

function NavSkeleton() {
  return (
    <div className="space-y-1" aria-hidden>
      {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-8 rounded-md" />)}
    </div>
  );
}

function PageSkeleton() {
  return (
    <div aria-busy="true">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-2 h-4 w-96 max-w-full" />
      <Skeleton className="mt-6 h-72 rounded-lg" />
    </div>
  );
}
