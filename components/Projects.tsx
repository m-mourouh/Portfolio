'use client'
import { roboto, roboto_mono } from '@/fonts/fonts'
import { projects, Project, pick } from '@/lib/projects'
import { StyledProjects } from '@/styles/styled-components/Projects.styled'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiArrowUpRight } from 'react-icons/fi'
import Image from 'next/image'
import ProjectStage from './work/ProjectStage'
import dynamic from 'next/dynamic'

// The popup (with its image slider) loads on demand; it's prefetched when a card is hovered
const loadModal = () => import('./ProjectModal')
const ProjectModal = dynamic(loadModal, { ssr: false })
import { useLanguage } from '@/contexts/LanguageContext'
import { onOpenProject } from '@/lib/commandMenu'
import SectionIndex from './SectionIndex'

const FEATURED_COUNT = 4

export default function Projects() {
    const { t, language } = useLanguage()
    const activeProjects = projects.filter((project) => !project.hidden)
    // Top projects as big cards, the rest in a compact list behind "View All Projects"
    const featuredProjects = activeProjects.slice(0, FEATURED_COUNT)
    const moreProjects = activeProjects.slice(FEATURED_COUNT)
    const [selected, setSelected] = useState<{ project: Project; originEl: HTMLElement | null } | null>(null)
    const [showAll, setShowAll] = useState(false)
    const listRef = useRef<HTMLUListElement>(null)
    const toggleRef = useRef<HTMLButtonElement>(null)
    // last value we reacted to: only an actual toggle should refresh/scroll (survives Strict Mode re-runs)
    const lastShowAll = useRef(false)

    const sectionRef = useRef<HTMLElement>(null)

    // Index hover preview (desktop mouse only): the project's image follows the cursor
    const [preview, setPreview] = useState<Project | null>(null)
    const previewRef = useRef<HTMLDivElement>(null)
    const canPreview = useRef(false)
    useEffect(() => {
        canPreview.current =
            window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }, [])
    const hasImage = (p: Project) => !!p.image && p.image !== 'default-image.jpg'
    const movePreview = (e: React.MouseEvent) => {
        if (!canPreview.current || !previewRef.current) return
        gsap.to(previewRef.current, { x: e.clientX + 28, y: e.clientY - 100, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
    }

    // Projects can be opened from the command menu (Ctrl+K)
    useEffect(
        () =>
            onOpenProject((id) => {
                const project = activeProjects.find((p) => p.id === id)
                if (project) setSelected({ project, originEl: null })
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    useEffect(() => {
        if (lastShowAll.current === showAll) return
        lastShowAll.current = showAll
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
        <StyledProjects id="projects" className={roboto_mono.variable} ref={sectionRef}>
            <div className="projects-header">
                <div>
                    <SectionIndex n={3} label={t('nav.work')} />
                    <h2 className={roboto.variable} dangerouslySetInnerHTML={{ __html: t('projects.title') }} />
                </div>
            </div>
            <ProjectStage projects={featuredProjects} />

            {showAll && (
                <ul
                    className="more-projects"
                    id="more-projects"
                    ref={listRef}
                    onMouseMove={movePreview}
                    onMouseLeave={() => setPreview(null)}
                    onPointerEnter={() => loadModal()}
                >
                    {moreProjects.map((project, i) => (
                        <li key={project.id}>
                            <button
                                className="more-row"
                                aria-haspopup="dialog"
                                onMouseEnter={() => canPreview.current && setPreview(hasImage(project) ? project : null)}
                                onClick={() => setSelected({ project, originEl: null })}
                            >
                                <span className="more-num">{String(FEATURED_COUNT + i + 1).padStart(2, '0')}</span>
                                <span className="more-name">{project.name}</span>
                                <span className="more-desc">
                                    {pick(project.description, language)}
                                </span>
                                <span className="more-stack">{project.stack.slice(0, 3).join(' · ')}</span>
                                <FiArrowUpRight className="more-arrow" aria-hidden="true" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div ref={previewRef} className={`list-preview${preview ? ' show' : ''}`} aria-hidden="true">
                {preview && (
                    <Image
                        src={require(`../public/images/${preview.image}`)}
                        alt=""
                        fill
                        sizes="300px"
                        style={preview.focus ? { objectPosition: preview.focus } : undefined}
                    />
                )}
            </div>

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
