const path = require('path');
const withPWA = require('next-pwa')({
    // disable: process.env['NODE_ENV'] === 'development',
    disable: true,
    dest: 'public',
    // mode: 'production',
    skipWaiting: false,
});

const withPlugins = require('next-compose-plugins');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env['ANALYZE'] === 'true',
});

module.exports = withPlugins([withPWA, withBundleAnalyzer], {
    reactStrictMode: false,
    transpilePackages: ['@finnoto/core', '@finnoto/design-system'],
    output: 'standalone',
    experimental: {
        outputFileTracingRoot: path.join(__dirname, '../../'),
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.com',
            },
        ],
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if the project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    env: {
        MAIN_LOGO: process.env['MAIN_LOGO'],
        SMALL_LOGO: process.env['SMALL_LOGO'],
        FAVICON: process.env['FAVICON'],
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals.push({
                bufferutil: 'bufferutil',
                'utf-8-validate': 'utf-8-validate',
            });
            config.resolve.alias.canvas = false;
        }
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
});
