/** The page sections, in order, with the numbers used by their section labels (SectionIndex). */
export const SECTIONS = [
    { id: 'about', key: 'nav.about', n: 1 },
    { id: 'skills', key: 'nav.skills', n: 2 },
    { id: 'projects', key: 'nav.work', n: 3 },
    { id: 'articles', key: 'nav.articles', n: 4 },
    { id: 'contact', key: 'nav.contact', n: 5 },
] as const
export type SectionId = 'head' | (typeof SECTIONS)[number]['id']
