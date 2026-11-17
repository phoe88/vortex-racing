import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="container-x flex min-h-[60vh] flex-1 flex-col items-start justify-center py-12">
        <p className="type-heading-xxsmall text-subtlest">404</p>
        <h1 className="type-heading-xxlarge mt-1">Off track</h1>
        <p className="type-body-large mt-2 max-w-md text-subtle">The page you&apos;re looking for has gone wide at Turn 1. Let&apos;s get you back on the racing line.</p>
        <div className="mt-4 flex gap-2">
          <ButtonLink href="/" appearance="primary">Home</ButtonLink>
          <ButtonLink href="/news">Latest news</ButtonLink>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
