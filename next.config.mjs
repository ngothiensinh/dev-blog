/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/dev-blog', // no longer needed if using custom domain
  images: { unoptimized: true },
  trailingSlash: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;
