import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { buttonClass } from "@/components/ui/button";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a href="#main" className={buttonClass({ appearance: "primary", className: "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60]" })}>
        Skip to content
      </a>
      <div id="top" />
      <SiteHeader />
      <main id="main" className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
