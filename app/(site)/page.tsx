import Main from '@/components/Main'
import { getArticles } from '@/lib/articles'

// the Journal is rebuilt from the Medium feed at most every few hours (ISR)
export const revalidate = 21600 // 6 h (Next needs a literal here; same as ARTICLES_REVALIDATE)

export default async function Home() {
    const { articles } = await getArticles()
    return <Main articles={articles} />
}
