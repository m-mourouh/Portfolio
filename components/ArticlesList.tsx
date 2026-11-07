'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiArrowUpRight, FiClock } from 'react-icons/fi'
import type { Article } from '@/lib/articles'
import { mediumProfile } from '@/lib/articles'
import { useLanguage } from '@/contexts/LanguageContext'
import { device } from '@/styles/styled-components/Breakpoints'
import SectionIndex from './SectionIndex'

/**
 * Journal as a commit log: the latest article as a large card, the others as an index on a
 * lime node line (same language as the hero stack and the career path). Topic chips filter
 * the log. Data comes from the server (Medium RSS, fallback data/articles.json).
 */

const LIST_LIMIT = 6
const LOCALE: Record<string, string> = { en: 'en-US', fr: 'fr-FR', ar: 'ar-MA' }

export default function ArticlesList({ articles }: { articles: Article[] }) {
    const { t, language } = useLanguage()
    const [featured, ...rest] = articles
    const [topic, setTopic] = useState<string | null>(null)
    const [showAll, setShowAll] = useState(false)
    const [preview, setPreview] = useState<number | null>(null)
    const root = useRef<HTMLElement>(null)
    const log = useRef<HTMLOListElement>(null)
    const previewRef = useRef<HTMLDivElement>(null)
    const canPreview = useRef(false)

    // filter chips: only topics that really exist on the listed articles
    const topics = useMemo(() => Array.from(new Set(rest.flatMap((a) => a.tags))), [rest])
    const matches = (a: Article) => !topic || a.tags.includes(topic)
    const visible = rest.filter(matches)
    const shown = new Set((showAll ? visible : visible.slice(0, LIST_LIMIT)).map((a) => a.url))

    const fmt = (d: string) =>
        new Intl.DateTimeFormat(LOCALE[language] || 'en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${d}T00:00:00Z`))
    const num = (i: number) => `#${String(i + 1).padStart(2, '0')}`

    // row reveal (staggered) + the pulse travelling down the node line, scroll-linked
    useEffect(() => {
        const el = root.current
        if (!el) return
        canPreview.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            el.style.setProperty('--p', '1')
            el.classList.add('static')
            return
        }
        gsap.registerPlugin(ScrollTrigger)
        const ctx = gsap.context(() => {
            gsap.fromTo('.log > li', { y: 22, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.08,
                scrollTrigger: { trigger: '.log', start: 'top 85%', once: true },
            })
            ScrollTrigger.create({
                trigger: '.log', start: 'top 80%', end: 'bottom 60%', scrub: 0.6,
                onUpdate: (self) => el.style.setProperty('--p', self.progress.toFixed(4)),
            })
        }, el)
        return () => ctx.revert()
    }, [])

    // smooth reflow when the filter changes; refresh scroll positions below
    const first = useRef(true)
    useEffect(() => {
        if (first.current) {
            first.current = false
            return
        }
        ScrollTrigger.refresh()
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const rows = log.current?.querySelectorAll('li:not([hidden])')
        if (rows?.length) gsap.fromTo(rows, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', stagger: 0.05, overwrite: true })
    }, [topic, showAll])

    const move = (e: React.MouseEvent) => {
        if (!canPreview.current || !previewRef.current) return
        gsap.to(previewRef.current, { x: e.clientX + 28, y: e.clientY - 110, duration: 0.5, ease: 'expo.out', overwrite: 'auto' })
    }

    if (!featured) return null
    const p = preview !== null ? rest[preview] : null

    return (
        <Section id="articles" ref={root} aria-labelledby="articles-title">
            <div className="articles-header">
                <div>
                    <SectionIndex n={4} label={t('nav.articles')} />
                    <h2 id="articles-title" dangerouslySetInnerHTML={{ __html: t('articles.title') }} />
                </div>
                <a className="all-link" href={mediumProfile} target="_blank" rel="noopener noreferrer">
                    {t('articles.viewAll')} <FiArrowUpRight aria-hidden="true" />
                </a>
            </div>

            <ol className="articles" aria-label={t('nav.articles')}>
                {/* the latest article */}
                <li className="featured">
                    <a href={featured.url} target="_blank" rel="noopener noreferrer" className="feat-link">
                        <div className="cover">
                            {featured.image ? (
                                <Image src={featured.image} alt="" fill sizes="(max-width: 900px) 100vw, 55vw" />
                            ) : (
                                <span className="tile" aria-hidden="true">
                                    {featured.tags.join(' · ')}
                                </span>
                            )}
                        </div>
                        <div className="feat-body">
                            <p className="meta">
                                <span className="latest">{t('articles.latest')}</span>
                                <span>{num(0)}</span>
                                <time dateTime={featured.date}>{fmt(featured.date)}</time>
                            </p>
                            <h3 className="feat-title">{featured.title}</h3>
                            {featured.excerpt && <p className="excerpt">{featured.excerpt}</p>}
                            {featured.tags.length > 0 && (
                                <ul className="tags">
                                    {featured.tags.map((tg) => (
                                        <li key={tg}>{tg}</li>
                                    ))}
                                </ul>
                            )}
                            <p className="foot">
                                <span className="read">
                                    <FiClock aria-hidden="true" /> {t('articles.minRead', { count: featured.readingTime })}
                                </span>
                                <span className="cta">
                                    {t('articles.readOn')} <FiArrowUpRight aria-hidden="true" />
                                </span>
                            </p>
                        </div>
                    </a>
                </li>
            </ol>

            {rest.length > 0 && (
                <>
                    {topics.length > 1 && (
                        <div className="filters" role="group" aria-label={t('articles.filter')}>
                            <div className="chips">
                                {[null, ...topics].map((tg) => (
                                    <button key={tg ?? 'all'} type="button" aria-pressed={topic === tg} onClick={() => setTopic(tg)}>
                                        {tg ?? t('articles.all')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <ol className="log" ref={log} start={2} onMouseMove={move} onMouseLeave={() => setPreview(null)} id="articles-list">
                        {rest.map((a, i) => (
                            <li key={a.url} hidden={!shown.has(a.url)}>
                                <a
                                    href={a.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="row"
                                    onMouseEnter={() => canPreview.current && setPreview(i)}
                                    onFocus={() => setPreview(null)}
                                >
                                    <span className="node" aria-hidden="true" />
                                    <span className="r-meta">
                                        <span className="r-num">{num(i + 1)}</span>
                                        <time dateTime={a.date}>{fmt(a.date)}</time>
                                    </span>
                                    <span className="r-main">
                                        <span className="r-title">{a.title}</span>
                                        {a.excerpt && <span className="r-excerpt">{a.excerpt}</span>}
                                        <span className="r-info">
                                            {a.tags.map((tg) => (
                                                <span key={tg} className="r-tag">
                                                    {tg}
                                                </span>
                                            ))}
                                            <span className="r-read">
                                                <FiClock aria-hidden="true" /> {t('articles.minRead', { count: a.readingTime })}
                                            </span>
                                        </span>
                                    </span>
                                    <FiArrowUpRight className="r-arrow" aria-hidden="true" />
                                </a>
                            </li>
                        ))}
                    </ol>

                    {visible.length > LIST_LIMIT && (
                        <button type="button" className="toggle" aria-expanded={showAll} aria-controls="articles-list" onClick={() => setShowAll((v) => !v)}>
                            {showAll ? t('articles.showLess') : t('articles.showAll')}
                        </button>
                    )}
                </>
            )}

            {/* desktop only: the hovered article's cover follows the cursor */}
            <div ref={previewRef} className={`preview${p ? ' show' : ''}`} aria-hidden="true">
                {p &&
                    (p.image ? (
                        <Image src={p.image} alt="" fill sizes="300px" />
                    ) : (
                        <span className="tile">{p.tags.join(' · ') || t('articles.noCover')}</span>
                    ))}
            </div>
        </Section>
    )
}

const mono = `font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;`

const Section = styled.section`
    --p: 0;
    position: relative;
    padding: var(--section-space) var(--gutter);
    color: var(--c-text);

    .articles-header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: var(--sp-3);
        margin-bottom: var(--sp-6);

        h2 {
            margin: 0;
            font-size: var(--fs-h2);
            font-weight: 500;
            line-height: 1;
            letter-spacing: -0.03em;
            text-transform: uppercase;
        }
        @media ${device.sm} {
            flex-direction: column;
            align-items: flex-start;
        }
    }
    .all-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 44px;
        color: var(--c-text);
        text-decoration: none;
        border-bottom: 1px solid var(--c-line-strong);

        &:hover {
            color: var(--c-accent);
            border-color: var(--c-accent);
        }
        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: 4px;
        }
    }

    .articles {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    /* ---------- featured (latest) ---------- */
    .feat-link {
        display: grid;
        grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
        gap: clamp(24px, 3vw, 56px);
        align-items: center;
        color: inherit;
        text-decoration: none;
        border-radius: 14px;
        transition: transform 0.6s var(--ease-out);

        @media ${device.md} {
            grid-template-columns: 1fr;
        }
        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: 6px;
        }
    }
    .cover {
        position: relative;
        aspect-ratio: 16 / 9;
        border-radius: 12px;
        overflow: hidden;
        background: #141414;
        box-shadow: 0 0 0 1px var(--c-line);
        transition: box-shadow 0.6s var(--ease-out);

        img {
            object-fit: cover;
            /* charcoal duotone at rest */
            /* dark enough that light covers (e.g. cream illustrations) stay charcoal */
            filter: grayscale(1) contrast(1.25) brightness(0.3);
            transform: scale(1.001);
            transition: filter 0.8s var(--ease-out), transform 1s var(--ease-out);
        }
        /* lime tint that stays in the palette */
        &::after {
            content: '';
            position: absolute;
            inset: 0;
            background: rgba(196, 255, 0, 0.22);
            mix-blend-mode: multiply;
            transition: opacity 0.8s var(--ease-out);
            pointer-events: none;
        }
    }
    .tile {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        padding: 16px;
        ${mono}
        font-size: 13px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        text-align: center;
        color: var(--c-accent);
        background: radial-gradient(80% 80% at 30% 20%, rgba(196, 255, 0, 0.1), transparent 60%), #151515;
        background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
        background-size: 28px 28px;
    }
    @media (hover: hover) and (pointer: fine) {
        .feat-link:hover {
            transform: translateY(-4px);
        }
        .feat-link:hover .cover {
            box-shadow: 0 0 0 1px rgba(196, 255, 0, 0.45), 0 24px 60px rgba(0, 0, 0, 0.45);
        }
        .feat-link:hover .cover img {
            /* tinted reveal: some colour back, still dark and lime-tinted */
            filter: grayscale(0.55) contrast(1.15) brightness(0.42);
            transform: scale(1.03);
        }
        .feat-link:hover .cover::after {
            opacity: 0.45;
        }
        .feat-link:hover .feat-title {
            color: var(--c-accent);
        }
    }

    .meta {
        ${mono}
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin: 0 0 14px;
        font-size: 13px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--c-text-muted);

        .latest {
            color: #111;
            background: var(--c-accent);
            padding: 1px 8px;
            border-radius: 3px;
        }
    }
    .feat-title {
        margin: 0 0 14px;
        font-size: clamp(1.75rem, 3vw, 3rem);
        font-weight: 500;
        line-height: 1.08;
        letter-spacing: -0.02em;
        color: var(--c-text);
        transition: color 0.3s var(--ease-out);
    }
    .excerpt {
        margin: 0 0 16px;
        font-size: 16px;
        line-height: 1.6;
        color: #cfcfcf;
    }
    .tags,
    .r-info {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .tags li,
    .r-tag {
        ${mono}
        padding: 3px 8px;
        border: 1px solid var(--c-line-strong);
        border-radius: 4px;
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--c-text-muted);
    }
    .foot {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 12px;
        margin: 18px 0 0;
        font-size: 14px;
        color: var(--c-text-muted);

        .read {
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .cta {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: var(--c-accent);
            font-weight: 500;
        }
    }

    /* ---------- topic filters ---------- */
    .filters {
        position: relative;
        margin: var(--sp-8) 0 var(--sp-3);

        @media ${device.sm} {
            margin-inline: calc(-1 * var(--gutter));
            /* fade at the edge: there is more to scroll */
            &::after {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                width: 40px;
                background: linear-gradient(to right, transparent, #161616);
                pointer-events: none;
            }
        }
    }
    .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        @media ${device.sm} {
            flex-wrap: nowrap;
            overflow-x: auto;
            padding: 0 40px 4px var(--gutter);
            scrollbar-width: none;
            &::-webkit-scrollbar {
                display: none;
            }
        }
        button {
            flex: 0 0 auto;
            min-height: 44px;
            padding: 0 16px;
            border-radius: 999px;
            border: 1px solid var(--c-line-strong);
            background: none;
            ${mono}
            font-size: 13px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--c-text-muted);
            cursor: pointer;
            transition: color 0.25s, border-color 0.25s, background 0.25s;

            &:hover {
                color: var(--c-text);
                border-color: var(--c-text-muted);
            }
            &[aria-pressed='true'] {
                color: #111;
                background: var(--c-accent);
                border-color: var(--c-accent);
            }
            &:focus-visible {
                outline: 2px solid var(--c-accent);
                outline-offset: 2px;
            }
        }
    }

    /* ---------- the commit log ---------- */
    .log {
        position: relative;
        list-style: none;
        margin: 0;
        padding: 0 0 0 28px;

        /* the line, and the pulse's progress along it */
        &::before,
        &::after {
            content: '';
            position: absolute;
            left: 5px;
            top: 8px;
            bottom: 8px;
            width: 1px;
            background: var(--c-line-strong);
        }
        &::after {
            bottom: auto;
            height: calc(var(--p) * (100% - 16px));
            background: var(--c-accent);
            box-shadow: 0 0 10px rgba(196, 255, 0, 0.6);
        }
        li[hidden] {
            display: none;
        }
    }
    .row {
        position: relative;
        display: grid;
        grid-template-columns: 150px minmax(0, 1fr) 28px;
        gap: 8px 24px;
        align-items: start;
        padding: 26px 8px 26px 0;
        border-bottom: 1px solid var(--c-line);
        color: inherit;
        text-decoration: none;

        @media ${device.sm} {
            grid-template-columns: minmax(0, 1fr) 24px;
            padding: 20px 0;
        }
        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: 4px;
            border-radius: 4px;
        }
    }
    .node {
        position: absolute;
        left: -28px;
        top: 34px;
        width: 11px;
        height: 11px;
        border-radius: 2px;
        border: 1px solid var(--c-text-muted);
        background: #161616;
        transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;

        @media ${device.sm} {
            top: 28px;
        }
    }
    .r-meta {
        ${mono}
        display: grid;
        gap: 4px;
        padding-top: 8px;
        font-size: 13px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--c-text-muted);

        .r-num {
            color: var(--c-accent);
        }
        @media ${device.sm} {
            grid-column: 1 / -1;
            display: flex;
            gap: 12px;
            padding-top: 0;
        }
    }
    .r-main {
        display: grid;
        gap: 10px;
        min-width: 0;
    }
    .r-title {
        font-size: clamp(1.75rem, 2.4vw, 2.5rem);
        font-weight: 500;
        line-height: 1.12;
        letter-spacing: -0.02em;
        color: var(--c-text);
        transition: transform 0.5s var(--ease-out), color 0.3s;

        @media ${device.sm} {
            font-size: 1.375rem;
        }
    }
    .r-excerpt {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-size: 16px;
        line-height: 1.55;
        color: #bdbdbd;

        @media ${device.sm} {
            font-size: 15px;
        }
    }
    .r-read {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-inline-start: 6px;
        font-size: 14px;
        color: var(--c-text-muted);
    }
    .r-arrow {
        margin-top: 10px;
        font-size: 22px;
        color: var(--c-text-muted);
        transition: color 0.3s, transform 0.4s var(--ease-out);

        @media ${device.sm} {
            grid-row: 2;
            grid-column: 2;
        }
    }
    @media (hover: hover) and (pointer: fine) {
        .row:hover .r-title {
            transform: translateX(10px);
            color: var(--c-accent);
        }
        .row:hover .node {
            background: var(--c-accent);
            border-color: var(--c-accent);
            box-shadow: 0 0 12px rgba(196, 255, 0, 0.7);
        }
        .row:hover .r-arrow {
            color: var(--c-accent);
            transform: translate(3px, -3px);
        }
    }
    .row:focus-visible .node {
        background: var(--c-accent);
        border-color: var(--c-accent);
    }
    /* nodes the pulse has passed (reduced motion: all) */
    &.static .node {
        border-color: var(--c-accent);
    }

    .toggle {
        display: block;
        min-height: 44px;
        margin: var(--sp-4) auto 0;
        padding: 0 22px;
        border-radius: 999px;
        border: 1px solid var(--c-line-strong);
        background: none;
        color: var(--c-text);
        cursor: pointer;

        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: 3px;
        }
    }

    /* ---------- cursor-following preview (desktop mouse only) ---------- */
    .preview {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 40;
        width: 300px;
        aspect-ratio: 16 / 10;
        border-radius: 10px;
        overflow: hidden;
        pointer-events: none;
        opacity: 0;
        scale: 0.92; /* separate from transform, which GSAP uses to follow the cursor */
        transition: opacity 0.25s var(--ease-out), scale 0.35s var(--ease-out);
        box-shadow: 0 0 0 1px rgba(196, 255, 0, 0.4), 0 24px 50px rgba(0, 0, 0, 0.5);
        background: #151515;

        &.show {
            opacity: 1;
            scale: 1.08;
        }
        img {
            object-fit: cover;
            filter: grayscale(0.3) brightness(0.85);
        }
        @media (hover: none), (pointer: coarse) {
            display: none;
        }
    }

    /* phones: secondary text at 14px minimum */
    @media ${device.sm} {
        .meta,
        .r-meta,
        .tags li,
        .r-tag,
        .chips button {
            font-size: 14px;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .row .r-title,
        .feat-link,
        .cover img {
            transition: none;
        }
        .log::after {
            box-shadow: none;
        }
    }
`
