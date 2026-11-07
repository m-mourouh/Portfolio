import { notFound } from 'next/navigation'
import { projects } from '@/lib/projects'
import data from '@/data/user.json'
import CaseStudy from '@/components/work/CaseStudy'

// one static page per visible project; nothing else is generated
export const dynamicParams = false
const visible = projects.filter((p) => !p.hidden)

export function generateStaticParams() {
    return visible.map((p) => ({ slug: p.id }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
    const p = visible.find((x) => x.id === params.slug)
    if (!p) return {}
    const name = p.appName ? `${p.name} (${p.appName})` : p.name
    return {
        title: `${name} | ${data.user.name}`,
        description: p.description.en,
        alternates: { canonical: `/work/${p.id}` },
        openGraph: { title: `${name} | ${data.user.name}`, description: p.description.en },
    }
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
    const p = visible.find((x) => x.id === params.slug)
    if (!p) notFound()
    return <CaseStudy id={p.id} />
}
