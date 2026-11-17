import { cn } from "@/lib/utils";

/** A tilted red band with a word repeated across it in heavy italic capitals. */
export function TextBanner({ text, className }: { text: string; className?: string }) {
  const words = Array.from({ length: 6 }, () => text);
  return (
    <div className={cn("overflow-hidden py-10", className)} aria-hidden>
      <div className="-mx-8 -rotate-2 bg-red py-3 sm:py-5">
        <p className="flex w-max gap-10 whitespace-nowrap text-[clamp(2.5rem,8vw,6.5rem)] font-extrabold uppercase italic leading-none text-navy">
          {words.map((w, i) => <span key={i}>{w}</span>)}
        </p>
      </div>
    </div>
  );
}
