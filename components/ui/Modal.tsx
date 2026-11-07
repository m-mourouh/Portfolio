'use client'
import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import styled, { css } from 'styled-components'
import { device } from '@/styles/styled-components/Breakpoints'
import { getLenis } from '@/lib/lenis'

/**
 * Accessible popup base used by the project and contact popups.
 * - Closes on Esc, backdrop click, close button and the browser Back button
 * - Traps keyboard focus inside and restores it on close
 * - Pauses page scrolling (Lenis + native) while open
 * - Enter/exit animations; callers can add their own steps via `enter` / `exit`
 */

type Variant = 'center' | 'drawer' | 'palette'

type ModalProps = {
    variant?: Variant
    labelledBy: string
    /** Called once the exit animation has finished: unmount the modal here. */
    onClose: () => void
    /** Extra enter animation steps (e.g. shared-element image). */
    enter?: (tl: gsap.core.Timeline, panel: HTMLElement) => void
    /** Extra exit animation steps, played before the panel fades out. */
    exit?: (tl: gsap.core.Timeline, panel: HTMLElement) => void
    /** Set when `enter`/`exit` animate the panel themselves (default panel motion is skipped). */
    customPanelAnimation?: boolean
    children: (requestClose: () => void) => ReactNode
}

const HISTORY_FLAG = '__portfolioModal'
const FOCUSABLE =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

const reducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Modal({
    variant = 'center',
    labelledBy,
    onClose,
    enter,
    exit,
    customPanelAnimation = false,
    children,
}: ModalProps) {
    const [mounted, setMounted] = useState(false)
    const backdropRef = useRef<HTMLDivElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const closingRef = useRef(false)
    const pushedRef = useRef(false)
    const onCloseRef = useRef(onClose)
    const exitRef = useRef(exit)
    // Undoes the scroll lock + restores focus. Called before onClose so the parent's
    // follow-up action (e.g. scrolling to a section) runs with scrolling already enabled.
    const unlockRef = useRef<(() => void) | null>(null)
    onCloseRef.current = onClose
    exitRef.current = exit

    const finishClose = () => {
        unlockRef.current?.()
        onCloseRef.current()
    }

    useEffect(() => setMounted(true), [])

    // Plays the exit animation, then lets the parent unmount us
    const runClose = useCallback(() => {
        if (closingRef.current) return
        closingRef.current = true
        const panel = panelRef.current
        const backdrop = backdropRef.current
        if (!panel || !backdrop || reducedMotion()) {
            finishClose()
            return
        }
        const tl = gsap.timeline({ onComplete: finishClose })
        exitRef.current?.(tl, panel)
        if (!customPanelAnimation) {
            tl.to(
                panel,
                variant === 'drawer'
                    ? { xPercent: 100, duration: 0.45, ease: 'power3.in' }
                    : { opacity: 0, y: 30, duration: 0.3, ease: 'power2.in' },
                exitRef.current ? '-=0.15' : 0
            )
        }
        tl.to(backdrop, { opacity: 0, duration: 0.3 }, '<0.1')
    }, [variant, customPanelAnimation])

    // UI close: step back in history if we added an entry (popstate then closes us)
    const requestClose = useCallback(() => {
        if (pushedRef.current) {
            pushedRef.current = false
            window.history.back()
        } else {
            runClose()
        }
    }, [runClose])

    // Browser Back button closes the popup instead of leaving the page
    useEffect(() => {
        if (!window.history.state?.[HISTORY_FLAG]) {
            // Keep the router's own state so Next.js treats it as the same page
            window.history.pushState({ ...(window.history.state || {}), [HISTORY_FLAG]: true }, '')
        }
        pushedRef.current = true
        const onPop = () => {
            pushedRef.current = false
            runClose()
        }
        window.addEventListener('popstate', onPop)
        return () => window.removeEventListener('popstate', onPop)
    }, [runClose])

    // Scroll lock + focus management
    useEffect(() => {
        if (!mounted) return
        const previousFocus = document.activeElement as HTMLElement | null
        const html = document.documentElement
        const previousOverflow = html.style.overflow
        getLenis()?.stop()
        html.style.overflow = 'hidden'

        const panel = panelRef.current
        const first = panel?.querySelector<HTMLElement>('[data-autofocus]') || panel
        first?.focus({ preventScroll: true })

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault()
                requestClose()
                return
            }
            if (e.key !== 'Tab' || !panel) return
            const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
                (el) => el.offsetParent !== null
            )
            if (!items.length) return
            const firstItem = items[0]
            const lastItem = items[items.length - 1]
            if (e.shiftKey && document.activeElement === firstItem) {
                e.preventDefault()
                lastItem.focus()
            } else if (!e.shiftKey && document.activeElement === lastItem) {
                e.preventDefault()
                firstItem.focus()
            }
        }
        document.addEventListener('keydown', onKey)

        let unlocked = false
        const unlock = () => {
            if (unlocked) return
            unlocked = true
            document.removeEventListener('keydown', onKey)
            html.style.overflow = previousOverflow
            getLenis()?.start()
            previousFocus?.focus?.({ preventScroll: true })
        }
        unlockRef.current = unlock
        return unlock
    }, [mounted, requestClose])

    // Enter animation
    useLayoutEffect(() => {
        if (!mounted) return
        const panel = panelRef.current
        const backdrop = backdropRef.current
        if (!panel || !backdrop || reducedMotion()) return
        const tl = gsap.timeline()
        tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        if (!customPanelAnimation) {
            tl.fromTo(
                panel,
                variant === 'drawer' ? { xPercent: 100 } : { opacity: 0, y: 30 },
                variant === 'drawer'
                    ? { xPercent: 0, duration: 0.55, ease: 'power4.out' }
                    : { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' },
                0
            )
        }
        enter?.(tl, panel)
        return () => {
            tl.kill()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted])

    if (!mounted) return null

    return createPortal(
        <Root $variant={variant}>
            <div className="modal-backdrop" ref={backdropRef} onClick={requestClose} />
            <div
                className="modal-panel"
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={labelledBy}
                tabIndex={-1}
                data-lenis-prevent
            >
                {children(requestClose)}
            </div>
        </Root>,
        document.body
    )
}

const Root = styled.div<{ $variant: Variant }>`
    position: fixed;
    inset: 0;
    /* Above the header (99999999); the custom cursor stays on top */
    z-index: 100000000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;

    .modal-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(10, 10, 10, 0.72);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    }

    .modal-panel {
        position: relative;
        width: 100%;
        max-height: 100%;
        overflow-y: auto;
        overscroll-behavior: contain;
        background: rgb(24, 24, 24);
        border: 1px solid rgb(45, 45, 45);
        color: var(--white);
        outline: none;
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }
    }

    ${({ $variant }) =>
        $variant === 'palette'
            ? css`
                  /* Search palette: narrow, near the top of the screen */
                  align-items: flex-start;
                  padding-top: 14vh;
                  .modal-panel {
                      max-width: 640px;
                      max-height: 70vh;
                      border-radius: 18px;
                      overflow: hidden;
                      display: flex;
                      flex-direction: column;
                  }
                  @media ${device.sm} {
                      padding: 12px;
                      padding-top: 10vh;
                  }
              `
            : $variant === 'center'
            ? css`
                  .modal-panel {
                      max-width: 960px;
                      border-radius: 24px;
                  }
                  @media ${device.sm} {
                      padding: 0;
                      align-items: flex-end;
                      .modal-panel {
                          max-height: 92%;
                          border-radius: 20px 20px 0 0;
                      }
                  }
              `
            : css`
                  padding: 0;
                  /* Pinned to the physical right edge in every language (incl. Arabic/RTL),
                     so it always slides in from the right */
                  .modal-panel {
                      position: absolute;
                      top: 0;
                      right: 0;
                      bottom: 0;
                      max-width: 520px;
                      height: 100%;
                      border-width: 0 0 0 1px;
                  }
              `}
`
