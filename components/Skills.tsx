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

gsap.registerPlugin(ScrollTrigger)

export default function Skills() {
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
            title: 'Proficiency',
            skills: [],
            gridClass: 'large',
            description: 'Overall skill proficiency across all categories',
            type: 'comprehensive-radar',
            heatmapType: undefined,
        },
        {
            title: fieldsData.data[0].title,
            skills: skillsData.data[0],
            gridClass: 'tall',
            description: 'Building beautiful, responsive user interfaces',
            type: 'skills',
            heatmapType: 'grid' as const,
        },
        {
            title: fieldsData.data[1].title,
            skills: skillsData.data[1],
            gridClass: 'medium',
            description: 'Server-side development and APIs',
            type: 'skills',
            heatmapType: undefined,
        },
        {
            title: fieldsData.data[2].title,
            skills: skillsData.data[2],
            gridClass: 'medium',
            description: 'Data management and storage',
            type: 'skills',
            heatmapType: undefined,
        },
        {
            title: 'Certifications',
            skills: [],
            gridClass: 'medium',
            description: 'Professional credentials & achievements',
            type: 'certifications',
            heatmapType: undefined,
        },
        {
            title: fieldsData.data[3].title,
            skills: skillsData.data[3],
            gridClass: 'wide',
            description: 'Development tools and workflows',
            type: 'skills',
            heatmapType: 'wave' as const,
        },
    ]

    return (
        <StyledSkills id="skills" ref={sectionRef}>
            <div className="skills-header">
                <h1>Technical <span className="secondary-text">Expertise</span></h1>
                <p className="subtitle">A comprehensive overview of my development skills</p>
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
                                        fieldsData.data[0].title,
                                        fieldsData.data[1].title,
                                        fieldsData.data[2].title,
                                        fieldsData.data[3].title
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
                                            {category.title === 'Tools' && <span className="skill-icon"><ToolIcon tool={skill} /></span>}
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
