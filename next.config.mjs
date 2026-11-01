/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@electric-sql/pglite'],
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
