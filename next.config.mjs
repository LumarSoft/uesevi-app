/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: "uesevi.org.ar",
      },
      {
        protocol: 'https',
        hostname: "uesevi.org.ar",
      },
    ],
    unoptimized: true,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/.well-known/:path*",
          destination: "/.well-known/:path*",
        },
      ],
    };
  },
};

export default nextConfig;