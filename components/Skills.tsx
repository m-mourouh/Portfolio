'use client'
import { useState } from 'react'
import { StyledSkills } from '@/styles/styled-components/Skills.styled'
import { useLanguage } from '@/contexts/LanguageContext'
import SectionIndex from './SectionIndex'
import Architecture from './expertise/Architecture'
import CertLedger from './expertise/CertLedger'

/**
 * Technical Expertise: one architecture diagram (the only place the stack is listed) and the
 * certifications ledger. All data: lib/expertise.ts.
 */
export default function Skills() {
    const { t } = useLanguage()
    // a hovered certification highlights its technology in the diagram
    const [highlight, setHighlight] = useState<string | null>(null)

    return (
        <StyledSkills id="skills">
            <div className="skills-header">
                <SectionIndex n={2} label={t('nav.skills')} center />
                <h2 dangerouslySetInnerHTML={{ __html: t('skills.title') }} />
                <p className="subtitle">{t('skills.subtitle')}</p>
            </div>
            <Architecture highlightTech={highlight} />
            <CertLedger onHighlight={setHighlight} />
        </StyledSkills>
    )
}
