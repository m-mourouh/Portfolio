'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import styled from 'styled-components'

const CELL = 50 // same as the page's background grid

// Over these, the crosshair hides: it only lives in empty space
const CONTENT =
    'a, button, input, textarea, select, label, [role="button"], [role="dialog"], img, video, canvas, h1, h2, h3, h4, p, li, svg, form, nav, .project-card, .featured, .row, .skill-card, .about__content, .more-row'

/**
 * "You're always on the grid": over empty space, a lime crosshair snaps to the nearest
 * intersection of the background grid, with its grid coordinates. Desktop mouse only.
 */
export default function GridCrosshair() {
    const ref = useRef<HTMLDivElement>(null)
    const labelRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const el = ref.current
        const label = labelRef.current
        if (!el || !label) return
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        const xTo = gsap.quickTo(el, 'x', { duration: reduced ? 0 : 0.25, ease: 'power3.out' })
        const yTo = gsap.quickTo(el, 'y', { duration: reduced ? 0 : 0.25, ease: 'power3.out' })
        let visible = false
        let placed = false
        const show = (on: boolean) => {
            if (on === visible) return
            visible = on
            gsap.to(el, { opacity: on ? 1 : 0, duration: 0.2, overwrite: 'auto' })
        }

        const onMove = (e: PointerEvent) => {
            const target = e.target as Element | null
            const empty = !!target && !target.closest(CONTENT)
            if (!empty) return show(false)
            const col = Math.round(e.clientX / CELL)
            const row = Math.round(e.clientY / CELL)
            if (!placed) {
                gsap.set(el, { x: col * CELL, y: row * CELL })
                placed = true
            } else {
                xTo(col * CELL)
                yTo(row * CELL)
            }
            label.textContent = `${String(col).padStart(2, '0')} · ${String(row).padStart(2, '0')}`
            show(true)
        }
        const onLeave = () => show(false)

        window.addEventListener('pointermove', onMove, { passive: true })
        document.documentElement.addEventListener('pointerleave', onLeave)
        window.addEventListener('scroll', onLeave, { passive: true })
        return () => {
            window.removeEventListener('pointermove', onMove)
            document.documentElement.removeEventListener('pointerleave', onLeave)
            window.removeEventListener('scroll', onLeave)
        }
    }, [])

    return (
        <Cross ref={ref} aria-hidden="true">
            <span className="label" ref={labelRef} />
        </Cross>
    )
}

const Cross = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
    z-index: 999;

    /* the "+" (two 1px lines centered on the intersection) */
    &::before,
    &::after {
        content: '';
        position: absolute;
        background: #c4ff00;
        opacity: 0.8;
    }
    &::before {
        left: -9px;
        top: -0.5px;
        width: 18px;
        height: 1px;
    }
    &::after {
        left: -0.5px;
        top: -9px;
        width: 1px;
        height: 18px;
    }

    .label {
        position: absolute;
        left: 10px;
        top: 8px;
        font-family: var(--font-roboto-mono), monospace;
        font-size: 12px;
        letter-spacing: 0.08em;
        color: rgba(196, 255, 0, 0.7);
        white-space: nowrap;
    }

    @media (hover: none), (pointer: coarse) {
        display: none;
    }
`
