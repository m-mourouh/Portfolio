'use client'
import { CSSProperties, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import career from '@/data/career.json'
import { device } from '@/styles/styled-components/Breakpoints'

/**
 * Career as a system path: a blueprint line on a real time axis (gaps stay visible), lime
 * nodes, a pulse that travels along it as the section scrolls into view. Nodes expand on
 * hover / focus / tap. Phones: a vertical timeline. Data: data/career.json only.
 */

type Lang = 'en' | 'fr' | 'ar'
type Role = { id: string; role: string; company: string; location: string; start: string; end: string | null; summary: Record<Lang, string> | null }
const roles = career.data as Role[]

const months = (ym: string) => {
    const [y, m] = ym.split('-').map(Number)
    return y * 12 + m - 1
}
// axis: first start → January after the latest start (deterministic: no "now" in render)
const AXIS_START = months(roles[0].start)
const END_YEAR = Math.max(...roles.map((r) => Number(r.start.slice(0, 4)))) + 1
const AXIS_END = END_YEAR * 12
const pos = (ym: string | null) => (ym ? (months(ym) - AXIS_START) / (AXIS_END - AXIS_START) : 1)
const YEARS = Array.from({ length: END_YEAR - Number(roles[0].start.slice(0, 4)) }, (_, i) => Number(roles[0].start.slice(0, 4)) + 1 + i)
const LOCALE: Record<Lang, string> = { en: 'en-US', fr: 'fr-FR', ar: 'ar-MA' }

export default function CareerPath({ lang, labels }: { lang: Lang; labels: { title: string; present: string; list: string } }) {
    const root = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState(roles.length - 1)
    const fine = useRef(false)

    const fmt = (ym: string | null) => {
        if (!ym) return labels.present
        const [y, m] = ym.split('-').map(Number)
        return new Intl.DateTimeFormat(LOCALE[lang], { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, 1)))
    }
    const dates = (r: Role) => `${fmt(r.start)} – ${fmt(r.end)}`

    // the pulse: scroll-linked progress along the path; nodes light up as it passes them
    useEffect(() => {
        fine.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches
        const el = root.current
        if (!el) return
        const nodes = Array.from(el.querySelectorAll<HTMLElement>('.node'))
        const set = (p: number) => {
            el.style.setProperty('--p', p.toFixed(4))
            const vertical = window.matchMedia(device.sm).matches
            nodes.forEach((n, i) => n.classList.toggle('lit', p >= (vertical ? i / (nodes.length - 1) : pos(roles[i].start)) - 0.001))
        }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            set(1)
            el.classList.add('static')
            return
        }
        set(0)
        gsap.registerPlugin(ScrollTrigger)
        const st = ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            end: 'bottom 60%',
            scrub: 0.8,
            onUpdate: (self) => set(self.progress),
            onRefresh: (self) => set(self.progress),
        })
        return () => st.kill()
    }, [])

    const detail = (r: Role) => (
        <>
            <span className="d-role">{r.role}</span>
            <span className="d-meta">
                {r.company} · {r.location}
            </span>
            <span className="d-meta mono">{dates(r)}</span>
            {r.summary && <span className="d-sum">{r.summary[lang] || r.summary.en}</span>}
        </>
    )

    return (
        <Path ref={root} className="career" style={{ ['--p' as string]: 1 } as CSSProperties}>
            <h3 className="career-title">{labels.title}</h3>

            {/* text alternative: the whole path as a plain ordered list */}
            <ol className="sr-only" aria-label={labels.list}>
                {roles.map((r) => (
                    <li key={r.id}>
                        {r.role}, {r.company}, {r.location}. {dates(r)}.{r.summary ? ` ${r.summary[lang] || r.summary.en}` : ''}
                    </li>
                ))}
            </ol>

            <div className="track" aria-hidden="true">
                <span className="line" />
                {roles.map((r) => (
                    <span key={r.id} className={`span${r.end ? '' : ' ongoing'}`} style={{ left: `${pos(r.start) * 100}%`, width: `${(pos(r.end) - pos(r.start)) * 100}%` }} />
                ))}
                <span className="progress" />
                {YEARS.map((y) => (
                    <span key={y} className="tick" style={{ left: `${pos(`${y}-01`) * 100}%` }}>
                        {y}
                    </span>
                ))}
                <span className="pulse" />
            </div>

            <ul className="nodes">
                {roles.map((r, i) => (
                    <li
                        key={r.id}
                        className={`node row-${i % 2}${r.end ? '' : ' present'}${active === i ? ' on' : ''}${pos(r.start) > 0.75 ? ' flip' : ''}`}
                        style={{ ['--x' as string]: pos(r.start) } as CSSProperties}
                    >
                        <button
                            type="button"
                            aria-pressed={active === i}
                            aria-label={`${r.role}, ${r.company}, ${dates(r)}`}
                            onMouseEnter={() => fine.current && setActive(i)}
                            onFocus={() => setActive(i)}
                            onClick={() => setActive(i)}
                        >
                            <span className="dot" />
                            <span className="when">{r.end ? `${r.start.slice(0, 4)} – ${r.end.slice(0, 4)}` : `${r.start.slice(0, 4)} – ${labels.present}`}</span>
                            <span className="who">{r.company}</span>
                        </button>
                        {/* phones: details open inline under the node */}
                        <span className="inline-detail" hidden={active !== i}>
                            {detail(r)}
                        </span>
                    </li>
                ))}
            </ul>

            <p className="panel" aria-live="polite">
                {detail(roles[active])}
            </p>
        </Path>
    )
}

const mono = `font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;`

const Path = styled.div`
    --p: 0;
    position: relative;

    .career-title {
        ${mono}
        margin: 0 0 var(--sp-4);
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--c-text-muted);
    }

    /* ---------- horizontal blueprint (desktop / tablet) ---------- */
    .track {
        position: relative;
        height: 1px;
        margin: 0 0 0;

        .line {
            position: absolute;
            inset: 0;
            background: var(--c-line-strong);
        }
        .span {
            position: absolute;
            top: -1px;
            height: 3px;
            background: rgba(196, 255, 0, 0.28);

            &.ongoing {
                background: linear-gradient(90deg, rgba(196, 255, 0, 0.55), rgba(196, 255, 0, 0));
            }
        }
        .progress {
            position: absolute;
            left: 0;
            top: 0;
            height: 1px;
            width: calc(var(--p) * 100%);
            background: var(--c-accent);
        }
        .tick {
            position: absolute;
            bottom: 10px;
            transform: translateX(-50%);
            ${mono}
            font-size: 12px;
            color: var(--c-text-muted);

            &::after {
                content: '';
                position: absolute;
                left: 50%;
                top: calc(100% + 4px);
                width: 1px;
                height: 6px;
                background: var(--c-line-strong);
            }
        }
        .pulse {
            position: absolute;
            top: 50%;
            left: calc(var(--p) * 100%);
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: #d9ff40;
            box-shadow: 0 0 12px 3px rgba(196, 255, 0, 0.55);
            transform: translate(-50%, -50%);
            opacity: calc(1 - var(--p) * var(--p) * var(--p));
        }
    }
    &.static .track .pulse {
        display: none;
    }

    .nodes {
        position: relative;
        list-style: none;
        margin: 0;
        padding: 0;
        height: 138px;
    }
    .node {
        position: absolute;
        top: 0;
        left: calc(var(--x) * 100%);

        button {
            position: relative;
            display: grid;
            gap: 4px;
            min-height: 44px;
            padding: 30px 12px 6px 0;
            margin-left: -5px;
            text-align: start;
            background: none;
            border: 0;
            color: inherit;
            cursor: pointer;

            /* stem from the line down to the label */
            &::before {
                content: '';
                position: absolute;
                left: 4px;
                top: 0;
                height: 24px;
                width: 1px;
                background: var(--c-line-strong);
                transition: background 0.3s ease;
            }
            &:focus-visible {
                outline: 2px solid var(--c-accent);
                outline-offset: 4px;
                border-radius: 4px;
            }
        }
        &.row-1 button {
            padding-top: 76px;
            &::before {
                height: 70px;
            }
        }
        &.flip button {
            margin-left: 0;
            padding-right: 0;
            text-align: end;
            transform: translateX(calc(-100% + 5px));
            &::before {
                left: auto;
                right: 4px;
            }
        }

        .dot {
            position: absolute;
            left: 0;
            top: -5px;
            width: 9px;
            height: 9px;
            border-radius: 2px;
            border: 1px solid var(--c-text-muted);
            background: #161616;
            transition: background 0.3s ease, border-color 0.3s ease;
        }
        &.flip .dot {
            left: auto;
            right: 0;
        }
        .when {
            ${mono}
            font-size: 12px;
            letter-spacing: 0.08em;
            color: var(--c-text-muted);
            white-space: nowrap;
        }
        .who {
            font-size: 15px;
            font-weight: 500;
            color: var(--c-text);
            white-space: nowrap;
        }

        &.lit .dot {
            background: var(--c-accent);
            border-color: var(--c-accent);
        }
        &.on button::before {
            background: var(--c-accent);
        }
        &.on .who {
            color: var(--c-accent);
        }

        /* the current role: lime, with a subtle live pulse */
        &.present .dot {
            background: var(--c-accent);
            border-color: var(--c-accent);

            &::after {
                content: '';
                position: absolute;
                inset: -5px;
                border-radius: 4px;
                border: 1px solid var(--c-accent);
                animation: present-pulse 2.4s ease-out infinite;
            }
        }
        &.present .when {
            color: var(--c-accent);
        }
    }
    @keyframes present-pulse {
        0% {
            transform: scale(0.6);
            opacity: 0.9;
        }
        100% {
            transform: scale(1.6);
            opacity: 0;
        }
    }

    .inline-detail {
        display: none;
    }

    .panel {
        display: grid;
        gap: 4px;
        min-height: 7.5em; /* reserved: switching roles never shifts the layout */
        max-width: 62ch;
        margin: var(--sp-2) 0 0;
        padding-top: var(--sp-2);
        border-top: 1px solid var(--c-line);
    }
    .d-role {
        font-size: 18px;
        font-weight: 500;
        color: var(--c-text);
    }
    .d-meta {
        font-size: 14px;
        color: var(--c-text-muted);
    }
    .d-meta.mono {
        ${mono}
        font-size: 12px;
        letter-spacing: 0.06em;
    }
    .d-sum {
        margin-top: 4px;
        font-size: 15px;
        line-height: 1.55;
        color: var(--c-text);
    }

    /* ---------- phones: vertical timeline, details inline ---------- */
    @media ${device.sm} {
        .track,
        .panel {
            display: none;
        }
        .nodes {
            height: auto;
            padding-left: 20px;

            /* the path, and its scroll-linked progress */
            &::before,
            &::after {
                content: '';
                position: absolute;
                left: 4px;
                top: 6px;
                bottom: 6px;
                width: 1px;
                background: var(--c-line-strong);
            }
            &::after {
                bottom: auto;
                height: calc(var(--p) * (100% - 12px));
                background: var(--c-accent);
            }
        }
        .node {
            position: relative;
            left: auto;
            padding-bottom: 14px;

            button,
            &.row-1 button,
            &.flip button {
                width: 100%;
                margin: 0;
                padding: 2px 0 6px;
                transform: none;
                text-align: start;

                &::before {
                    display: none;
                }
            }
            .dot,
            &.flip .dot {
                left: -20px;
                right: auto;
                top: 7px;
            }
            .who,
            .when {
                white-space: normal;
            }
        }
        .inline-detail:not([hidden]) {
            display: grid;
            gap: 4px;
            padding: 4px 0 6px;
        }
        .inline-detail .d-role {
            font-size: 16px;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .node.present .dot::after {
            animation: none;
            opacity: 0;
        }
    }
`
