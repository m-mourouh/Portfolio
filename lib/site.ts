// Public URL of the site, used for metadata, sitemap and structured data.
// NEXT_PUBLIC_SITE_URL can override it (e.g. for a staging domain).
export const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === 'production' ? 'https://www.mmourouh.dev' : 'http://localhost:3000')
).replace(/\/$/, '')
