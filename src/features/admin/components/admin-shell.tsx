"use client";
import Link from "next/link";
import { Suspense, use, useState } from "react";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import { AdminNav } from "./admin-nav";
import { LogoMark } from "@/components/shared/logo";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import type { SessionUser } from "@/types";

export function AdminShell({ userPromise, signOutAction, children }: { userPromise: Promise<SessionUser | null>; signOutAction: () => Promise<void>; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const sidebar = (
    <>
      <div className="flex items-center gap-2.5 px-3 py-4">
        <LogoMark className="size-8" />
        <div className="leading-tight">
          <p className="font-display text-lg font-extrabold uppercase italic">{siteConfig.shortName} Admin</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Content studio</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <Suspense fallback={<NavSkeleton />}>
          <NavForUser userPromise={userPromise} onNavigate={() => setOpen(false)} />
        </Suspense>
      </div>
      <div className="border-t border-line p-3">
        <Suspense fallback={<div className="mb-3 h-10" />}>
          <UserChip userPromise={userPromise} />
        </Suspense>
        <div className="flex gap-2">
          <Link href="/" target="_blank" className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/12 px-3 py-2 text-xs font-semibold hover:bg-white/6">
            <ExternalLink className="size-3.5" /> View site
          </Link>
          <form action={signOutAction}>
            <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 px-3 py-2 text-xs font-semibold hover:bg-white/6">
              <LogOut className="size-3.5" /> Sign out
            </button>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-night">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-navy/40 lg:flex">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-line bg-navy">
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute right-3 top-4 rounded-lg p-1 hover:bg-white/10"><X className="size-5" /></button>
            {sidebar}
          </aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-line bg-night/80 px-4 backdrop-blur lg:hidden">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-lg p-1.5 hover:bg-white/10"><Menu className="size-5" /></button>
          <span className="font-display text-base font-bold uppercase">{siteConfig.shortName} Admin</span>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
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
  if (!user) return <div className="mb-3 h-10" />;
  return (
    <div className="mb-3 flex items-center justify-between gap-2 px-1">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{user.fullName || user.email}</p>
        <p className="truncate text-xs text-muted">{user.email}</p>
      </div>
      <Badge tone={user.role === "admin" ? "accent" : "muted"}>{user.role}</Badge>
    </div>
  );
}

function NavSkeleton() {
  return (
    <div className="space-y-1.5 px-1 py-1" aria-hidden>
      {Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-8 animate-pulse rounded-lg bg-white/5" />)}
    </div>
  );
}

function PageSkeleton() {
  return (
    <div aria-busy="true">
      <div className="h-9 w-64 animate-pulse rounded-lg bg-white/6" />
      <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-white/5" />
      <div className="mt-8 h-72 animate-pulse rounded-xl bg-white/4" />
    </div>
  );
}
