/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true
  },
  transpilePackages: ["@relayforge/shared"]
};

export default nextConfig;

