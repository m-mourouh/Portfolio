'use client'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { heroAnchor } from '@/lib/heroAnchor'

/**
 * The lime connection between the headline and the 3D stack: from the accent word to the
 * stack's connector node (published every frame by the scene). Runs only while the hero is
 * visible; hidden when there's no WebGL scene (anchor not visible).
 */
export default function HeroLink({ heroRef, wordRef }: { heroRef: React.RefObject<HTMLElement | null>; wordRef: React.RefObject<HTMLElement | null> }) {
    const path = useRef<SVGPathElement>(null)
    const dot = useRef<SVGRectElement>(null)
    const svg = useRef<SVGSVGElement>(null)

    useEffect(() => {
        const hero = heroRef.current
        if (!hero) return
        let raf = 0
        let running = false
        const tick = () => {
            const word = wordRef.current
            const p = path.current
            const d = dot.current
            const s = svg.current
            if (word && p && d && s) {
                const h = hero.getBoundingClientRect()
                const w = word.getBoundingClientRect()
                // start past the outer end of the accent word's line (toward the stack), so the
                // link never crosses text. LTR: the right end; RTL (Arabic): the left end
                const rtl = document.documentElement.dir === 'rtl'
                let edge = rtl ? w.left : w.right
                const line = word.closest('h1')?.querySelectorAll<HTMLElement>('.word') || []
                line.forEach((el) => {
                    const r = el.getBoundingClientRect()
                    if (Math.abs(r.top - w.top) < w.height * 0.5) edge = rtl ? Math.min(edge, r.left) : Math.max(edge, r.right)
                })
                const dir = rtl ? -1 : 1
                const x1 = edge - h.left + 14 * dir
                const y1 = w.top - h.top + w.height * 0.58
                const ax = heroAnchor.x
                const ay = heroAnchor.y
                const show = heroAnchor.visible && (ax - x1) * dir > 60
                s.style.opacity = show ? '1' : '0'
                if (show) {
                    const xm = x1 + dir * Math.min(120, Math.abs(ax - x1) * 0.35)
                    p.setAttribute('d', `M${x1} ${y1} H${xm} L${ax} ${ay}`)
                    d.setAttribute('x', String(ax - 3))
                    d.setAttribute('y', String(ay - 3))
                }
            }
            if (running) raf = requestAnimationFrame(tick)
        }
        const io = new IntersectionObserver(([e]) => {
            running = e.isIntersecting
            cancelAnimationFrame(raf)
            if (running) raf = requestAnimationFrame(tick)
        })
        io.observe(hero)
        return () => {
            running = false
            cancelAnimationFrame(raf)
            io.disconnect()
        }
    }, [heroRef, wordRef])

    return (
        <Svg ref={svg} aria-hidden="true">
            <path ref={path} className="base" />
            <rect ref={dot} width="6" height="6" className="node" />
        </Svg>
    )
}

const Svg = styled.svg`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.6s ease;

    .base {
        fill: none;
        stroke: rgba(196, 255, 0, 0.55);
        stroke-width: 1;
        stroke-dasharray: 3 6;
        animation: hero-link-flow 1.4s linear infinite;
    }
    .node {
        fill: #c4ff00;
    }

    @keyframes hero-link-flow {
        to {
            stroke-dashoffset: -18;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .base {
            animation: none;
        }
    }
`
