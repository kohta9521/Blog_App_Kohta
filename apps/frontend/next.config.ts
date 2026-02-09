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
  
  // セキュリティ & SEO ヘッダー設定
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // セキュリティヘッダー
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' https://images.microcms-assets.io https://www.googletagmanager.com https://www.google-analytics.com data: blob:",
              "font-src 'self' https://fonts.gstatic.com data:",
              "connect-src 'self' https://*.microcms.io https://www.google-analytics.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
              "frame-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
    ];
  },
  
  // 実験的機能
  experimental: {
    optimizePackageImports: ['highlight.js', 'lucide-react'],
  },
};

export default nextConfig;
