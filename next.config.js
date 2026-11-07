/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        styledComponents: true,
    },
    images: {
        // Medium article cover images
        remotePatterns: [{ protocol: 'https', hostname: 'cdn-images-1.medium.com' }],
    },
}

module.exports = nextConfig
