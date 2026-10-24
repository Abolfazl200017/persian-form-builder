import type { NextConfig } from 'next';
import { resourcePolicy } from './src/config/resource-policy';
const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      '*.wasm': {
        // FormEngine's FastQR initializes WebAssembly from a bundled URL.
        condition: { query: /[?&]url(?=&|$)/ },
        type: 'asset',
      },
    },
  },
  async headers() {
    return [
      { source: '/:path*', headers: [{ key: 'Content-Security-Policy', value: resourcePolicy }] },
    ];
  },
};
export default config;
