/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@electric-sql/pglite'],
  // Next.js 16 uses Turbopack by default. The Webpack configuration below is
  // retained for the explicit dev:webpack/build:webpack recovery commands.
  turbopack: {
    resolveAlias: {
      // AlaSQL's Node/SSR export references optional native adapters that this
      // web application never uses. Match the existing Webpack exclusions.
      'react-native': './src/lib/compat/emptyOptionalModule.ts',
      'react-native-fs': './src/lib/compat/emptyOptionalModule.ts',
      'react-native-fetch-blob': './src/lib/compat/emptyOptionalModule.ts',
    },
  },
  async headers() {
    return [
      { source: '/:path*', headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Content-Security-Policy', value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'" },
      ] },
      { source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }, { key: 'Vary', value: 'Cookie' }] },
    ];
  },
  webpack: (config, { webpack }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      module: false,
      path: false,
      crypto: false,
      'node:module': false,
      'react-native': false,
      'react-native-fs': false,
      'react-native-fetch-blob': false,
    };

    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native': false,
      'react-native-fs': false,
      'react-native-fetch-blob': false,
    };

    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, '');
      })
    );

    return config;
  },
};

export default nextConfig;
