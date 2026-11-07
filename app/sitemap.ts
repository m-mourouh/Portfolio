import { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'
import { projects } from '@/lib/projects'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        { url: siteUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
        // one case-study page per visible project
        ...projects
            .filter((p) => !p.hidden)
            .map((p) => ({ url: `${siteUrl}/work/${p.id}`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.7 })),
    ]
}
