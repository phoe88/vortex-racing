import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, Sparkles, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/** A tinted panel with a status icon that tells people about something on the page. */
export type SectionMessageAppearance = "information" | "success" | "warning" | "error" | "discovery";

const styles: Record<SectionMessageAppearance, { box: string; icon: string; Icon: typeof Info }> = {
  information: { box: "bg-information", icon: "text-icon-information", Icon: Info },
  success: { box: "bg-success", icon: "text-icon-success", Icon: CircleCheck },
  warning: { box: "bg-warning", icon: "text-icon-warning", Icon: TriangleAlert },
  error: { box: "bg-danger", icon: "text-icon-danger", Icon: CircleAlert },
  discovery: { box: "bg-discovery", icon: "text-icon-discovery", Icon: Sparkles },
};

export function SectionMessage({
  appearance = "information",
  title,
  children,
  className,
}: {
  appearance?: SectionMessageAppearance;
  title?: string;
  children?: ReactNode;
  className?: string;
}) {
  const { box, icon, Icon } = styles[appearance];
  return (
    <div role={appearance === "error" ? "alert" : "status"} className={cn("flex gap-3 rounded-lg p-4 text-default", box, className)}>
      <Icon className={cn("mt-0.5 size-5 shrink-0", icon)} aria-hidden />
      <div className="min-w-0 flex-1 space-y-1">
        {title && <p className="type-heading-xsmall">{title}</p>}
        {children && <div className="break-words">{children}</div>}
      </div>
    </div>
  );
}
