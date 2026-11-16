import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#060b1a",
    theme_color: "#060b1a",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
