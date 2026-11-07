'use client'
import { useEffect, useState } from 'react'
import { SECTIONS, SectionId } from '@/lib/sections'

/**
 * Which section is current, and how far through it the reader is (0..1).
 * Current = the last section whose top has passed 35% of the viewport. Measured from the live
 * layout on every (rAF-throttled) scroll, so late-rendered sections and the pinned Work stage
 * (which adds a pin spacer) are always right. An IntersectionObserver band can miss sections
 * that render after mount or change height, which is what left "Work" active over Journal.
 */
export function useSection() {
    const [state, setState] = useState<{ current: SectionId; progress: number }>({ current: 'head', progress: 0 })
    useEffect(() => {
        let raf = 0
        const check = () => {
            raf = 0
            const line = window.innerHeight * 0.35
            let current: SectionId = 'head'
            let progress = 0
            for (const s of SECTIONS) {
                const el = document.getElementById(s.id)
                if (!el) continue
                const r = el.getBoundingClientRect()
                if (r.top <= line) {
                    current = s.id
                    progress = Math.min(1, Math.max(0, (line - r.top) / Math.max(1, r.height)))
                }
            }
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
                current = 'contact'
                progress = 1
            }
            setState((p) => (p.current === current && Math.abs(p.progress - progress) < 0.005 ? p : { current, progress }))
        }
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(check)
        }
        check()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
        }
    }, [])
    return state
}
