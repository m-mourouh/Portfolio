'use client'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiArrowUpRight } from 'react-icons/fi'
import { LAYERS, STACK_LAYERS, CONNECTIONS, LayerId, techIn, traceProjects, traceOf, Tech } from '@/lib/expertise'
import { pick } from '@/lib/projects'
import { useLanguage } from '@/contexts/LanguageContext'
import { device } from '@/styles/styled-components/Breakpoints'
import ToolIcon from '../ToolIcons'

/**
 * One architecture, the same layers as the hero (UI → API → Services → Data → AI) plus the
 * cross-cutting Delivery band. Select a layer (click / tap / Enter, arrows to move, Escape to
 * reset): it lights up with its technologies and connections, the rest dims. "Trace a project"
 * sends the hero's lime pulse through the layers its recorded stack really uses.
 */

const ORDER: LayerId[] = LAYERS.map((l) => l.id)

export default function Architecture({ highlightTech }: { highlightTech: string | null }) {
    const { t, language } = useLanguage()
    const [selected, setSelected] = useState<LayerId | null>(null)
    const [traceId, setTraceId] = useState<string | null>(null)
    const [arrived, setArrived] = useState<Set<LayerId>>(new Set())
    const root = useRef<HTMLDivElement>(null)
    const pulse = useRef<HTMLLIElement>(null)
    const buttons = useRef<Partial<Record<LayerId, HTMLButtonElement | null>>>({})

    const project = traceProjects.find((p) => p.id === traceId) || null
    const trace = useMemo(() => (project ? traceOf(project) : null), [project])

    // what is lit
    const layerOn = (id: LayerId) => (trace ? arrived.has(id) : selected === id)
    const dimmed = (id: LayerId) => (trace ? !trace.layers.has(id) : selected !== null && selected !== id)
    const techOn = (tech: Tech) =>
        tech.name === highlightTech || (trace ? trace.techs.includes(tech) && arrived.has(tech.layer) : selected === tech.layer)
    const linkOn = (c: (typeof CONNECTIONS)[number]) =>
        trace ? arrived.has(c.from) && arrived.has(c.to) : selected !== null && (c.from === selected || c.to === selected)

    // scroll-in: the diagram draws itself (layers appear, connections draw). Cleaned up on unmount.
    useEffect(() => {
        const el = root.current
        if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        gsap.registerPlugin(ScrollTrigger)
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 75%', once: true }, defaults: { ease: 'expo.out' } })
            tl.fromTo('.plate', { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.9, stagger: 0.08 })
                .fromTo('.link .wire', { scaleY: 0 }, { scaleY: 1, duration: 0.6, stagger: 0.08, transformOrigin: 'top' }, 0.2)
                .fromTo('.band', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9 }, 0.3)
        }, el)
        return () => ctx.revert()
    }, [])

    // trace: the pulse travels down the spine through the layers the project really uses
    useEffect(() => {
        const el = root.current
        const dot = pulse.current
        if (!trace || !el || !dot) {
            setArrived(new Set())
            return
        }
        const stops = STACK_LAYERS.map((l) => l.id).filter((id) => trace.layers.has(id))
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (reduced || !stops.length) {
            setArrived(new Set(trace.layers))
            return
        }
        setArrived(new Set())
        const spine = el.querySelector<HTMLElement>('.stack')!
        const yOf = (id: LayerId) => {
            const b = buttons.current[id]
            return b ? b.getBoundingClientRect().top - spine.getBoundingClientRect().top + b.offsetHeight / 2 : 0
        }
        const tl = gsap.timeline()
        tl.set(dot, { y: yOf(stops[0]) - 40, opacity: 0 }).to(dot, { opacity: 1, duration: 0.2 })
        stops.forEach((id) => {
            tl.to(dot, { y: yOf(id), duration: 0.45, ease: 'power2.inOut' }).add(() => setArrived((a) => new Set(a).add(id)))
        })
        tl.to(dot, { opacity: 0, duration: 0.4 }, '+=0.4').add(() => setArrived(new Set(trace.layers)))
        return () => {
            tl.kill()
        }
    }, [trace])

    // keyboard: arrows move between layers, Enter / Space select (native button), Escape resets
    const onKeyDown = (e: React.KeyboardEvent) => {
        const current = ORDER.findIndex((id) => buttons.current[id] === document.activeElement)
        if (e.key === 'Escape') {
            setSelected(null)
            setTraceId(null)
            return
        }
        if (current < 0) return
        const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0
        if (!step) return
        e.preventDefault()
        buttons.current[ORDER[(current + step + ORDER.length) % ORDER.length]]?.focus()
    }

    const select = (id: LayerId) => {
        setTraceId(null)
        setSelected((s) => (s === id ? null : id))
    }

    const layerName = (id: LayerId) => LAYERS.find((l) => l.id === id)!.name
    const techList = (list: Tech[]) => {
        const core = list.filter((x) => x.tier === 'core')
        const broad = list.filter((x) => x.tier === 'broad')
        const chips = (items: Tech[]) => (
            <ul className="p-chips">
                {items.map((x) => (
                    <li key={x.name} className={techOn(x) ? 'on' : ''}>
                        <ToolIcon tool={x.name} /> {x.name}
                    </li>
                ))}
            </ul>
        )
        // tiers only once they are decided in the data; otherwise one neutral list
        if (!core.length && !broad.length) return chips(list)
        return (
            <>
                {core.length > 0 && (
                    <>
                        <h4>{t('skills.daily')}</h4>
                        {chips(core)}
                    </>
                )}
                {(broad.length > 0 || core.length < list.length) && (
                    <>
                        <h4>{t('skills.also')}</h4>
                        {chips(list.filter((x) => x.tier !== 'core'))}
                    </>
                )}
            </>
        )
    }

    const panelFor = (id: LayerId) => (
        <>
            <p className="p-kicker">{id === 'delivery' ? t('skills.crossCutting') : `${String(ORDER.indexOf(id) + 1).padStart(2, '0')} / 05`}</p>
            <h3 className="p-title">{layerName(id)}</h3>
            <p className="p-desc">{t(`skills.layer.${id}`)}</p>
            {techList(techIn(id))}
            {CONNECTIONS.some((c) => c.from === id || c.to === id) && (
                <>
                    <h4>{t('skills.connections')}</h4>
                    <ul className="p-links">
                        {CONNECTIONS.filter((c) => c.from === id || c.to === id).map((c) => (
                            <li key={c.from + c.to}>
                                ↔ {layerName(c.from === id ? c.to : c.from)} <em>{t(`skills.links2.${c.label}`)}</em>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </>
    )

    return (
        <Wrap ref={root}>
            {/* trace a project */}
            <div className="trace" role="group" aria-label={t('skills.trace')}>
                <span className="trace-label">{t('skills.trace')}</span>
                <div className="trace-chips">
                    {[null, ...traceProjects].map((p) => (
                        <button
                            key={p?.id ?? 'none'}
                            type="button"
                            aria-pressed={traceId === (p?.id ?? null)}
                            onClick={() => {
                                setSelected(null)
                                setTraceId(p?.id ?? null)
                            }}
                        >
                            {p ? p.name : t('skills.traceNone')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="body">
                <div className={`diagram${trace ? ' is-tracing' : ''}${selected ? ' has-selection' : ''}`} role="group" aria-label={t('skills.diagram')} onKeyDown={onKeyDown}>
                    <ol className="stack">
                        <li ref={pulse} className="pulse" aria-hidden="true" />
                        {STACK_LAYERS.map((l, i) => {
                            const techs = techIn(l.id)
                            const link = CONNECTIONS.find((c) => c.from === l.id)
                            return (
                                <Fragment key={l.id}>
                                    <li className={`plate${layerOn(l.id) ? ' is-on' : ''}${dimmed(l.id) ? ' is-dim' : ''}`}>
                                        <button
                                            ref={(b) => {
                                                buttons.current[l.id] = b
                                            }}
                                            type="button"
                                            className="plate-btn"
                                            aria-pressed={selected === l.id}
                                            aria-expanded={selected === l.id}
                                            onClick={() => select(l.id)}
                                        >
                                            <span className="node" aria-hidden="true" />
                                            <span className="p-num">{String(i + 1).padStart(2, '0')}</span>
                                            <span className="p-name">{l.name}</span>
                                            <span className="p-count">
                                                {String(techs.length).padStart(2, '0')} {t('skills.technologies')}
                                            </span>
                                        </button>
                                        <ul className="techs" aria-label={l.name}>
                                            {techs.map((x) => (
                                                <li key={x.name} className={techOn(x) ? 'on' : ''}>
                                                    <ToolIcon tool={x.name} />
                                                    <span>{x.name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {/* phones: the layer's details open in place */}
                                        {selected === l.id && <div className="inline-panel">{panelFor(l.id)}</div>}
                                    </li>
                                    {link && (
                                        <li className={`link${linkOn(link) ? ' is-on' : ''}`} aria-hidden="true">
                                            <span className="wire" />
                                            <span className="pad">{t(`skills.links2.${link.label}`)}</span>
                                        </li>
                                    )}
                                </Fragment>
                            )
                        })}
                    </ol>

                    {/* Delivery: cross-cutting, runs alongside every layer */}
                    <div className={`band plate${layerOn('delivery') ? ' is-on' : ''}${dimmed('delivery') ? ' is-dim' : ''}`}>
                        <button
                            ref={(b) => {
                                buttons.current.delivery = b
                            }}
                            type="button"
                            className="plate-btn"
                            aria-pressed={selected === 'delivery'}
                            aria-expanded={selected === 'delivery'}
                            onClick={() => select('delivery')}
                        >
                            <span className="p-num">{t('skills.links2.delivery')}</span>
                            <span className="p-name">Delivery</span>
                            <span className="p-count">
                                {String(techIn('delivery').length).padStart(2, '0')} {t('skills.technologies')}
                            </span>
                        </button>
                        <ul className="techs" aria-label="Delivery">
                            {techIn('delivery').map((x) => (
                                <li key={x.name} className={techOn(x) ? 'on' : ''} title={x.name}>
                                    <ToolIcon tool={x.name} />
                                    <span>{x.name}</span>
                                </li>
                            ))}
                        </ul>
                        {selected === 'delivery' && <div className="inline-panel">{panelFor('delivery')}</div>}
                    </div>
                </div>

                <aside className={`panel${project ? ' is-trace' : ''}`} aria-live="polite">
                    {project && trace ? (
                        <>
                            <p className="p-kicker">{t('skills.trace')}</p>
                            <h3 className="p-title">{project.name}</h3>
                            {pick(project.category, language) && <p className="p-desc">{pick(project.category, language)}</p>}
                            <h4>{t('skills.stack')}</h4>
                            <ul className="p-chips">
                                {project.stack.map((s) => {
                                    const mapped = !trace.unmapped.includes(s)
                                    return (
                                        <li key={s} className={mapped ? 'on' : 'off'} title={mapped ? t('skills.lit') : t('skills.notMapped')}>
                                            {s}
                                        </li>
                                    )
                                })}
                            </ul>
                            <p className="p-route">
                                {STACK_LAYERS.filter((l) => trace.layers.has(l.id))
                                    .map((l) => l.name)
                                    .join(' → ')}
                            </p>
                            {trace.unmapped.length > 0 && (
                                <p className="p-note">
                                    {t('skills.notMapped')}: {trace.unmapped.join(', ')}
                                </p>
                            )}
                            <Link href={`/work/${project.id}`} className="p-cta">
                                {t('skills.viewProject')} <FiArrowUpRight aria-hidden="true" />
                            </Link>
                        </>
                    ) : selected ? (
                        panelFor(selected)
                    ) : (
                        <>
                            <p className="p-kicker">{t('skills.layersList')}</p>
                            <p className="p-desc">{t('skills.panelHint')}</p>
                            <ul className="p-overview">
                                {LAYERS.map((l) => (
                                    <li key={l.id}>
                                        <span>{l.name}</span>
                                        <span>{String(techIn(l.id).length).padStart(2, '0')}</span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </aside>
            </div>

            {/* screen readers: the whole architecture as plain lists */}
            <div className="sr-only">
                <h3>{t('skills.layersList')}</h3>
                <ul>
                    {LAYERS.map((l) => (
                        <li key={l.id}>
                            {l.name}: {t(`skills.layer.${l.id}`)}. {techIn(l.id).map((x) => x.name).join(', ')}.
                        </li>
                    ))}
                </ul>
            </div>
        </Wrap>
    )
}

const mono = `font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;`

const Wrap = styled.div`
    color: var(--c-text);

    /* ---------- trace selector ---------- */
    .trace {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px 16px;
        margin-bottom: var(--sp-4);
    }
    .trace-label {
        ${mono}
        font-size: 13px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--c-text-muted);
    }
    .trace-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        button {
            flex: 0 0 auto;
            min-height: 44px;
            padding: 0 16px;
            border-radius: 999px;
            border: 1px solid var(--c-line-strong);
            background: none;
            color: var(--c-text-muted);
            font-size: 15px;
            cursor: pointer;
            transition: color 0.25s, border-color 0.25s, background 0.25s;

            &:hover {
                color: var(--c-text);
            }
            &[aria-pressed='true'] {
                background: var(--c-accent);
                border-color: var(--c-accent);
                color: #111;
            }
            &:focus-visible {
                outline: 2px solid var(--c-accent);
                outline-offset: 2px;
            }
        }
    }

    .body {
        display: grid;
        grid-template-columns: minmax(0, 8fr) minmax(280px, 4fr);
        gap: clamp(24px, 3vw, 48px);
        align-items: start;
    }

    /* ---------- diagram ---------- */
    .diagram {
        position: relative;
        display: grid;
        grid-template-columns: minmax(0, 1fr) 164px;
        gap: 16px;
        padding: clamp(16px, 2vw, 28px);
        border: 1px solid var(--c-line);
        border-radius: 14px;
        background: radial-gradient(90% 60% at 20% 0%, rgba(196, 255, 0, 0.05), transparent 60%), #151515;
        background-image: linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
        background-size: 32px 32px;
    }
    .stack {
        position: relative;
        list-style: none;
        margin: 0;
        padding: 0;
        padding-inline-start: 26px;

        /* the spine the requests travel along */
        &::before {
            content: '';
            position: absolute;
            inset-inline-start: 7px;
            top: 30px;
            bottom: 30px;
            width: 1px;
            background: var(--c-line-strong);
        }
    }
    .pulse {
        position: absolute;
        inset-inline-start: 3px;
        top: 0;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: #d9ff40;
        box-shadow: 0 0 14px 4px rgba(196, 255, 0, 0.6);
        opacity: 0;
        z-index: 3;
        pointer-events: none;
    }

    .plate {
        position: relative;
        display: grid;
        grid-template-columns: 190px minmax(0, 1fr);
        align-items: center;
        gap: 12px 18px;
        min-height: 92px;
        padding-block: 12px;
        padding-inline: 0 16px;
        border: 1px solid var(--c-line);
        border-radius: 10px;
        background: rgba(20, 20, 20, 0.9);
        transition: opacity 0.3s var(--ease-out), border-color 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out);

        &.is-dim {
            opacity: 0.38;
        }
        &.is-on {
            border-color: var(--c-accent);
            box-shadow: 0 0 0 1px rgba(196, 255, 0, 0.25), 0 0 40px -16px rgba(196, 255, 0, 0.45);
        }
    }
    .plate-btn {
        position: relative;
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: baseline;
        gap: 2px 10px;

        .p-count {
            grid-column: 2;
        }
        min-height: 44px;
        padding-block: 6px;
        padding-inline: 18px 0;
        background: none;
        border: 0;
        color: inherit;
        text-align: start;
        cursor: pointer;

        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: 2px;
            border-radius: 6px;
        }
    }
    .node {
        position: absolute;
        inset-inline-start: -24px;
        top: 50%;
        width: 11px;
        height: 11px;
        margin-top: -5px;
        border-radius: 2px;
        border: 1px solid var(--c-text-muted);
        background: #161616;
        transition: background 0.3s, border-color 0.3s;
    }
    .plate.is-on .node {
        background: var(--c-accent);
        border-color: var(--c-accent);
    }
    .p-num {
        ${mono}
        font-size: 12px;
        letter-spacing: 0.1em;
        color: var(--c-accent);
    }
    .p-name {
        font-size: clamp(1.25rem, 1.8vw, 1.75rem);
        font-weight: 500;
        letter-spacing: -0.01em;
        color: var(--c-text);
    }
    .p-count {
        ${mono}
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--c-text-muted);
    }

    .techs {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        list-style: none;
        margin: 0;
        padding: 0;

        li {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px 9px;
            border: 1px solid var(--c-line);
            border-radius: 6px;
            font-size: 13px;
            color: var(--c-text-muted);
            transition: color 0.25s, border-color 0.25s, background 0.25s;

            svg {
                flex: 0 0 auto;
                font-size: 15px;
            }
            &.on {
                color: var(--c-text);
                border-color: rgba(196, 255, 0, 0.6);
                background: rgba(196, 255, 0, 0.06);

                svg {
                    color: var(--c-accent);
                }
            }
        }
    }

    /* connections, with a padded label that never sits on the line */
    .link {
        position: relative;
        height: 44px;
        margin-inline-start: -26px;

        .wire {
            position: absolute;
            inset-inline-start: 7px;
            top: 0;
            bottom: 0;
            width: 1px;
            background: var(--c-line-strong);
        }
        .pad {
            position: absolute;
            inset-inline-start: 44px;
            top: 50%;
            transform: translateY(-50%);
            padding: 3px 10px;
            border-radius: 4px;
            background: #151515;
            border: 1px solid var(--c-line);
            ${mono}
            font-size: 12px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--c-text-muted);
            transition: color 0.25s, border-color 0.25s;
        }
        &.is-on .wire {
            width: 2px;
            background: repeating-linear-gradient(to bottom, var(--c-accent) 0 6px, transparent 6px 11px);
            animation: wire-flow 0.8s linear infinite;
        }
        &.is-on .pad {
            color: var(--c-accent);
            border-color: rgba(196, 255, 0, 0.5);
        }
    }
    @keyframes wire-flow {
        to {
            background-position: 0 11px;
        }
    }

    /* Delivery: a vertical band beside all the layers */
    .band {
        grid-template-columns: 1fr;
        align-content: start;
        padding: 12px;
        min-height: 0;

        .plate-btn {
            grid-template-columns: 1fr;
            padding-inline-start: 4px;

            .p-num,
            .p-count {
                grid-column: 1;
            }
        }
        .techs {
            flex-direction: column;
            flex-wrap: nowrap;

            li span {
                font-size: 12px;
            }
        }
    }

    .inline-panel {
        display: none;
    }

    /* ---------- side panel ---------- */
    .panel {
        position: sticky;
        top: 110px;
        padding: clamp(20px, 2vw, 28px);
        border: 1px solid var(--c-line);
        border-left: 2px solid var(--c-accent);
        border-radius: 12px;
        background: #151515;
    }
    .p-kicker {
        ${mono}
        margin: 0 0 10px;
        font-size: 12px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--c-text-muted);
    }
    .p-title {
        margin: 0 0 8px;
        font-size: clamp(1.75rem, 2.4vw, 2.5rem);
        font-weight: 500;
        letter-spacing: -0.02em;
        color: var(--c-text);
    }
    .p-desc {
        margin: 0 0 18px;
        font-size: 16px;
        line-height: 1.55;
        color: #cfcfcf;
    }
    h4 {
        ${mono}
        margin: 18px 0 10px;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--c-text-muted);
    }
    .p-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        list-style: none;
        margin: 0;
        padding: 0;

        li {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px 10px;
            border: 1px solid var(--c-line-strong);
            border-radius: 6px;
            font-size: 14px;
            color: var(--c-text);

            &.on {
                border-color: rgba(196, 255, 0, 0.6);
                svg {
                    color: var(--c-accent);
                }
            }
            &.off {
                color: var(--c-text-muted);
                border-style: dashed;
            }
        }
    }
    .p-links {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 6px;
        font-size: 15px;

        em {
            font-style: normal;
            ${mono}
            font-size: 12px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--c-accent);
            margin-inline-start: 8px;
        }
    }
    .p-route {
        ${mono}
        margin: 16px 0 6px;
        font-size: 14px;
        letter-spacing: 0.08em;
        color: var(--c-accent);
    }
    .p-note {
        margin: 0;
        font-size: 14px;
        color: var(--c-text-muted);
    }
    .p-cta {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 44px;
        margin-top: 18px;
        padding: 0 18px;
        border-radius: 999px;
        background: var(--c-accent);
        color: #111;
        font-weight: 500;
        text-decoration: none;

        &:focus-visible {
            outline: 2px solid var(--c-text);
            outline-offset: 3px;
        }
    }
    .p-overview {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid var(--c-line);
            font-size: 16px;

            span:last-child {
                ${mono}
                color: var(--c-accent);
            }
        }
    }

    /* ---------- tablets: panel under the diagram ---------- */
    @media ${device.md} {
        .body {
            grid-template-columns: 1fr;
        }
        .panel {
            position: static;
            min-height: 0;
        }
    }

    /* ---------- phones: a vertical stack of tappable rows, details in place ---------- */
    @media ${device.sm} {
        .trace {
            flex-direction: column;
            align-items: flex-start;
        }
        .trace-chips {
            flex-wrap: nowrap;
            overflow-x: auto;
            width: calc(100% + 2 * var(--gutter, 20px));
            margin: 0 calc(-1 * var(--gutter, 20px));
            padding: 0 var(--gutter, 20px) 4px;
            scrollbar-width: none;
            -webkit-mask-image: linear-gradient(to right, #000 85%, transparent);
            mask-image: linear-gradient(to right, #000 85%, transparent);

            &::-webkit-scrollbar {
                display: none;
            }
        }
        .diagram {
            grid-template-columns: 1fr;
            padding: 14px;
        }
        .plate {
            grid-template-columns: 1fr;
            min-height: 0;
            padding-block: 6px;
            padding-inline: 0 12px;
        }
        .plate:not(.band) .techs {
            display: none;
        }
        .band {
            margin-inline-start: 26px;
            padding: 6px 12px;

            .techs {
                display: none;
            }
        }
        .inline-panel {
            display: block;
            padding-block: 4px 10px;
            padding-inline: 18px 0;

            .p-kicker,
            .p-title {
                display: none;
            }
        }
        .panel:not(.is-trace) {
            display: none;
        }
        .p-count,
        .techs li,
        .p-links em,
        .link .pad {
            font-size: 14px;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .link.is-on .wire {
            animation: none;
        }
        .plate,
        .techs li {
            transition: none;
        }
    }
`
