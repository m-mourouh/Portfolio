'use client'
import React, { useEffect, useRef } from 'react'
import skillsData from '@/data/skills.json'
import fieldsData from '@/data/fields.json'
import { StyledSkills } from '@/styles/styled-components/Skills.styled'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Certifications from './Certifications'
import MiniHeatmap from './MiniHeatmap'
import RadarChart from './RadarChart'
import ToolIcon from './ToolIcons'
import { useLanguage } from '@/contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

export default function Skills() {
    const { t } = useLanguage()
    const sectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const section = sectionRef.current
        if (!section) return

        const cards = section.querySelectorAll('.skill-card')

        gsap.fromTo(
            cards,
            { opacity: 0, y: 60, scale: 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    once: true,
                },
            }
        )

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        }
    }, [])

    const skillCategories = [
        {
            title: t('skills.proficiency'),
            skills: [],
            gridClass: 'large',
            description: t('skills.proficiencyDesc'),
            type: 'comprehensive-radar',
            heatmapType: undefined,
        },
        {
            title: t('skills.frontend'),
            skills: skillsData.data[0],
            gridClass: 'tall',
            description: t('skills.frontendDesc'),
            type: 'skills',
            heatmapType: 'grid' as const,
        },
        {
            title: t('skills.backend'),
            skills: skillsData.data[1],
            gridClass: 'medium',
            description: t('skills.backendDesc'),
            type: 'skills',
            heatmapType: undefined,
        },
        {
            title: t('skills.databases'),
            skills: skillsData.data[2],
            gridClass: 'medium',
            description: t('skills.databasesDesc'),
            type: 'skills',
            heatmapType: undefined,
        },
        {
            title: t('skills.certifications'),
            skills: [],
            gridClass: 'medium',
            description: t('skills.certificationsDesc'),
            type: 'certifications',
            heatmapType: undefined,
        },
        {
            title: t('skills.tools'),
            skills: skillsData.data[3],
            gridClass: 'wide',
            description: t('skills.toolsDesc'),
            type: 'skills',
            heatmapType: 'wave' as const,
        },
    ]

    return (
        <StyledSkills id="skills" ref={sectionRef}>
            <div className="skills-header">
                <h1 dangerouslySetInnerHTML={{ __html: t('skills.title') }} />
                <p className="subtitle">{t('skills.subtitle')}</p>
            </div>

            <div className="bento-grid">
                {skillCategories.map((category, idx) => (
                    <div key={idx} className={`skill-card ${category.gridClass}`}>
                        {category.type === 'comprehensive-radar' ? (
                            <>
                                <div className="card-header">
                                    <h3>{category.title}</h3>
                                    <p className="card-description">{category.description}</p>
                                </div>
                                <RadarChart
                                    labels={[
                                        t('skills.frontend'),
                                        t('skills.backend'),
                                        t('skills.databases'),
                                        t('skills.tools')
                                    ]}
                                    values={[95, 85, 80, 90]}
                                />
                            </>
                        ) : category.type === 'certifications' ? (
                            <div className='certfs'>
                                <div className="card-header">
                                    <h3>{category.title}</h3>
                                    <p className="card-description">{category.description}</p>
                                </div>
                                <Certifications />
                            </div>
                        ) : (
                            <>
                                <div className="card-header">
                                    <h3>{category.title}</h3>
                                    <p className="card-description">{category.description}</p>
                                </div>
                                <div className="skills-list">
                                    {category.skills.map((skill, skillIdx) => (
                                        <div key={skillIdx} className="skill-tag">
                                            {category.heatmapType === 'wave' && <span className="skill-icon"><ToolIcon tool={skill} /></span>}
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                                {category.heatmapType && (
                                    <MiniHeatmap type={category.heatmapType} />
                                )}
                            </>
                        )}
                        <div className="card-accent"></div>
                    </div>
                ))}
            </div>
        </StyledSkills>
    )
}
