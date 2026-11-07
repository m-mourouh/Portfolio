'use client'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { heroStack, runRequest, LAYERS } from '@/lib/heroStack'
import type { LayerInfo } from '@/lib/heroLayers'

/**
 * HTML labels anchored to the 3D plates (positions come from the scene every frame).
 * Real buttons: hover / focus highlights the layer and shows what I do there; click sends a
 * request. As the hero scrolls away, each tag hands over to its Expertise-map name.
 */
export default function HeroLayers({ layers, label, request }: { layers: LayerInfo[]; label: string; request: string }) {
    const root = useRef<HTMLDivElement>(null)
    const items = useRef<Array<HTMLButtonElement | null>>([])
    const desc = useRef<HTMLParagraphElement>(null)
    const trail = useRef<HTMLParagraphElement>(null)

    useEffect(() => {
        const el = root.current
        if (!el) return
        let raf = 0
        let running = false
        let lastFocus = -2
        const tick = () => {
            const s = heroStack
            el.style.opacity = s.visible && s.explode < 0.95 ? '1' : '0'
            el.style.setProperty('--explode', s.explode.toFixed(3))
            const maxX = el.clientWidth - 150
            // LTR: labels start right of the plate; RTL: they end left of it
            const place = (x: number, y: number) =>
                s.rtl ? `translate(${Math.max(x - 14, 150)}px, ${y}px) translateX(-100%)` : `translate(${Math.min(x + 14, maxX)}px, ${y}px)`
            items.current.forEach((b, i) => {
                if (!b) return
                const a = s.anchors[i]
                b.style.transform = `${place(a.x, a.y)} translateY(-50%)`
                b.classList.toggle('is-on', s.focus === i || s.lit[i] > 0.35)
                b.classList.toggle('is-dim', s.focus >= 0 && s.focus !== i)
            })
            if (s.focus !== lastFocus) {
                lastFocus = s.focus
                el.classList.toggle('has-focus', s.focus >= 0)
                if (desc.current && s.focus >= 0) desc.current.textContent = layers[s.focus].desc
            }
            if (desc.current && s.focus >= 0) {
                const a = s.anchors[s.focus]
                desc.current.style.transform = s.rtl
                    ? `translate(${Math.max(a.x - 14, 296)}px, ${a.y + 18}px) translateX(-100%)`
                    : `translate(${Math.min(a.x + 14, maxX - 140)}px, ${a.y + 18}px)`
            }
            if (trail.current) {
                // above the top plate, where the request enters
                const b = s.anchors[LAYERS.length - 1]
                trail.current.style.transform = s.rtl
                    ? `translate(${Math.max(b.x + 220, 340)}px, ${b.y - 70}px) translateX(-100%)`
                    : `translate(${Math.min(b.x - 220, maxX - 300)}px, ${b.y - 70}px)`
                Array.from(trail.current.children).forEach((c, k) => {
                    if (k === 0) return
                    const layer = LAYERS.length - k // spans are top → bottom
                    c.classList.toggle('is-on', s.step >= 0 && layer >= s.step)
                })
            }
            raf = requestAnimationFrame(tick)
        }
        // only while the hero is on screen
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !running) {
                running = true
                raf = requestAnimationFrame(tick)
            } else if (!e.isIntersecting && running) {
                running = false
                cancelAnimationFrame(raf)
            }
        })
        io.observe(el)
        return () => {
            io.disconnect()
            cancelAnimationFrame(raf)
            heroStack.keyFocus = false
        }
    }, [layers])

    const enter = (i: number) => {
        heroStack.keyFocus = true
        heroStack.focus = i
    }
    const leave = () => {
        heroStack.keyFocus = false
        heroStack.focus = -1
    }

    return (
        <Overlay ref={root} role="group" aria-label={label}>
            {layers.map((l, i) => (
                <button
                    key={l.tag}
                    ref={(b) => {
                        items.current[i] = b
                    }}
                    type="button"
                    className="layer"
                    aria-label={`${l.tag}, ${l.name}: ${l.desc}`}
                    onMouseEnter={() => enter(i)}
                    onMouseLeave={leave}
                    onFocus={() => enter(i)}
                    onBlur={leave}
                    onClick={runRequest}
                >
                    <span className="tag">{l.tag}</span>
                    <span className="name" aria-hidden="true">
                        {l.name}
                    </span>
                </button>
            ))}
            <p ref={desc} className="desc" aria-hidden="true" />
            <p ref={trail} className="trail" aria-hidden="true">
                <span className="req">{request}</span>
                {[...layers].reverse().map((l) => (
                    <span key={l.tag}>{l.tag}</span>
                ))}
            </p>
        </Overlay>
    )
}

const Overlay = styled.div`
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.6s ease;
    --explode: 0;

    .layer,
    .desc,
    .trail {
        position: absolute;
        left: 0;
        top: 0;
        will-change: transform;
    }

    .layer {
        pointer-events: auto;
        display: grid;
        padding: 6px 10px;
        border: 1px solid var(--c-line-strong);
        border-radius: 4px;
        background: rgba(18, 18, 18, 0.82);
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 12px;
        letter-spacing: 0.14em;
        line-height: 1.2;
        color: var(--c-text-muted);
        cursor: pointer;
        transition: color 0.25s ease, border-color 0.25s ease, opacity 0.25s ease;

        /* the tag hands over to its Expertise-map name as the layers separate */
        .tag,
        .name {
            grid-area: 1 / 1;
            white-space: nowrap;
            transition: opacity 0.2s linear;
        }
        .tag {
            opacity: calc(1 - var(--explode) * 2.5);
        }
        .name {
            opacity: calc(var(--explode) * 2.5 - 1);
            letter-spacing: 0.06em;
            text-transform: uppercase;
        }

        &.is-on {
            color: var(--c-accent);
            border-color: var(--c-accent);
        }
        &.is-dim {
            opacity: 0.4;
        }
        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: 3px;
        }
    }

    .desc {
        max-width: 280px;
        margin: 0;
        padding-top: 6px;
        font-size: 13px;
        line-height: 1.45;
        color: var(--c-text);
        opacity: 0;
        transition: opacity 0.25s ease;
        text-shadow: 0 1px 8px #161616;
    }
    &.has-focus .desc {
        opacity: 1;
    }

    .trail {
        margin: 0;
        display: flex;
        gap: 8px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 12px;
        letter-spacing: 0.12em;
        color: var(--c-text-muted);
        white-space: nowrap;
        opacity: calc(1 - var(--explode) * 3);

        span + span::before {
            content: '→ ';
            color: var(--c-text-muted);
        }
        html[dir='rtl'] & span + span::before {
            content: '← ';
        }
        .req {
            color: var(--c-text);
        }
        .is-on {
            color: var(--c-accent);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`
