import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/account', destination: '/account/profile', permanent: true },
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jemypvfnlazkrvrmzcaz.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
