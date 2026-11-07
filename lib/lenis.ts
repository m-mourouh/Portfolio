import type Lenis from 'lenis'

// Shared handle to the page's Lenis instance (created in MotionEffects),
// so popups can pause page scrolling while they are open.
let instance: Lenis | null = null

export const setLenis = (lenis: Lenis | null) => {
    instance = lenis
}

export const getLenis = () => instance
