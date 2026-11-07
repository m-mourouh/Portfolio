'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styled from 'styled-components'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiArrowUpRight } from 'react-icons/fi'
import { Project, pick } from '@/lib/projects'
import { projectLayers } from '@/lib/projectLayers'
import { getLenis } from '@/lib/lenis'
import { useLanguage } from '@/contexts/LanguageContext'
import { device } from '@/styles/styled-components/Breakpoints'

/**
 * Featured projects as a pinned stage (desktop): a big numbered index on the left, one framed
 * preview + details on the right. The section pins for a short, native-speed scroll segment
 * per project; hovering / clicking / keyboard-selecting an index item does the same.
 * Phones and reduced motion: no pin, every project is a full card in sequence.
 */

const STAGE_MQ = '(min-width: 901px) and (prefers-reduced-motion: no-preference)'
const SEGMENT = 0.6 // viewport heights of scroll per project while pinned
// the Noon mockups sit on a bright mint field: tone it into the charcoal system
const TONE: Record<string, string> = { 'quran-ai': 'tone-mint' }
// these covers are screenshots of a website: present them in a browser frame
const isMockup = (p: Project) => p.id === 'quran-ai'
const host = (url: string) => {
    try {
        return new URL(url).hostname.replace(/^www\./, '')
    } catch {
        return ''
    }
}
export const STAGE_RECT_KEY = 'portfolio:stage-rect'

export default function ProjectStage({ projects }: { projects: Project[] }) {
    const { t, language } = useLanguage()
    const root = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState(0)
    const [mobileIndex, setMobileIndex] = useState(0)
    const trigger = useRef<ScrollTrigger | null>(null)
    const staged = useRef(false)

    // pin + scroll-driven index (desktop, motion allowed). All triggers are reverted on unmount.
    useEffect(() => {
        const el = root.current
        if (!el) return
        gsap.registerPlugin(ScrollTrigger)
        const mm = gsap.matchMedia()
        mm.add(STAGE_MQ, () => {
            staged.current = true
            trigger.current = ScrollTrigger.create({
                trigger: el,
                start: 'top top+=88',
                end: () => `+=${window.innerHeight * SEGMENT * (projects.length - 1)}`,
                pin: true,
                // the section is a flex container, where GSAP would default this to false
                // (the following sections would then scroll over the pinned stage)
                pinSpacing: true,
                anticipatePin: 1,
                onUpdate: (self) => setActive(Math.min(projects.length - 1, Math.floor(self.progress * projects.length))),
            })
            return () => {
                staged.current = false
                trigger.current = null
            }
        })
        return () => mm.revert()
    }, [projects.length])

    // on the stage only the active slide is reachable (others are visually hidden): make them inert
    useEffect(() => {
        const slides = root.current?.querySelectorAll<HTMLElement>('.slide')
        slides?.forEach((s, i) => {
            if (staged.current && i !== active) s.setAttribute('inert', '')
            else s.removeAttribute('inert')
        })
    }, [active])

    // phones / stacked layout: which card is in view, for the sticky "01 / 04" indicator
    useEffect(() => {
        const slides = Array.from(root.current?.querySelectorAll<HTMLElement>('.slide') || [])
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && setMobileIndex(slides.indexOf(e.target as HTMLElement))),
            { rootMargin: '-45% 0px -45% 0px' }
        )
        slides.forEach((s) => io.observe(s))
        return () => io.disconnect()
    }, [])

    // selecting an index item = scrolling to that project's segment (same result as scrolling)
    const select = (i: number) => {
        setActive(i)
        const st = trigger.current
        if (!st) return
        const y = st.start + ((i + 0.5) / projects.length) * (st.end - st.start)
        const lenis = getLenis()
        if (lenis) lenis.scrollTo(y, { duration: 0.8 })
        else window.scrollTo({ top: y, behavior: 'smooth' })
    }

    // remember where the cover is, so the case-study page can grow its header from it
    const rememberRect = (i: number) => {
        const frame = root.current?.querySelectorAll<HTMLElement>('.slide .shot')[i]
        if (!frame) return
        const r = frame.getBoundingClientRect()
        try {
            sessionStorage.setItem(STAGE_RECT_KEY, JSON.stringify({ id: projects[i].id, x: r.left, y: r.top, w: r.width, h: r.height }))
        } catch {}
    }

    const pad = (n: number) => String(n).padStart(2, '0')

    return (
        <Stage ref={root} data-active={projects[active].id}>
            <nav className="stage-nav" aria-label={t('projects.featured')}>
                <ol className="stage-index">
                    {projects.map((p, i) => (
                        <li key={p.id}>
                            <button
                                type="button"
                                className={i === active ? 'is-active' : ''}
                                aria-current={i === active ? 'true' : undefined}
                                aria-controls={`slide-${p.id}`}
                                onMouseEnter={() => staged.current && setActive(i)}
                                onClick={() => select(i)}
                            >
                                <span className="num">{pad(i + 1)}</span>
                                <span className="name">{p.name}</span>
                                {p.appName && <span className="app">{p.appName}</span>}
                            </button>
                        </li>
                    ))}
                </ol>
            </nav>

            {/* phones: where am I */}
            <div className="mini-index" aria-hidden="true">
                <span className="mi-num">
                    {pad(mobileIndex + 1)} <span>/ {pad(projects.length)}</span>
                </span>
                <span className="mi-bar">
                    <span style={{ transform: `scaleX(${(mobileIndex + 1) / projects.length})` }} />
                </span>
                <span className="mi-name">{projects[mobileIndex].name}</span>
            </div>

            <div className="slides">
                {projects.map((p, i) => {
                    const layers = projectLayers(p)
                    const category = pick(p.category, language)
                    const site = host(p.links.website)
                    return (
                        <article
                            key={p.id}
                            id={`slide-${p.id}`}
                            className={`slide ${TONE[p.id] || ''}${i === active ? ' is-active' : ''}`}
                            aria-labelledby={`title-${p.id}`}
                        >
                            <div className={`frame${isMockup(p) ? ' mockup' : ' browser'}`}>
                                {!isMockup(p) && (
                                    <div className="chrome" aria-hidden="true">
                                        <i />
                                        <i />
                                        <i />
                                        {site && <span className="url">{site}</span>}
                                    </div>
                                )}
                                <div className="shot">
                                    <Image
                                        src={require(`../../public/images/${p.image || 'default-image.jpg'}`)}
                                        alt={`${p.name}${p.appName ? ` (${p.appName})` : ''}`}
                                        fill
                                        sizes="(max-width: 900px) 92vw, 52vw"
                                        priority={i === 0}
                                        placeholder="blur"
                                        style={p.focus ? { objectPosition: p.focus } : undefined}
                                    />
                                </div>
                            </div>

                            <div className="info">
                                <p className="meta">
                                    <span className="num">{pad(i + 1)}</span>
                                    {category && <span>{category}</span>}
                                </p>
                                <h3 id={`title-${p.id}`} className="title">
                                    {p.name}
                                    {p.appName && <span className="app">{p.appName}</span>}
                                </h3>
                                <p className="desc">{pick(p.description, language)}</p>
                                <p className="stack">{p.stack.join(' · ')}</p>
                                <div className="row">
                                    {layers.length > 0 && (
                                        <ul className="chips" aria-label={t('projects.layersNote')}>
                                            {layers.map((l) => (
                                                <li key={l}>{l}</li>
                                            ))}
                                        </ul>
                                    )}
                                    <Link href={`/work/${p.id}`} className="details" onClick={() => rememberRect(i)}>
                                        {t('projects.viewDetails')} <FiArrowUpRight aria-hidden="true" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    )
                })}
            </div>
        </Stage>
    )
}

const mono = `font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;`
const stacked = `(max-width: 900px), (prefers-reduced-motion: reduce)`

const Stage = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    gap: clamp(32px, 4vw, 72px);
    align-items: start;
    height: calc(100vh - 120px);
    min-height: 600px;
    /* each project shifts the stage tint a little, inside the charcoal + lime system */
    --tint: rgba(196, 255, 0, 0.07);
    &[data-active='quran-ai'] { --tint: rgba(120, 255, 170, 0.07); }
    &[data-active='chanel'] { --tint: rgba(230, 220, 170, 0.06); }
    &[data-active='visilab'] { --tint: rgba(255, 120, 90, 0.06); }

    /* ---------- the index ---------- */
    .stage-nav {
        align-self: center;
    }
    .stage-index {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 4px;

        button {
            display: grid;
            grid-template-columns: auto 1fr;
            align-items: baseline;
            column-gap: 18px;
            width: 100%;
            padding: 10px 0;
            background: none;
            border: 0;
            text-align: start;
            color: var(--c-text-muted);
            opacity: 0.55;
            cursor: pointer;
            transition: opacity 0.4s var(--ease-out), color 0.4s var(--ease-out);

            &:hover,
            &.is-active {
                opacity: 1;
                color: var(--c-text);
            }
            &:focus-visible {
                outline: 2px solid var(--c-accent);
                outline-offset: 4px;
                border-radius: 4px;
                opacity: 1;
            }
        }
        .num {
            ${mono}
            font-size: 14px;
            color: var(--c-text-muted);
            transition: color 0.4s var(--ease-out);
        }
        .is-active .num {
            color: var(--c-accent);
        }
        .name {
            font-size: clamp(2.25rem, 4.2vw, 4.25rem);
            font-weight: 500;
            line-height: 1.02;
            letter-spacing: -0.03em;
            text-transform: uppercase;
        }
        .app {
            grid-column: 2;
            ${mono}
            font-size: 12px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--c-accent);
        }
    }

    /* ---------- the stage ---------- */
    .slides {
        position: relative;
        height: 100%;
        align-self: stretch;
        border-radius: 14px;
        background: radial-gradient(120% 80% at 70% 0%, var(--tint), transparent 60%), #141414;
        border: 1px solid var(--c-line);
        transition: background 0.8s var(--ease-out);
        overflow: hidden;

        /* subtle grid */
        &::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
            background-size: 40px 40px;
            pointer-events: none;
        }
    }
    .slide {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: clamp(16px, 2.2vh, 28px);
        padding: clamp(20px, 3vw, 44px);
        visibility: hidden;
        clip-path: inset(100% 0% 0% 0%);

        &.is-active {
            visibility: visible;
            clip-path: inset(0% 0% 0% 0%);
            transition: clip-path 1s var(--ease-out);
            z-index: 2;

            .shot img {
                transform: scale(1);
            }
            .info > * {
                opacity: 1;
                transform: none;
            }
        }
    }

    .frame {
        position: relative;
        flex: 0 1 auto;
        width: 100%;
        max-height: 58%;
        aspect-ratio: 16 / 9;
        margin: 0 auto;
        border-radius: 10px;
        overflow: hidden;
        background: #0e0e0e;
        /* lime rim light */
        box-shadow: 0 0 0 1px rgba(196, 255, 0, 0.22), 0 24px 60px rgba(0, 0, 0, 0.5), 0 0 60px -20px rgba(196, 255, 0, 0.25);
    }
    .frame.browser {
        display: flex;
        flex-direction: column;
    }
    .chrome {
        display: flex;
        align-items: center;
        gap: 6px;
        height: 30px;
        flex: 0 0 30px;
        padding: 0 12px;
        background: #1b1b1b;
        border-bottom: 1px solid var(--c-line);

        i {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #3a3a3a;
        }
        .url {
            ${mono}
            margin-inline-start: 10px;
            font-size: 12px;
            color: var(--c-text-muted);
        }
    }
    .shot {
        position: relative;
        flex: 1;
        height: 100%;
        overflow: hidden;

        img {
            object-fit: cover;
            transform: scale(1.08);
            transition: transform 1.4s var(--ease-out);
        }
    }
    /* controlled tone for the bright mint Noon mockups */
    .tone-mint .shot img {
        filter: saturate(0.35) brightness(0.46) contrast(1.3);
    }
    .tone-mint .shot::after {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(196, 255, 0, 0.08);
        mix-blend-mode: overlay;
        pointer-events: none;
    }

    .info {
        display: grid;
        gap: 10px;
        max-width: 66ch;

        > * {
            opacity: 0;
            transform: translateY(14px);
            transition: opacity 0.6s var(--ease-out) 0.25s, transform 0.8s var(--ease-out) 0.25s;
        }
    }
    .meta {
        ${mono}
        display: flex;
        gap: 14px;
        margin: 0;
        font-size: 12px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--c-text-muted);

        .num {
            color: var(--c-accent);
        }
    }
    .title {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 6px 16px;
        margin: 0;
        font-size: clamp(3rem, 4vw, 4rem);
        font-weight: 500;
        line-height: 1;
        letter-spacing: -0.03em;
        color: var(--c-text);

        .app {
            ${mono}
            font-size: 13px;
            font-weight: 400;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--c-accent);
        }
    }
    .desc {
        margin: 0;
        font-size: 17px;
        line-height: 1.55;
        color: #d6d6d6;
    }
    .stack {
        ${mono}
        margin: 0;
        font-size: 13px;
        letter-spacing: 0.04em;
        color: var(--c-text-muted);
    }
    .row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        margin-top: 4px;
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
    .details {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 44px;
        padding: 0 20px;
        border-radius: 999px;
        background: var(--c-accent);
        color: #111;
        font-weight: 500;
        text-decoration: none;
        transition: transform 0.3s var(--ease-out);

        &:hover {
            transform: translateY(-2px);
        }
        &:focus-visible {
            outline: 2px solid var(--c-text);
            outline-offset: 3px;
        }
    }

    .mini-index {
        display: none;
    }

    /* ---------- phones + reduced motion: every project is a full card, no pin ---------- */
    @media ${stacked} {
        display: block;
        height: auto;
        min-height: 0;

        .stage-nav {
            display: none;
        }
        .slides {
            height: auto;
            display: grid;
            gap: var(--sp-8);
            background: none;
            border: 0;
            border-radius: 0;
            overflow: visible;

            &::before {
                content: none;
            }
        }
        .slide,
        .slide.is-active {
            position: relative;
            inset: auto;
            visibility: visible;
            clip-path: none;
            transition: none;
            padding: 0;

            .shot img {
                transform: none;
                transition: none;
            }
            .info > * {
                opacity: 1;
                transform: none;
                transition: none;
            }
        }
        .frame {
            max-height: none;
        }
        .title {
            font-size: clamp(2.25rem, 9vw, 3rem);
        }
        .desc {
            font-size: 16px;
        }
    }

    @media ${device.sm} {
        .mini-index {
            position: sticky;
            top: 72px;
            z-index: 5;
            display: grid;
            grid-template-columns: auto 1fr auto;
            align-items: center;
            gap: 12px;
            margin: 0 calc(-1 * var(--gutter, 20px)) var(--sp-4);
            padding: 10px var(--gutter, 20px);
            background: rgba(22, 22, 22, 0.94);
            backdrop-filter: blur(14px);
            border-bottom: 1px solid var(--c-line);
            ${mono}
            font-size: 12px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--c-text);

            .mi-num span {
                color: var(--c-text-muted);
            }
            .mi-bar {
                height: 1px;
                background: var(--c-line-strong);

                span {
                    display: block;
                    height: 100%;
                    background: var(--c-accent);
                    transform-origin: left;
                    transition: transform 0.4s var(--ease-out);
                }
            }
            .mi-name {
                color: var(--c-accent);
            }
        }
        .details {
            width: 100%;
            justify-content: center;
        }
        .frame {
            aspect-ratio: 4 / 3;
        }
    }
`
