import type { NextConfig } from "next";

const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Fewer build workers keeps memory in check on small CI machines.
    cpus: 4,
    // Vercel restores `.next/cache` between deployments. Turbopack's on-disk build
    // cache then reused a stale `globals.css` after the stylesheet changed, shipping
    // new markup with old CSS. Builds take a few seconds longer without it and are
    // always compiled from the committed sources.
    turbopackFileSystemCacheForBuild: false,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [
      // Supabase Storage public buckets (this project's host first, then any Supabase project)
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Demo seed imagery
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  cacheLife: {
    // Public content: refreshed in the background hourly, served stale for up to a day
    content: {
      stale: 60 * 5,
      revalidate: 60 * 60,
      expire: 60 * 60 * 24,
    },
    // Live-ish data such as standings and the race countdown
    live: {
      stale: 60,
      revalidate: 60 * 5,
      expire: 60 * 60,
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
