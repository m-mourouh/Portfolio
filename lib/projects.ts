import projectData from '@/data/projects.json'

export type Lang = 'en' | 'fr' | 'ar'
export const LANGS: Lang[] = ['en', 'fr', 'ar']
export type Localized = Record<Lang, string>
export type LocalizedList = Record<Lang, string[]>

export type Project = {
    id: string
    name: string
    /** Optional product / app name when it differs from the project name (e.g. "Noon") */
    appName?: string
    description: Localized
    /** Optional short category, e.g. "E-commerce platform" */
    category?: Localized
    role: Localized
    highlights: LocalizedList
    /** Optional, e.g. "2025" (shown on the card) */
    year?: string
    stack: string[]
    links: { github: string; website: string }
    image: string
    /** Optional focal point for crops, CSS object-position like "25% 40%" */
    focus?: string
    gallery: string[]
    hidden: boolean
}

export const projects = projectData.data as Project[]

/** Text in the current language, falling back to English. */
export const pick = (value: Partial<Localized> | undefined, lang: string) =>
    value?.[lang as Lang] || value?.en || ''

export const pickList = (value: Partial<LocalizedList> | undefined, lang: string) => {
    const list = value?.[lang as Lang]
    return list && list.length ? list : value?.en || []
}
