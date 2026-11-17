import Image from "next/image";
import { darkSubtree } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * Page header. Without an image it is a plain title block; with one, the title
 * sits on a banner that is always rendered in the dark theme so it stays
 * legible over the photograph.
 */
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
  const content = (
    <>
      {eyebrow && <p className="type-heading-xxsmall mb-1 text-subtlest">{eyebrow}</p>}
      <h1 className="type-heading-xlarge sm:type-heading-xxlarge max-w-3xl text-balance">{title}</h1>
      {description && <p className="type-body-large mt-2 max-w-2xl text-subtle">{description}</p>}
      {children}
    </>
  );

  if (!image) {
    return (
      <section className={cn("container-x pb-6 pt-8 sm:pt-10", className)}>{content}</section>
    );
  }

  return (
    <section className={cn("container-x pb-6 pt-4 sm:pt-6", className)}>
      <div
        {...darkSubtree}
        className={cn(
          "relative isolate flex flex-col justify-end overflow-hidden rounded-xl bg-surface-sunken p-4 text-default sm:p-8",
          size === "lg" ? "min-h-80 sm:min-h-[26rem]" : "min-h-64 sm:min-h-80",
        )}
      >
        <Image src={image} alt="" fill priority sizes="(min-width: 1280px) 1216px, 100vw" className="-z-20 object-cover" />
        <div className="media-scrim-soft absolute inset-0 -z-10" />
        {content}
      </div>
    </section>
  );
}
