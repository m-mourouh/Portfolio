import type { Project } from './projects'

/**
 * Which system layers (the hero's UI / API / Services / Data / AI) a project involved,
 * derived ONLY from its verified tech stack. No match in the stack, no chip.
 */
export type ProjectLayer = 'UI' | 'API' | 'Services' | 'Data' | 'AI'

const RULES: Array<[ProjectLayer, RegExp]> = [
    ['UI', /^(react|next(\.js)?|angular|vue|jstl|scss|sass|css|html|js|ts|typescript|javascript|tailwind|redux)\b/i],
    ['API', /^(java|spring|node|flask|php)\b/i],
    ['Services', /^spring\b/i],
    ['Data', /^(supabase|firebase|mysql|postgres|mongo|jpa|hibernate)/i],
    ['AI', /^(ai|ml)$/i],
]

export const projectLayers = (p: Pick<Project, 'stack'>): ProjectLayer[] =>
    RULES.filter(([, re]) => p.stack.some((s) => re.test(s.trim()))).map(([layer]) => layer)
