/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/dev-blog', // no longer needed if using custom domain
  images: { unoptimized: true },
  trailingSlash: true,
  webpack: (config, options) => {
    // SVGs imported from code become React components; Next's own metadata loader
    // (app/icon*.svg, ?__next_metadata__) must still receive the raw file.
    config.module.rules.push({
      test: /\.svg$/,
      resourceQuery: { not: [/__next_metadata__/] },
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;
