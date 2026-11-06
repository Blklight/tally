import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  output: "export",
  // O showcase (`src/app/components/page.dev.tsx`) só existe no `next dev`.
  pageExtensions: isDev ? ["dev.tsx", "tsx", "ts"] : ["tsx", "ts"],
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
