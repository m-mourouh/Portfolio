'use client'
import { useEffect } from 'react'
import { gsap } from 'gsap'

/**
 * Click feedback: a green ring ripples out from every click/tap,
 * and the custom cursor briefly squeezes. Renders nothing itself;
 * rings are created on demand and removed when their animation ends.
 */
export default function ClickEffect() {
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const layer = document.createElement('div')
        layer.setAttribute('aria-hidden', 'true')
        Object.assign(layer.style, {
            position: 'fixed',
            inset: '0',
            pointerEvents: 'none',
            zIndex: '100000001', // above popups, below the custom cursor
            overflow: 'hidden',
        })
        document.body.appendChild(layer)

        const makeCircle = (x: number, y: number, size: number, style: Partial<CSSStyleDeclaration>) => {
            const el = document.createElement('span')
            Object.assign(el.style, {
                position: 'absolute',
                left: `${x - size / 2}px`,
                top: `${y - size / 2}px`,
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                ...style,
            })
            layer.appendChild(el)
            return el
        }

        const onDown = (e: PointerEvent) => {
            if (e.button !== 0) return
            const { clientX: x, clientY: y } = e

            const ring = makeCircle(x, y, 64, { border: '1.5px solid #c4ff00' })
            const glow = makeCircle(x, y, 64, { background: 'rgba(196, 255, 0, 0.18)' })

            gsap.timeline({ onComplete: () => { ring.remove(); glow.remove() } })
                .fromTo(ring, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.6, ease: 'power2.out' }, 0)
                .fromTo(glow, { scale: 0, opacity: 1 }, { scale: 0.6, opacity: 0, duration: 0.45, ease: 'power2.out' }, 0)

            // Squeeze the custom cursor (desktop only; it's hidden on mobile)
            const follower = document.querySelector('.cursor-follower')
            if (follower) {
                gsap.fromTo(follower, { scale: 0.6 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
            }
        }

        window.addEventListener('pointerdown', onDown, { passive: true })
        return () => {
            window.removeEventListener('pointerdown', onDown)
            layer.remove()
        }
    }, [])

    return null
}
