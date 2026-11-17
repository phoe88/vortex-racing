"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/shared/logo";
import { Button, ButtonLink, buttonClass } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

/** Top navigation bar: product mark, primary navigation and global actions. */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  // Close the mobile menu on navigation (state adjusted during render, not in an effect).
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 border-b bg-surface">
      <div className="container-x flex h-14 items-center gap-4">
        <Logo />

        <nav aria-label="Primary" className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-1">
            {siteConfig.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={buttonClass({ appearance: "subtle", isSelected: active })}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <ButtonLink href="/newsletter" appearance="primary" className="max-sm:hidden">
            <Mail className="size-4" aria-hidden /> Newsletter
          </ButtonLink>
          <Button
            appearance="subtle"
            iconOnly
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="lg:hidden"
          >
            {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
          </Button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-14 overflow-y-auto border-t bg-surface lg:hidden">
          <nav aria-label="Mobile" className="container-x py-4">
            <ul className="space-y-1">
              {siteConfig.nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-10 items-center rounded-md px-3 text-sm font-medium transition-colors",
                        active ? "bg-selected text-selected" : "text-subtle hover:bg-neutral-subtle-hovered active:bg-neutral-subtle-pressed",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex flex-col gap-2 border-t pt-4">
              <ButtonLink href="/newsletter" appearance="primary" shouldFitContainer>
                <Mail className="size-4" aria-hidden /> Join the newsletter
              </ButtonLink>
              <ButtonLink href="/admin" shouldFitContainer>Team login</ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
