import Image from "next/image";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  children,
  className,
  size = "md",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string | null;
  children?: React.ReactNode;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <section className={cn("relative isolate overflow-hidden", size === "lg" ? "pt-40 pb-20 sm:pt-48 sm:pb-28" : "pt-36 pb-14 sm:pt-44 sm:pb-20", className)}>
      {image ? (
        <>
          <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-night/70 via-night/60 to-night" />
        </>
      ) : (
        <div className="grid-fade absolute inset-0 -z-10" aria-hidden />
      )}
      <div className="container-x">
        {eyebrow && <p className="eyebrow mb-4 text-accent">{eyebrow}</p>}
        <h1 className="display max-w-4xl text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">{title}</h1>
        {description && <p className="mt-6 max-w-2xl text-lg text-ice/80">{description}</p>}
        {children}
      </div>
    </section>
  );
}
