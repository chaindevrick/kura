import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // ✅ Standalone output: Create a self-contained build without node_modules
  // Perfect for Docker/Cloud Run deployment
  output: 'standalone',
  
  /* config options here */
  // ✅ HTTPS handling:
  // - Development: npm run dev uses --experimental-https flag (see package.json)
  // - Production: Firebase Hosting provides HTTPS (app runs on HTTP)
  turbopack: {
    root: path.join(__dirname),
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'fullscreen=*',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "http",
        hostname: "googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com", // 💡 換成 Google Favicon API 網域      
      },
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
      },
    ],
  },
};

export default nextConfig;
