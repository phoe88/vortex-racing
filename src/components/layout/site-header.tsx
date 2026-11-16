"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/shared/logo";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  // Close the mobile menu on navigation (state adjusted during render, not in an effect).
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open ? "bg-night/85 backdrop-blur-xl shadow-[0_1px_0_var(--line)]" : "bg-transparent",
      )}
    >
      <div className="container-x flex h-18 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {siteConfig.nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative rounded-full px-4 py-2 font-display text-[15px] font-semibold uppercase tracking-[0.14em] transition-colors",
                      active ? "text-white" : "text-ice/75 hover:text-white",
                    )}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-accent"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/newsletter" size="sm" className="hidden sm:inline-flex">
            <Mail className="size-4" /> Newsletter
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-4 font-display text-sm font-semibold uppercase tracking-[0.14em] hover:bg-white/8 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="hidden sm:inline">Menu</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-18 bottom-0 overflow-y-auto border-t border-line bg-night/95 backdrop-blur-xl lg:hidden"
          >
            <nav aria-label="Mobile" className="container-x py-8">
              <ul className="space-y-1">
                {siteConfig.nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center justify-between border-b border-line py-4 font-display text-4xl font-bold uppercase tracking-tight hover:text-accent-2"
                    >
                      {item.label}
                      <span className="font-mono text-xs text-muted">0{i + 1}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3">
                <ButtonLink href="/newsletter" size="lg"><Mail className="size-4" /> Join the newsletter</ButtonLink>
                <ButtonLink href="/admin" variant="outline" size="lg">Team login</ButtonLink>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
