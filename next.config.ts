import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: no server, no data leaves the device.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // Keep production builds out of the dev server's .next folder so running
  // `npm run build` never breaks a running `npm run dev`.
  distDir: process.env.NODE_ENV === "production" ? ".next-build" : ".next",
};

export default nextConfig;
