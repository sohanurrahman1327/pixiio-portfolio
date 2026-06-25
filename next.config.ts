import type { NextConfig } from "next";
import os from "node:os";
import path from "path";

function getLocalDevOrigins() {
  const origins = new Set<string>();

  try {
    for (const interfaces of Object.values(os.networkInterfaces())) {
      for (const iface of interfaces ?? []) {
        if (iface.family !== "IPv4" || iface.internal) continue;
        origins.add(iface.address);
      }
    }
  } catch {
    // networkInterfaces can fail in restricted environments
  }

  return [...origins];
}

const nextConfig: NextConfig = {
  allowedDevOrigins: getLocalDevOrigins(),
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default nextConfig;
