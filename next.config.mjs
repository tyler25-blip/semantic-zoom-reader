/** @type {import('next').NextConfig} */
const isProd = process.env.GITHUB_ACTIONS === "true";
const basePath = isProd ? "/semantic-zoom-reader" : "";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  images: { unoptimized: true },
  env: {
    // exposed to client code so image / PDF paths can prefix themselves
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
