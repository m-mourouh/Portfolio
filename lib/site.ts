// Public URL of the site, used for metadata, sitemap and structured data.
// Set NEXT_PUBLIC_SITE_URL in production (e.g. https://your-domain.com).
export const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
).replace(/\/$/, '')
