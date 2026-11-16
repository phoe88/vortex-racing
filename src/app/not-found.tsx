import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="container-x flex min-h-[70vh] flex-col items-start justify-center pt-24">
        <p className="eyebrow text-accent">404</p>
        <h1 className="display mt-3 text-6xl sm:text-8xl">Off track</h1>
        <p className="mt-4 max-w-md text-muted">The page you&apos;re looking for has gone wide at Turn 1. Let&apos;s get you back on the racing line.</p>
        <div className="mt-8 flex gap-3">
          <ButtonLink href="/">Home</ButtonLink>
          <ButtonLink href="/news" variant="outline">Latest news</ButtonLink>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
