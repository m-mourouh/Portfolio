import articlesData from '@/data/articles.json'

/**
 * One article model for the whole site. Source: the Medium RSS feeds (fetched on the server,
 * revalidated every few hours); fallback: data/articles.json (also editable in /admin).
 * Nothing is invented: titles, links, dates, covers and excerpts come from the feed itself,
 * tags from the feed's categories (or the curated tags when the feed has none).
 */
export type Article = {
    title: string
    url: string
    /** YYYY-MM-DD */
    date: string
    /** minutes */
    readingTime: number
    tags: string[]
    image: string
    /** first sentences of the article, plain text (feed only) */
    excerpt?: string
}

export const ARTICLES_REVALIDATE = 6 * 60 * 60 // seconds
export const mediumProfile = articlesData.profile
const fallback = articlesData.data as Article[]

// every Medium account that appears in the data (the profile + article links)
const accounts = Array.from(
    new Set([articlesData.profile, ...fallback.map((a) => a.url)].map((u) => u.match(/medium\.com\/(@[\w.-]+)/)?.[1]).filter(Boolean) as string[])
)
const FEED_BASE = process.env.MEDIUM_FEED_BASE || 'https://medium.com/feed/'

// Medium category slugs → readable labels (unknown slugs are title-cased)
const LABELS: Record<string, string> = {
    'artificial-intelligence': 'AI', ai: 'AI', devops: 'DevOps', webdev: 'Web Dev', 'web-development': 'Web Dev',
    typescript: 'TypeScript', javascript: 'JavaScript', java: 'Java', angular: 'Angular', agile: 'Agile',
}
const label = (slug: string) =>
    LABELS[slug] ||
    slug
        .split(/[-\s]+/)
        .filter(Boolean)
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(' ')

const unwrap = (s: string) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
const entities = (s: string) =>
    s
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&#x27;/g, "'")
        .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
        .replace(/&amp;/g, '&')
// CDATA first, then tags, then entities (stripping tags first would eat the CDATA blocks)
const text = (html: string) => entities(unwrap(html).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
const tag = (item: string, name: string) => item.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1] || ''

/** the opening of the article body: whole sentences up to ~220 characters */
const excerptOf = (content: string, title: string) => {
    const paras = Array.from(content.matchAll(/<p>([\s\S]*?)<\/p>/g)).map((m) => text(m[1])).filter((p) => p.length > 40 && p !== title)
    const body = paras.slice(0, 2).join(' ')
    if (!body) return undefined
    if (body.length <= 220) return body
    const cut = body.slice(0, 221)
    let end = -1
    for (const m of Array.from(cut.matchAll(/[.!?][”’"]?(?=\s)/g))) end = m.index! + m[0].length
    return end > 100 ? cut.slice(0, end) : `${cut.slice(0, 220).replace(/\s+\S*$/, '')}…`
}

function parseFeed(xml: string): Article[] {
    return Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g)).map(([, item]) => {
        const title = text(tag(item, 'title'))
        const content = unwrap(tag(item, 'content:encoded'))
        const words = text(content).split(' ').length
        const pub = new Date(tag(item, 'pubDate'))
        return {
            title,
            url: entities(unwrap(tag(item, 'link'))).split('?')[0],
            date: isNaN(pub.getTime()) ? '' : pub.toISOString().slice(0, 10),
            readingTime: Math.max(1, Math.round(words / 230)),
            tags: Array.from(item.matchAll(/<category>([\s\S]*?)<\/category>/g))
                .map((m) => text(m[1]).toLowerCase())
                .filter(Boolean)
                .map(label),
            image: content.match(/<img[^>]+src="(https:\/\/cdn-images-1\.medium\.com\/[^"]+)"/)?.[1] || '',
            excerpt: excerptOf(content, title),
        }
    })
}

const key = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

/** Articles, newest first. Never throws: any feed problem falls back to data/articles.json. */
export async function getArticles(): Promise<{ articles: Article[]; source: 'feed' | 'fallback' }> {
    try {
        const feeds = await Promise.all(
            accounts.map(async (acc) => {
                const res = await fetch(`${FEED_BASE}${acc}`, {
                    next: { revalidate: ARTICLES_REVALIDATE },
                    signal: AbortSignal.timeout(15000),
                    headers: { 'User-Agent': 'portfolio-rss-reader' },
                })
                if (!res.ok) throw new Error(`feed ${acc}: ${res.status}`)
                return parseFeed(await res.text())
            })
        )
        // the same article can be cross-posted on several accounts: merge them
        const byTitle = new Map<string, Article>()
        for (const a of feeds.flat()) {
            if (!a.title || !a.url || !a.date) continue
            const prev = byTitle.get(key(a.title))
            if (!prev) byTitle.set(key(a.title), a)
            else
                byTitle.set(key(a.title), {
                    ...prev,
                    url: prev.tags.length ? prev.url : a.url,
                    tags: prev.tags.length ? prev.tags : a.tags,
                    image: prev.image || a.image,
                    excerpt: prev.excerpt || a.excerpt,
                })
        }
        const list = Array.from(byTitle.values()).map((a) => {
            // curated tags (data/articles.json) only when the feed has no categories
            const curated = fallback.find((f) => key(f.title) === key(a.title))
            const tags = a.tags.length ? a.tags : curated?.tags || []
            return { ...a, tags: Array.from(new Set(tags)).slice(0, 5) }
        })
        if (!list.length) throw new Error('empty feeds')
        return { articles: list.sort((a, b) => b.date.localeCompare(a.date)), source: 'feed' }
    } catch (err) {
        console.warn('Articles: Medium feed unavailable, using data/articles.json.', (err as Error).message)
        return { articles: [...fallback].sort((a, b) => b.date.localeCompare(a.date)), source: 'fallback' }
    }
}
