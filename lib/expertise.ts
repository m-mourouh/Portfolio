import { projects, Project } from './projects'

/**
 * Single source of truth for the Expertise section and every count on the site.
 * Technologies and certifications are exactly the ones that were already in the repo
 * (data/skills.json, components/Certifications.tsx); nothing was added.
 */

// same names and order as the hero stack, plus the cross-cutting Delivery band
export type LayerId = 'ui' | 'api' | 'services' | 'data' | 'ai' | 'delivery'
export const LAYERS: Array<{ id: LayerId; name: string; descKey: string }> = [
    { id: 'ui', name: 'UI', descKey: 'skills.layer.ui' },
    { id: 'api', name: 'API', descKey: 'skills.layer.api' },
    { id: 'services', name: 'Services', descKey: 'skills.layer.services' },
    { id: 'data', name: 'Data', descKey: 'skills.layer.data' },
    { id: 'ai', name: 'AI', descKey: 'skills.layer.ai' },
    { id: 'delivery', name: 'Delivery', descKey: 'skills.layer.delivery' },
]
export const STACK_LAYERS = LAYERS.filter((l) => l.id !== 'delivery')

/**
 * core = "Daily drivers", broad = "Also worked with". Left undefined until the owner decides
 * (no evidence in the repo is clear enough); the panel then shows one neutral list.
 */
export type Tier = 'core' | 'broad'
export type Tech = { name: string; layer: LayerId; tier?: Tier }

export const TECHNOLOGIES: Tech[] = [
    // UI
    ...['HTML', 'CSS', 'SASS', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'JavaScript', 'TypeScript', 'React.js', 'Next.js', 'Vue.js', 'Angular'].map(
        (name) => ({ name, layer: 'ui' as const })
    ),
    // API: languages / runtimes that serve the APIs
    ...['Java', 'Node.js', 'Python'].map((name) => ({ name, layer: 'api' as const })),
    // Services: the application / business-logic framework
    { name: 'Spring Framework', layer: 'services' },
    // Data
    ...['MySQL', 'PostgreSQL', 'MongoDB', 'FireBase'].map((name) => ({ name, layer: 'data' as const })),
    // AI
    ...['Claude', 'N8N'].map((name) => ({ name, layer: 'ai' as const })),
    // Delivery: CI/CD, version control, monitoring and the tooling around it
    ...['Git', 'GitHub', 'GitLab', 'Docker', 'Jenkins', 'CircleCI', 'Grafana', 'Figma', 'Asana', 'Obsidian', 'VS Code', 'IntelliJ IDEA'].map(
        (name) => ({ name, layer: 'delivery' as const })
    ),
]
export const techIn = (layer: LayerId) => TECHNOLOGIES.filter((t) => t.layer === layer)

export type LinkLabel = 'api' | 'logic' | 'data' | 'ai' | 'delivery'
export const CONNECTIONS: Array<{ from: LayerId; to: LayerId; label: LinkLabel }> = [
    { from: 'ui', to: 'api', label: 'api' },
    { from: 'api', to: 'services', label: 'logic' },
    { from: 'services', to: 'data', label: 'data' },
    { from: 'data', to: 'ai', label: 'ai' },
]

// ---------- projects (trace mode): their stacks exactly as stored in data/projects.json ----------
export const FEATURED_COUNT = 4
export const traceProjects: Project[] = projects.filter((p) => !p.hidden).slice(0, FEATURED_COUNT)

// how a stack entry in the project data is written → the technology it names (nothing else matches)
const ALIASES: Record<string, string> = {
    'angular 20': 'Angular', angular: 'Angular', react: 'React.js', 'react.js': 'React.js', vue: 'Vue.js', 'vue.js': 'Vue.js',
    'next.js': 'Next.js', next: 'Next.js', typescript: 'TypeScript', ts: 'TypeScript', javascript: 'JavaScript', js: 'JavaScript',
    scss: 'SASS', sass: 'SASS', css: 'CSS', html: 'HTML', java: 'Java', 'spring boot': 'Spring Framework', spring: 'Spring Framework',
    'node.js': 'Node.js', python: 'Python', mysql: 'MySQL', postgresql: 'PostgreSQL', mongodb: 'MongoDB', firebase: 'FireBase',
    'tailwind css': 'Tailwind CSS',
}
/** a project's stack mapped onto the diagram: lit technologies, lit layers, and entries that map to nothing */
export function traceOf(p: Project) {
    const techs: Tech[] = []
    const layers = new Set<LayerId>()
    const unmapped: string[] = []
    for (const entry of p.stack) {
        const name = ALIASES[entry.trim().toLowerCase()]
        const tech = name && TECHNOLOGIES.find((t) => t.name === name)
        if (tech) {
            if (!techs.includes(tech)) techs.push(tech)
            layers.add(tech.layer)
        } else if (/^ai$/i.test(entry.trim())) layers.add('ai') // the stack says "AI": light the layer, no specific tool
        else unmapped.push(entry)
    }
    return { techs, layers, unmapped }
}

// ---------- certifications ----------
export type Certification = { id: string; nameKey: string; issuer: string; year: string; url: string; tech?: string }
export const CERTIFICATIONS: Certification[] = [
    { id: 'oracle-java-se8', nameKey: 'Oracle Certified Associate, Java SE 8 Programmer', issuer: 'Oracle University', year: '', tech: 'Java', url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=6BA641800CA1E3BBBFE08F41D7DD8E93972DFAE3B352D6ACEB567A9CEA2C5860' },
    { id: 'advanced-react', nameKey: 'certifications.advancedReact', issuer: 'Meta', year: '', tech: 'React.js', url: 'https://www.coursera.org/account/accomplishments/verify/2J393YWKG8AA' },
    { id: 'java-microservices', nameKey: 'certifications.javaMicroservices', issuer: 'Google', year: '', tech: 'Java', url: 'https://www.coursera.org/account/accomplishments/verify/G2CLPCRBY5ZY' },
    { id: 'data-structures-backend', nameKey: 'certifications.dataStructuresBackend', issuer: 'Board Infinity', year: '', tech: 'Java', url: 'https://www.coursera.org/account/accomplishments/verify/2J3BFV8ZLKWF' },
    { id: 'spring-mvc-boot', nameKey: 'certifications.springMvcBoot', issuer: 'LearnQuest', year: '', tech: 'Spring Framework', url: 'https://www.coursera.org/account/accomplishments/verify/TCMC6PRGQJ52' },
    { id: 'vue-storefront', nameKey: 'certifications.vueStorefront', issuer: 'Alokai', year: '', tech: 'Vue.js', url: 'https://academy.alokai.com/certificates/ip9bna7zxl' },
    { id: 'responsive-website', nameKey: 'certifications.responsiveWebsite', issuer: 'University of London', year: '', tech: 'HTML', url: 'https://www.coursera.org/account/accomplishments/verify/85Z74A87DWK7' },
    { id: 'intro-iot', nameKey: 'certifications.introductionIot', issuer: 'Cisco', year: '', url: 'https://www.credly.com/badges/3e91fc07-e8c1-4e21-9923-ee5746382401' },
    { id: 'python-data-science', nameKey: 'certifications.pythonDataScience', issuer: 'IBM', year: '', tech: 'Python', url: 'https://www.credly.com/badges/9abc7d66-b198-4d9a-8c4c-7a6d3616fd72/public_url' },
    { id: 'java-programming', nameKey: 'certifications.javaProgramming', issuer: 'OpenClassrooms', year: '', tech: 'Java', url: 'https://openclassrooms.com/fr/course-certificates/6073370022' },
    { id: 'jquery', nameKey: 'certifications.jquery', issuer: 'OpenClassrooms', year: '', tech: 'JavaScript', url: 'https://openclassrooms.com/fr/course-certificates/3046679991' },
    { id: 'js-programming', nameKey: 'certifications.jsProgramming', issuer: 'OpenClassrooms', year: '', tech: 'JavaScript', url: 'https://openclassrooms.com/fr/course-certificates/2402166741' },
]
// shown by default, in this order
export const FEATURED_CERTS = ['oracle-java-se8', 'spring-mvc-boot', 'advanced-react', 'java-microservices']

// ---------- counts: the only place they are computed ----------
export const counts = {
    technologies: TECHNOLOGIES.length,
    certifications: CERTIFICATIONS.length,
    byLayer: Object.fromEntries(LAYERS.map((l) => [l.id, techIn(l.id).length])) as Record<LayerId, number>,
}
