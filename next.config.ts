import type { NextConfig } from 'next';
import { resourcePolicy } from './src/config/resource-policy';
const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: [{ key: 'Content-Security-Policy', value: resourcePolicy }] },
    ];
  },
};
export default config;
