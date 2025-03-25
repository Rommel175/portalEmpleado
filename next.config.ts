import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['s3-alpha-sig.figma.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'clasicoshispanicos.com'
      }
    ]
  },
};

export default nextConfig;
