import { LAYERS } from './heroStack'

/** What each hero layer stands for: the same names and one-line descriptions as the
 *  Expertise architecture (lib/expertise.ts + translations), nothing invented. */
export type LayerInfo = { tag: (typeof LAYERS)[number]; name: string; desc: string }

/** bottom → top, same order as LAYERS */
export const layerInfo = (t: (key: string) => string): LayerInfo[] => [
    { tag: 'AI', name: 'AI', desc: t('skills.layer.ai') },
    { tag: 'DATA', name: 'Data', desc: t('skills.layer.data') },
    { tag: 'SERVICES', name: 'Services', desc: t('skills.layer.services') },
    { tag: 'API', name: 'API', desc: t('skills.layer.api') },
    { tag: 'UI', name: 'UI', desc: t('skills.layer.ui') },
]
