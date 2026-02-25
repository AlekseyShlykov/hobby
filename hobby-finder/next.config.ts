import type { NextConfig } from "next";

const basePath = process.env.BASE_PATH ?? '';
const assetPrefix = (process.env.ASSET_PREFIX ?? basePath) || undefined;
const isStaticExport = Boolean(basePath);

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const } : {}),
  basePath: basePath || undefined,
  assetPrefix: assetPrefix ? (assetPrefix.startsWith('http') ? assetPrefix : undefined) : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
