import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'clasicoshispanicos.com'
      },
      {
        protocol: 'https',
        hostname: 's3-alpha-sig.figma.com'
      } 
    ]
  },
};

export default nextConfig;
