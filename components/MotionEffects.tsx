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
 * Everything is skipped for users who prefer reduced motion.
 */

// Elements revealed in groups as they enter the viewport
const REVEAL_SELECTORS = [
    '#contact .contact-header',
    '#contact form',
]

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

        // Late-loading content (images, fonts) changes layout: recompute trigger positions
        const refresh = () => ScrollTrigger.refresh()
        window.addEventListener('load', refresh)

        return () => {
            window.removeEventListener('load', refresh)
            ctx.revert()
            gsap.ticker.remove(raf)
            setLenis(null)
            lenis.destroy()
        }
    }, [])

    return null
}
