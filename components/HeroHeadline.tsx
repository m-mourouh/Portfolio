'use client'
import { Fragment, RefObject, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HERO_PULSE_EVENT } from '@/lib/heroStack'

/**
 * The hero headline as a signature moment.
 * - Split in the markup (server-rendered, so it never depends on fonts): words → characters.
 *   Arabic stays whole words (splitting would break the letters' joins). Screen readers get the
 *   sentence once (sr-only); the split copy is aria-hidden.
 * - headlineIntro(): the lines fade up into place one after another; then a lime underline
 *   draws under "systems" and a node runs along it once.
 * - In this component: a nudge when the request pulse passes each layer, a slight per-line
 *   drift as the hero scrolls away, and (fine pointers only) characters leaning toward the cursor.
 */

const split = (text: string) => text.split(' ').filter(Boolean)

export default function HeroHeadline({
    a,
    accent,
    b,
    rtl,
    accentRef,
}: {
    a: string
    accent: string
    b: string
    rtl: boolean
    accentRef: RefObject<HTMLSpanElement | null>
}) {
    const h1 = useRef<HTMLHeadingElement>(null)

    const word = (w: string, key: string) => (
        <span className="word" key={key}>
            <span className="word-inner">
                {rtl ? (
                    <span className="char">{w}</span>
                ) : (
                    Array.from(w).map((c, i) => (
                        <span className="char" key={i}>
                            {c}
                        </span>
                    ))
                )}
            </span>
        </span>
    )

    // the request pulse passes a layer: a small lime blink on the node + a faint glow on "systems"
    useEffect(() => {
        const el = h1.current
        if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const node = el.querySelector('.node')
        const acc = el.querySelector('.accent')
        const onPulse = () => {
            if (node) gsap.fromTo(node, { opacity: 1, scale: 1.9 }, { opacity: 0.85, scale: 1, duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
            if (acc) gsap.fromTo(acc, { textShadow: '0 0 14px rgba(196,255,0,0.45)' }, { textShadow: '0 0 0px rgba(196,255,0,0)', duration: 0.45, ease: 'power2.out', overwrite: 'auto' })
        }
        window.addEventListener(HERO_PULSE_EVENT, onPulse)
        return () => window.removeEventListener(HERO_PULSE_EVENT, onPulse)
    }, [])

    // scroll-out: lines drift slightly apart (opposing x) and fade a little. No pin, scrubbed.
    useEffect(() => {
        const el = h1.current
        const section = el?.closest('section')
        if (!el || !section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        gsap.registerPlugin(ScrollTrigger)
        let lines: HTMLElement[][] = []
        const group = () => (lines = linesOf(el))
        group()
        const st = ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            onRefresh: group, // re-group after resizes, without replaying the intro
            onUpdate: (self) => {
                const p = self.progress
                lines.forEach((line, i) => gsap.set(line, { x: (i % 2 ? 1 : -1) * p * 28, opacity: 1 - p * 0.45 }))
            },
        })
        return () => {
            st.kill()
            lines.flat().forEach((w) => gsap.set(w, { clearProps: 'x,opacity' }))
        }
    }, [accent, a, b])

    // desktop pointer: characters under the cursor lift a little and take a lime tint (falloff)
    useEffect(() => {
        const el = h1.current
        if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const chars = Array.from(el.querySelectorAll<HTMLElement>('.char'))
        const lift = chars.map((c) => gsap.quickTo(c, 'y', { duration: 0.45, ease: 'power3.out' }))
        let centers: Array<{ x: number; y: number }> = []
        const measure = () => {
            centers = chars.map((c) => {
                const r = c.getBoundingClientRect()
                return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
            })
        }
        const R = 140
        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== 'mouse') return
            chars.forEach((c, i) => {
                const d = Math.hypot(e.clientX - centers[i].x, e.clientY - centers[i].y)
                const k = Math.max(0, 1 - d / R)
                lift[i](-k * k * 7)
                c.style.setProperty('--t', (k * k).toFixed(3))
            })
        }
        const onLeave = () => chars.forEach((c, i) => (lift[i](0), c.style.setProperty('--t', '0')))
        el.addEventListener('pointerenter', measure)
        el.addEventListener('pointermove', onMove)
        el.addEventListener('pointerleave', onLeave)
        return () => {
            el.removeEventListener('pointerenter', measure)
            el.removeEventListener('pointermove', onMove)
            el.removeEventListener('pointerleave', onLeave)
            chars.forEach((c) => {
                gsap.set(c, { clearProps: 'y' })
                c.style.removeProperty('--t')
            })
        }
    }, [accent, a, b])

    return (
        <h1 className="hero-title" tabIndex={-1} ref={h1}>
            <span className="sr-only">{`${a} ${accent} ${b}`}</span>
            {/* real spaces between the words (not just CSS margins), so the text never runs together */}
            <span className="split" aria-hidden="true">
                {split(a).map((w, i) => (
                    <Fragment key={`a${i}`}>{word(w, `a${i}`)} </Fragment>
                ))}
                <span className="word accent-word">
                    <span className="word-inner serif accent" ref={accentRef}>
                        {accent}
                    </span>
                    <span className="underline">
                        <i className="node" />
                    </span>
                </span>
                {split(b).map((w, i) => (
                    <Fragment key={`b${i}`}>
                        {' '}
                        {word(w, `b${i}`)}
                    </Fragment>
                ))}
            </span>
        </h1>
    )
}

/** words grouped by rendered line (their masks share an offsetTop) */
export function linesOf(h1: HTMLElement) {
    const lines: HTMLElement[][] = []
    let top: number | null = null
    h1.querySelectorAll<HTMLElement>('.split > .word').forEach((w) => {
        if (top === null || Math.abs(w.offsetTop - top) > 4) {
            lines.push([])
            top = w.offsetTop
        }
        lines[lines.length - 1].push(w)
    })
    return lines
}

/**
 * The headline's part of the hero entrance: each line fades up into place, one after another
 * (words within a line follow each other slightly), then a lime underline draws under the
 * accent word and a node runs along it. Takes over the CSS start state with explicit values.
 */
export function headlineIntro(h1: HTMLElement, opts: { mobile: boolean; rtl: boolean }) {
    const { mobile, rtl } = opts
    const lines = linesOf(h1).map((line) => line.map((w) => w.querySelector<HTMLElement>('.word-inner')!).filter(Boolean))
    const underline = h1.querySelector<HTMLElement>('.underline')
    const node = h1.querySelector<HTMLElement>('.node')
    const rise = mobile ? 24 : 40

    gsap.set(lines.flat(), { opacity: 0, y: rise })
    if (underline) gsap.set(underline, { scaleX: 0 })
    if (node) gsap.set(node, { opacity: 0 })

    const tl = gsap.timeline()
    const lineGap = mobile ? 0.1 : 0.12
    const dur = mobile ? 0.8 : 1
    lines.forEach((line, i) => {
        const ordered = rtl ? [...line].reverse() : line
        tl.to(ordered, { opacity: 1, y: 0, duration: dur, ease: 'power3.out', stagger: 0.04 }, i * lineGap)
    })
    // once the headline has landed: the underline draws, a node runs along it once
    const landed = (lines.length - 1) * lineGap + dur * 0.7
    if (underline) tl.to(underline, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, landed)
    if (node)
        tl.fromTo(node, { left: rtl ? '100%' : '0%', opacity: 1 }, { left: rtl ? '0%' : '100%', duration: 0.7, ease: 'power1.inOut' }, landed + 0.3).to(
            node,
            { opacity: 0.85, duration: 0.2 },
            '>'
        )
    return tl
}
