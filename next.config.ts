import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // 성능 최적화
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // 빌드 최적화 (swcMinify는 Next.js 15에서 기본값이므로 제거)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 압축 최적화
  compress: true,
  // 정적 생성 최적화
  output: 'standalone',
};

export default nextConfig;
