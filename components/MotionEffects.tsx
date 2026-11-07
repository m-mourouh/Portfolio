'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setLenis } from '@/lib/lenis'

gsap.registerPlugin(ScrollTrigger)

/**
 * Page-wide motion layer (renders nothing):
 * 1. Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
 * 2. Scroll reveals for the Contact section.
 * 3. "Built on the grid" section titles: hidden behind a layer of cells (with lime edges)
 *    that dissolves left to right the first time the title scrolls into view.
 * Everything is skipped for users who prefer reduced motion.
 */

// Elements revealed in groups as they enter the viewport
const REVEAL_SELECTORS = ['#contact .contact-header .subtitle', '#contact form']

// Section titles revealed through the grid
const GRID_TITLES = ['#skills .skills-header h2', '#projects .projects-header h2', '#articles .articles-header h2', '#contact .contact-header h2', '#about .about__heading']
const TITLE_CELL = 22 // px
const PAGE_BG = '#1a1a1a'

// First non-transparent background behind an element (title may sit on a card, not the page)
const backgroundBehind = (el: HTMLElement) => {
    let node: HTMLElement | null = el
    while (node) {
        const bg = getComputedStyle(node).backgroundColor
        if (bg && bg !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(bg)) return bg
        node = node.parentElement
    }
    return PAGE_BG
}

function gridRevealTitle(title: HTMLElement) {
    const bg = backgroundBehind(title.parentElement || title)
    // Size the title to its text so the cells only cover the words
    title.style.display = 'inline-block'
    title.style.position = 'relative'
    const cover = document.createElement('span')
    cover.setAttribute('aria-hidden', 'true')
    Object.assign(cover.style, {
        position: 'absolute',
        inset: '-4px -6px',
        background: bg,
        pointerEvents: 'none',
        zIndex: '1',
    })
    title.appendChild(cover)

    ScrollTrigger.create({
        trigger: title,
        start: 'top 85%',
        once: true,
        onEnter: () => {
            // Build the cells now, with the final layout (fonts loaded)
            const { width, height } = cover.getBoundingClientRect()
            const cols = Math.max(1, Math.round(width / TITLE_CELL))
            const rows = Math.max(1, Math.round(height / TITLE_CELL))
            Object.assign(cover.style, {
                background: 'none',
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
            })
            const cells: HTMLElement[] = []
            for (let i = 0; i < cols * rows; i++) {
                const c = document.createElement('span')
                Object.assign(c.style, { background: bg, boxShadow: 'inset 0 0 0 1px rgba(196, 255, 0, 0.45)' })
                cover.appendChild(c)
                cells.push(c)
            }
            gsap.to(cells, {
                opacity: 0,
                duration: 0.35,
                ease: 'power2.out',
                stagger: { grid: [rows, cols], from: 'start', axis: 'x', amount: 0.8 },
                onComplete: () => cover.remove(),
            })
        },
    })
    return () => cover.remove()
}

export default function MotionEffects() {
    useEffect(() => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (reducedMotion) return

        // 1. Smooth scrolling
        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
        setLenis(lenis)
        lenis.on('scroll', ScrollTrigger.update)
        const raf = (time: number) => lenis.raf(time * 1000)
        gsap.ticker.add(raf)
        gsap.ticker.lagSmoothing(0)

        // 2. Scroll reveals
        const ctx = gsap.context(() => {
            REVEAL_SELECTORS.forEach((selector) => {
                const elements = gsap.utils.toArray<HTMLElement>(selector)
                if (!elements.length) return
                gsap.set(elements, { opacity: 0, y: 50 })
                ScrollTrigger.batch(elements, {
                    start: 'top 88%',
                    once: true,
                    onEnter: (batch) =>
                        gsap.to(batch, {
                            opacity: 1,
                            y: 0,
                            duration: 0.9,
                            stagger: 0.12,
                            ease: 'power3.out',
                            clearProps: 'transform',
                        }),
                })
            })
        })

        // 3. Grid-reveal section titles
        const titleCleanups: Array<() => void> = []
        ctx.add(() => {
            GRID_TITLES.forEach((sel) => {
                const title = document.querySelector<HTMLElement>(sel)
                if (title) titleCleanups.push(gridRevealTitle(title))
            })
        })

        // Late-loading content (images, fonts) changes layout: recompute trigger positions
        const refresh = () => ScrollTrigger.refresh()
        window.addEventListener('load', refresh)

        return () => {
            window.removeEventListener('load', refresh)
            titleCleanups.forEach((fn) => fn())
            ctx.revert()
            gsap.ticker.remove(raf)
            setLenis(null)
            lenis.destroy()
        }
    }, [])

    return null
}
