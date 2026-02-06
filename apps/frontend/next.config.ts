import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  
  // 画像最適化設定
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
        pathname: '/assets/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  // パフォーマンス最適化
  compress: true,
  poweredByHeader: false,
  
  // 実験的機能
  experimental: {
    optimizePackageImports: ['highlight.js', 'lucide-react'],
  },
};

export default nextConfig;
