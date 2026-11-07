'use client'
import { roboto, roboto_mono } from '@/fonts/fonts'
import projectData from '@/data/projects.json'
import { StyledProjects } from '@/styles/styled-components/Projects.styled'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiArrowUpRight } from 'react-icons/fi'
import ProjectCard, { getProjectKey } from './ProjectCard'
import ProjectModal, { ModalProject } from './ProjectModal'
import { useLanguage } from '@/contexts/LanguageContext'
import { onOpenProject } from '@/lib/commandMenu'

const FEATURED_COUNT = 4

export default function Projects() {
    const { t } = useLanguage()
    const activeProjects = projectData.data.filter((project) => !project.hidden)
    // Top projects as big cards, the rest in a compact list behind "View All Projects"
    const featuredProjects = activeProjects.slice(0, FEATURED_COUNT)
    const moreProjects = activeProjects.slice(FEATURED_COUNT)
    const [selected, setSelected] = useState<{ project: ModalProject; originEl: HTMLElement | null } | null>(null)
    const [showAll, setShowAll] = useState(false)
    const listRef = useRef<HTMLUListElement>(null)
    const toggleRef = useRef<HTMLButtonElement>(null)
    const firstRender = useRef(true)

    // Projects can be opened from the command menu (Ctrl+K)
    useEffect(
        () =>
            onOpenProject((name) => {
                const project = activeProjects.find((p) => p.name === name)
                if (project) setSelected({ project, originEl: null })
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
            return
        }
        // Page height changed: recompute scroll-based animations below (Contact reveal)
        ScrollTrigger.refresh()

        if (showAll) {
            const rows = listRef.current?.children
            if (rows && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                gsap.fromTo(
                    rows,
                    { opacity: 0, y: 16 },
                    { opacity: 1, y: 0, duration: 0.4, stagger: 0.03, ease: 'power2.out' }
                )
            }
        } else {
            // After collapsing, keep the button in view instead of leaving the visitor far below
            const btn = toggleRef.current
            if (btn) {
                const r = btn.getBoundingClientRect()
                if (r.top < 0 || r.bottom > window.innerHeight) btn.scrollIntoView({ block: 'center' })
            }
        }
    }, [showAll])

    return (
        <StyledProjects id="projects" className={roboto_mono.variable}>
            <div className="projects-header">
                <h1 className={roboto.variable} dangerouslySetInnerHTML={{ __html: t('projects.title') }} />
            </div>
            <div className="projects-list">
                {featuredProjects.map((project, idx) => (
                    <ProjectCard
                        project={project}
                        key={idx}
                        onOpen={(originEl) => setSelected({ project, originEl })}
                    />
                ))}
            </div>

            {showAll && (
                <ul className="more-projects" id="more-projects" ref={listRef}>
                    {moreProjects.map((project) => (
                        <li key={project.name}>
                            <button
                                className="more-row"
                                aria-haspopup="dialog"
                                onClick={() => setSelected({ project, originEl: null })}
                            >
                                <span className="more-name">{project.name}</span>
                                <span className="more-desc">
                                    {t(`projects.descriptions.${getProjectKey(project.name)}`)}
                                </span>
                                <span className="more-stack">{project.stack.slice(0, 3).join(' · ')}</span>
                                <FiArrowUpRight className="more-arrow" aria-hidden="true" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {moreProjects.length > 0 && (
                <div className="view-all-wrap">
                    <button
                        ref={toggleRef}
                        className="view-all-toggle"
                        aria-expanded={showAll}
                        aria-controls="more-projects"
                        onClick={() => setShowAll((v) => !v)}
                    >
                        {showAll ? t('projects.showLess') : `${t('projects.viewAll')} (${activeProjects.length})`}
                    </button>
                </div>
            )}

            {selected && (
                <ProjectModal
                    project={selected.project}
                    originEl={selected.originEl}
                    onClose={() => setSelected(null)}
                />
            )}
        </StyledProjects>
    )
}
