"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/shared/logo";
import { InstagramIcon, XIcon, YoutubeIcon } from "@/components/shared/social-icons";
import { Button, buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const headerLinks = [...siteConfig.nav.filter((n) => n.href !== "/partners"), { label: "Newsletter", href: "/newsletter" }];
const menuLinks = [...siteConfig.nav, { label: "Newsletter", href: "/newsletter" }, { label: "Team login", href: "/admin" }];

/**
 * Top navigation. It floats over the page: transparent at the top, a frosted
 * bar once the page scrolls. "Menu" opens a full-screen list of every section.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  // Close the menu on navigation (state adjusted during render, not in an effect).
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-300",
          scrolled ? "bg-white/20 backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <div className="flex h-[4.875rem] items-center justify-between gap-4 px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center">
                {headerLinks.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className="inline-flex h-10 items-center rounded-full px-3 font-medium transition-opacity hover:opacity-70"
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <Button onClick={() => setOpen(true)} aria-expanded={open} aria-controls="site-menu" className="ml-2">
              <Menu className="size-4" aria-hidden /> Menu
            </Button>
          </div>
        </div>
      </header>

      {open && (
        <div id="site-menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-navy/85 backdrop-blur-2xl">
          <div className="flex h-[4.875rem] shrink-0 items-center px-4 sm:px-6">
            <Button onClick={() => setOpen(false)} autoFocus>
              <X className="size-4" aria-hidden /> Close
            </Button>
          </div>
          <nav aria-label="All sections" className="flex-1 px-4 py-8 sm:px-6 lg:py-12">
            <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-8">
              {menuLinks.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "type-heading-xxlarge inline-block font-extrabold transition-colors hover:text-default",
                        active ? "text-default" : "text-subtle",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex items-center gap-2 px-4 pb-8 sm:px-6">
            {[
              { href: siteConfig.social.x, label: "X", Icon: XIcon },
              { href: siteConfig.social.instagram, label: "Instagram", Icon: InstagramIcon },
              { href: siteConfig.social.youtube, label: "YouTube", Icon: YoutubeIcon },
            ].map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={buttonClass({ iconOnly: true })}>
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
