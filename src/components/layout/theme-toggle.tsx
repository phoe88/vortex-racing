"use client";
import { Moon, Sun } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { COLOR_MODE_ATTRIBUTE, COLOR_MODE_STORAGE_KEY, type ColorMode } from "@/lib/theme";

/**
 * Switches the design system colour mode between light and dark and remembers
 * the choice. Both icons are rendered and CSS shows the right one, so the
 * button never mismatches the theme applied before hydration.
 */
export function ThemeToggle({ className }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next: ColorMode = root.getAttribute(COLOR_MODE_ATTRIBUTE) === "dark" ? "light" : "dark";
    root.setAttribute(COLOR_MODE_ATTRIBUTE, next);
    try {
      localStorage.setItem(COLOR_MODE_STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the switch still applies for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      title="Switch theme"
      className={buttonClass({ appearance: "subtle", iconOnly: true, className })}
    >
      <Sun className="hidden size-4 dark:block" aria-hidden />
      <Moon className="size-4 dark:hidden" aria-hidden />
    </button>
  );
}
