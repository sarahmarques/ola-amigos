import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: no server, no data leaves the device.
  // `npm run build` exports it to `out/`, which is what Netlify publishes.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
