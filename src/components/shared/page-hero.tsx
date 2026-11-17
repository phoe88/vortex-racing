import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Page header. With an image it is a full-bleed photo with the title set huge
 * at the bottom; without one it is a large title block clear of the header.
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
      {eyebrow && <p className="type-heading-xxsmall mb-3 text-subtle">{eyebrow}</p>}
      <h1 className={cn("max-w-5xl text-balance", image ? "type-display-xl" : "type-display")}>{title}</h1>
      {description && <p className="type-body-large mt-5 max-w-2xl text-subtle">{description}</p>}
      {children}
    </>
  );

  if (!image) {
    return <section className={cn("container-x pb-10 pt-36 sm:pb-14 sm:pt-44", className)}>{content}</section>;
  }

  return (
    <section
      className={cn(
        "relative isolate flex flex-col justify-end overflow-hidden pb-12 pt-40 sm:pb-16",
        size === "lg" ? "min-h-[92vh]" : "min-h-[70vh]",
        className,
      )}
    >
      <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
      <div className="media-scrim-soft absolute inset-0 -z-10" />
      <div className="container-x">{content}</div>
    </section>
  );
}
