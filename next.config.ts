import type { NextConfig } from "next";

// When deploying to GitHub Pages at https://<username>.github.io/<repo-name>,
// NEXT_PUBLIC_BASE_PATH can be passed as the repository name.
const repoName = process.env.NEXT_PUBLIC_BASE_PATH || "";
const basePath = repoName ? `/${repoName.replace(/^\/+|\/+$/g, "")}` : undefined;

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
