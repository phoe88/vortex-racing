import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { DEFAULT_COLOR_MODE, SURFACE_COLOR } from "@/lib/theme";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: SURFACE_COLOR[DEFAULT_COLOR_MODE],
    theme_color: SURFACE_COLOR[DEFAULT_COLOR_MODE],
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
