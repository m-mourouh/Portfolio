'use client'
import { useLayoutEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styled from 'styled-components'
import { gsap } from 'gsap'
import { FiArrowLeft, FiArrowUpRight, FiGithub } from 'react-icons/fi'
import { projects, pick, pickList } from '@/lib/projects'
import { projectLayers } from '@/lib/projectLayers'
import { useLanguage } from '@/contexts/LanguageContext'
import { device } from '@/styles/styled-components/Breakpoints'
import { padding } from '@/styles/styled-components/Helpers'
import Cursor from '../Cursor'
import Footer from '../Footer'
import DeferredWidgets from '../DeferredWidgets'
import { STAGE_RECT_KEY } from './ProjectStage'

/**
 * Case study: verified content only (data/projects.json). Every optional field (role, year,
 * highlights, links, gallery) is shown only when it is documented, never filled in.
 * Arriving from the project stage, the cover grows from the stage frame into the header.
 */
const img = (name: string) => require(`../../public/images/${name}`)

export default function CaseStudy({ id }: { id: string }) {
    const { t, language } = useLanguage()
    const visible = projects.filter((p) => !p.hidden)
    const index = visible.findIndex((p) => p.id === id)
    const p = visible[index]
    const cover = useRef<HTMLDivElement>(null)

    // shared transition: from the stage frame's rect to the header image (FLIP)
    useLayoutEffect(() => {
        let from: { id: string; x: number; y: number; w: number; h: number } | null = null
        try {
            from = JSON.parse(sessionStorage.getItem(STAGE_RECT_KEY) || 'null')
            sessionStorage.removeItem(STAGE_RECT_KEY)
        } catch {}
        const el = cover.current
        if (!el || !from || from.id !== id || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const to = el.getBoundingClientRect()
        gsap.fromTo(
            el,
            { x: from.x - to.left, y: from.y - to.top, scaleX: from.w / to.width, scaleY: from.h / to.height, transformOrigin: '0 0' },
            { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.9, ease: 'expo.out', clearProps: 'transform' }
        )
    }, [id])

    const role = pick(p.role, language)
    const highlights = pickList(p.highlights, language)
    const category = pick(p.category, language)
    const layers = projectLayers(p)
    const shots = Array.from(new Set([p.image, ...p.gallery])).filter((s) => s && s !== 'default-image.jpg')
    const extra = shots.filter((s) => s !== p.image)
    const hasCover = !!p.image && p.image !== 'default-image.jpg'

    return (
        <>
            <Page id="main" tabIndex={-1} className={p.id === 'quran-ai' ? 'tone-mint' : ''}>
                <Link href="/#projects" className="back">
                    <FiArrowLeft aria-hidden="true" /> {t('projects.back')}
                </Link>

                <header className="cs-head">
                    <p className="meta">
                        <span className="num">{String(index + 1).padStart(2, '0')}</span>
                        {category && <span>{category}</span>}
                        {p.year && <span>{p.year}</span>}
                    </p>
                    <h1>
                        {p.name}
                        {p.appName && <span className="app">{p.appName}</span>}
                    </h1>
                </header>

                {hasCover && (
                    <div className="cover" ref={cover}>
                        <Image
                            src={img(p.image)}
                            alt={`${p.name}${p.appName ? ` (${p.appName})` : ''}`}
                            fill
                            priority
                            placeholder="blur"
                            sizes="(max-width: 900px) 100vw, 1200px"
                            style={p.focus ? { objectPosition: p.focus } : undefined}
                        />
                    </div>
                )}

                <div className="cs-body">
                    <section className="overview" aria-labelledby="cs-overview">
                        <h2 id="cs-overview">{t('projects.overview')}</h2>
                        <p>{pick(p.description, language)}</p>
                        {role && (
                            <>
                                <h2>{t('projects.role')}</h2>
                                <p>{role}</p>
                            </>
                        )}
                        {highlights.length > 0 && (
                            <>
                                <h2>{t('projects.highlights')}</h2>
                                <ul>
                                    {highlights.map((h) => (
                                        <li key={h}>{h}</li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </section>

                    <dl className="facts">
                        {category && (
                            <div>
                                <dt>{t('projects.category')}</dt>
                                <dd>{category}</dd>
                            </div>
                        )}
                        {p.stack.length > 0 && (
                            <div>
                                <dt>{t('projects.techStack')}</dt>
                                <dd>{p.stack.join(' · ')}</dd>
                            </div>
                        )}
                        {layers.length > 0 && (
                            <div>
                                <dt>{t('projects.layers')}</dt>
                                <dd>
                                    <ul className="chips" aria-label={t('projects.layersNote')}>
                                        {layers.map((l) => (
                                            <li key={l}>{l}</li>
                                        ))}
                                    </ul>
                                </dd>
                            </div>
                        )}
                        {(p.links.website || p.links.github) && (
                            <div className="links">
                                {p.links.website && (
                                    <a href={p.links.website} target="_blank" rel="noopener noreferrer" className="btn primary">
                                        {t('projects.liveDemo')} <FiArrowUpRight aria-hidden="true" />
                                    </a>
                                )}
                                {p.links.github && (
                                    <a href={p.links.github} target="_blank" rel="noopener noreferrer" className="btn">
                                        <FiGithub aria-hidden="true" /> {t('projects.sourceCode')}
                                    </a>
                                )}
                            </div>
                        )}
                    </dl>
                </div>

                {extra.length > 0 && (
                    <section className="shots" aria-labelledby="cs-shots">
                        <h2 id="cs-shots">{t('projects.screenshots')}</h2>
                        {extra.map((s) => (
                            <div className="shot" key={s}>
                                <Image src={img(s)} alt={`${p.name}: ${t('projects.screenshots')}`} fill placeholder="blur" sizes="(max-width: 900px) 100vw, 1200px" />
                            </div>
                        ))}
                    </section>
                )}
            </Page>
            <Footer />
            <Cursor />
            <DeferredWidgets />
        </>
    )
}

const mono = `font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;`

const Page = styled.main`
    ${padding()}
    padding-top: 140px;
    padding-bottom: var(--section-space);
    max-width: 1500px;
    margin: 0 auto;
    color: var(--c-text);

    .back {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 44px;
        color: var(--c-text-muted);
        text-decoration: none;
        font-size: 15px;

        &:hover {
            color: var(--c-accent);
        }
        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: 3px;
        }
    }

    .cs-head {
        margin: var(--sp-4) 0 var(--sp-6);
    }
    .meta {
        ${mono}
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        margin: 0 0 14px;
        font-size: 12px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--c-text-muted);

        .num {
            color: var(--c-accent);
        }
    }
    h1 {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 8px 20px;
        margin: 0;
        font-size: var(--fs-display);
        font-weight: 500;
        line-height: 0.95;
        letter-spacing: -0.035em;
        text-transform: uppercase;

        .app {
            ${mono}
            font-size: 14px;
            font-weight: 400;
            letter-spacing: 0.14em;
            color: var(--c-accent);
        }
    }

    .cover,
    .shot {
        position: relative;
        aspect-ratio: 16 / 9;
        border-radius: 12px;
        overflow: hidden;
        background: #111;
        box-shadow: 0 0 0 1px rgba(196, 255, 0, 0.22), 0 0 70px -24px rgba(196, 255, 0, 0.3);

        img {
            object-fit: cover;
        }
    }
    &.tone-mint .cover img {
        filter: saturate(0.35) brightness(0.46) contrast(1.3);
    }

    .cs-body {
        display: grid;
        grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
        gap: clamp(32px, 5vw, 96px);
        margin-top: var(--sp-8);

        @media ${device.md} {
            grid-template-columns: 1fr;
        }
    }
    h2 {
        ${mono}
        margin: 0 0 12px;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--c-text-muted);
    }
    .overview p,
    .overview li {
        margin: 0 0 var(--sp-4);
        font-size: clamp(1.125rem, 1.6vw, 1.5rem);
        line-height: 1.55;
    }
    .facts {
        display: grid;
        gap: var(--sp-3);
        margin: 0;
        align-content: start;

        > div {
            padding-bottom: var(--sp-2);
            border-bottom: 1px solid var(--c-line);
        }
        dt {
            ${mono}
            margin-bottom: 6px;
            font-size: 12px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--c-text-muted);
        }
        dd {
            margin: 0;
            font-size: 16px;
        }
        .links {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            border: 0;
        }
    }
    .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        list-style: none;
        margin: 0;
        padding: 0;

        li {
            ${mono}
            padding: 4px 9px;
            border: 1px solid rgba(196, 255, 0, 0.45);
            border-radius: 4px;
            font-size: 12px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--c-accent);
        }
    }
    .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 44px;
        padding: 0 20px;
        border-radius: 999px;
        border: 1px solid var(--c-line-strong);
        color: var(--c-text);
        text-decoration: none;

        &.primary {
            background: var(--c-accent);
            border-color: var(--c-accent);
            color: #111;
        }
        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: 3px;
        }
    }
    .shots {
        display: grid;
        gap: var(--sp-4);
        margin-top: var(--section-space);
    }
`
