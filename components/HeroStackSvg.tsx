'use client'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { onRunRequest, runRequest, heroIntro, HERO_STACK_EVENT, emitPulse } from '@/lib/heroStack'
import type { LayerInfo } from '@/lib/heroLayers'

/**
 * The hero stack as a light SVG: phones (own band between headline and actions) and screens
 * without WebGL. Same five layers and labels; tap / focus a layer to see what I do there and
 * send a request through the system. The request runs once after the headline reveal, then
 * only when asked (no constant animation). Reduced motion: an instant highlight, no travel.
 */

const CX = 132
// top → bottom (UI first): plate centers and half-widths
const PLATES = [
    { cy: 58, w: 60 },
    { cy: 102, w: 70 },
    { cy: 146, w: 80 },
    { cy: 190, w: 90 },
    { cy: 234, w: 100 },
]
const START = 8
const END = PLATES[PLATES.length - 1].cy
const DURATION = 2.4 // s, top → bottom
const iso = (cy: number, w: number) => `${CX - w},${cy} ${CX},${cy - w / 2} ${CX + w},${cy} ${CX},${cy + w / 2}`
const reachAt = (cy: number) => ((cy - START) / (END - START)) * DURATION

export default function HeroStackSvg({ layers, label, request, hint }: { layers: LayerInfo[]; label: string; request: string; hint: string }) {
    const top = [...layers].reverse() // UI first
    const [run, setRun] = useState(0) // 0 = the automatic run after the headline reveal
    const [focus, setFocus] = useState(-1)
    const wrap = useRef<HTMLDivElement>(null)
    const [armed, setArmed] = useState(false)
    useEffect(() => onRunRequest(() => setRun((r) => r + 1)), [])
    // tell the headline when the pulse reaches each plate (same timing as the CSS animation)
    useEffect(() => {
        if (!armed) return
        const start = run === 0 ? 0.2 : 0
        const timers = PLATES.map((p, i) => setTimeout(() => emitPulse(i), (start + reachAt(p.cy)) * 1000))
        return () => timers.forEach(clearTimeout)
    }, [run, armed])
    // the first request runs when the hero timeline activates the stack
    useEffect(() => {
        if (heroIntro.stack) return setArmed(true)
        const on = () => setArmed(true)
        window.addEventListener(HERO_STACK_EVENT, on)
        const failsafe = setTimeout(on, 5000)
        return () => {
            window.removeEventListener(HERO_STACK_EVENT, on)
            clearTimeout(failsafe)
        }
    }, [])
    // replay the request (restarting the CSS animations keeps keyboard focus, unlike a remount)
    useEffect(() => {
        if (run === 0 || !wrap.current?.getAnimations) return
        wrap.current.getAnimations({ subtree: true }).forEach((a) => {
            a.cancel()
            a.play()
        })
    }, [run])

    const select = (i: number) => {
        setFocus(i)
        runRequest()
    }

    return (
        <Wrap ref={wrap} className={`${focus >= 0 ? 'has-focus' : ''}${armed ? ' armed' : ''}`} style={{ ['--start' as string]: run === 0 ? '0.2s' : '0s' }}>
            <svg viewBox="0 0 330 300" role="group" aria-label={label}>
                {/* the request path through the center of every layer */}
                <line x1={CX} y1={START} x2={CX} y2={END} className="req-path" />
                {top
                    .map((l, i) => ({ l, i, p: PLATES[i] }))
                    .reverse() // draw the bottom plate first
                    .map(({ l, i, p }) => (
                        <g
                            key={l.tag}
                            className={`plate${focus === i ? ' on' : ''}`}
                            style={{ ['--d' as string]: `${reachAt(p.cy).toFixed(2)}s` }}
                            role="button"
                            tabIndex={0}
                            aria-pressed={focus === i}
                            aria-label={`${l.tag}, ${l.name}: ${l.desc}`}
                            onClick={() => select(i)}
                            onFocus={() => setFocus(i)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    select(i)
                                }
                            }}
                        >
                            <polygon points={iso(p.cy + 5, p.w)} className="side" />
                            <polygon points={iso(p.cy, p.w)} className="face" />
                            <polyline points={`${CX - p.w * 0.55},${p.cy} ${CX},${p.cy - p.w * 0.14} ${CX + p.w * 0.4},${p.cy + p.w * 0.05}`} className="trace" />
                            <rect x={CX - 2.5} y={p.cy - 2.5} width="5" height="5" className="node" />
                            <line x1={CX + p.w + 4} y1={p.cy} x2={CX + p.w + 16} y2={p.cy} className="tick" />
                            <text x={CX + p.w + 20} y={p.cy + 4} className="tag">
                                {l.tag}
                            </text>
                        </g>
                    ))}
                <circle cx={CX} cy={START} r="5" className="pulse" />
            </svg>
            {/* one reserved slot: the request trail, or the tapped layer's description */}
            <div className="caption">
                <p className="trail" aria-hidden="true" hidden={focus >= 0}>
                    <span className="req">{request}</span>
                    {top.map((l, i) => (
                        <span key={l.tag} style={{ ['--d' as string]: `${reachAt(PLATES[i].cy).toFixed(2)}s` }}>
                            {l.tag}
                        </span>
                    ))}
                </p>
                <p className="desc" aria-live="polite">
                    {focus >= 0 ? (
                        <>
                            <b>{top[focus].name}</b> — {top[focus].desc}
                        </>
                    ) : (
                        <span className="hint">{hint}</span>
                    )}
                </p>
            </div>
        </Wrap>
    )
}

const Wrap = styled.div`
    --start: 1.9s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    svg {
        width: min(74vw, 300px);
        height: auto;
        overflow: visible;
        direction: ltr; /* the drawing and its tags never mirror */
    }

    /* nothing runs before the hero timeline activates the stack */
    &:not(.armed) .face,
    &:not(.armed) .tag,
    &:not(.armed) .pulse,
    &:not(.armed) .trail span {
        animation: none !important;
    }

    .req-path {
        stroke: rgba(196, 255, 0, 0.35);
        stroke-width: 1;
        stroke-dasharray: 3 4;
    }
    .plate {
        cursor: pointer;
        outline: none;
        transition: opacity 0.3s ease;
    }
    &.has-focus .plate:not(.on) {
        opacity: 0.4;
    }
    .face {
        fill: #121212;
        stroke: rgba(255, 255, 255, 0.4);
        stroke-width: 0.8;
        /* lights up when the request reaches this layer */
        animation: layer-lit 1.4s ease-out calc(var(--start) + var(--d));
    }
    .side {
        fill: #0b0b0b;
        stroke: rgba(255, 255, 255, 0.16);
        stroke-width: 0.6;
    }
    .trace {
        fill: none;
        stroke: rgba(255, 255, 255, 0.28);
        stroke-width: 0.7;
    }
    .node {
        fill: #c4ff00;
    }
    .tick {
        stroke: rgba(255, 255, 255, 0.35);
        stroke-width: 1;
    }
    .tag {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 12px;
        letter-spacing: 0.12em;
        fill: #b4b4b4;
        animation: tag-lit 1.4s ease-out calc(var(--start) + var(--d));
    }
    .plate.on .face,
    .plate:focus-visible .face {
        stroke: #c4ff00;
        stroke-width: 1.4;
    }
    .plate.on .tag,
    .plate:focus-visible .tag {
        fill: #c4ff00;
    }

    .pulse {
        fill: #d9ff40;
        opacity: 0;
        filter: drop-shadow(0 0 6px #c4ff00);
        animation: request ${DURATION}s linear var(--start);
    }

    @keyframes request {
        0% {
            opacity: 0;
            transform: translateY(0);
        }
        8%,
        92% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translateY(${END - START}px);
        }
    }
    @keyframes layer-lit {
        0% {
            stroke: #c4ff00;
            stroke-width: 1.6;
            fill: #1d2210;
        }
    }
    @keyframes tag-lit {
        0% {
            fill: #c4ff00;
        }
    }

    .caption {
        min-height: 3.2em; /* reserved: changing text never shifts the layout */
        max-width: 36ch;
        font-size: 13px;
        line-height: 1.45;
        text-align: center;
        color: var(--c-text-muted);

        p {
            margin: 0;
        }
        .trail[hidden] {
            display: none;
        }
        .hint {
            font-size: 12px;
        }
        b {
            color: var(--c-accent);
            font-weight: 600;
        }
    }

    .trail {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 6px;
        margin: 0;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 12px;
        letter-spacing: 0.1em;
        color: var(--c-text-muted);

        span + span::before {
            content: '→ ';
        }
        html[dir='rtl'] & span + span::before {
            content: '← ';
        }
        span + span {
            animation: tag-on 1.6s ease-out calc(var(--start) + var(--d));
        }
        .req {
            color: var(--c-text);
        }
    }
    @keyframes tag-on {
        0%,
        70% {
            color: #c4ff00;
        }
    }

    /* reduced motion: no travelling pulse, every layer highlights at once */
    @media (prefers-reduced-motion: reduce) {
        .pulse {
            display: none;
        }
        .face,
        .tag,
        .trail span + span {
            animation-delay: 0s;
        }
    }
`
