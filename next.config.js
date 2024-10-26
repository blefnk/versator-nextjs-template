/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

import createMDX from "@next/mdx";

/** @type {import("next").NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
    unoptimized: true,
  },
  // Already doing linting and typechecking as separate tasks in CI
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
