/**
 * Shared state between the hero 3D stack and its HTML overlay (labels, readout).
 * Layer index 0 is the bottom plate. Written by the scene every frame, read by the overlay.
 */
export const LAYERS = ['AI', 'DATA', 'SERVICES', 'API', 'UI'] as const // bottom → top
export type LayerIndex = 0 | 1 | 2 | 3 | 4

export const heroStack = {
    /** screen position (hero-relative px) where each plate's label attaches */
    anchors: LAYERS.map(() => ({ x: 0, y: 0 })),
    /** labels are shown once the stack has built (and only with the WebGL scene) */
    visible: false,
    /** hovered / focused layer, -1 = none (set by pointer picking or by the overlay) */
    focus: -1,
    /** true while a label has keyboard focus (pointer picking then leaves `focus` alone) */
    keyFocus: false,
    /** request light per layer, 0..1 */
    lit: LAYERS.map(() => 0),
    /** last layer reached by the running request, -1 = idle */
    step: -1,
    /** 0 → 1 as the hero scrolls away (layers separate) */
    explode: 0,
    /** right-to-left page (Arabic): the stack sits in the left half, labels extend to the left */
    rtl: false,
}

const RUN = 'portfolio:hero-request'
/** Send a request through the stack (re-runs the pulse animation). */
export const runRequest = () => window.dispatchEvent(new CustomEvent(RUN))
export const onRunRequest = (handler: () => void) => {
    window.addEventListener(RUN, handler)
    return () => window.removeEventListener(RUN, handler)
}

/**
 * Hero entrance phases, driven by the ONE master timeline in Head.tsx:
 * atmosphere (the 3D grid rises) → … headline, text, CTAs … → stack (the 3D / SVG stack builds
 * and runs its first request). The scene and the SVG read these flags when they mount, so a
 * lazily-loaded scene that arrives late still starts in the right state.
 */
export const heroIntro = { atmosphere: false, stack: false }
export const HERO_STACK_EVENT = 'portfolio:hero-stack'
export const startHero = (phase: 'atmosphere' | 'stack') => {
    if (heroIntro[phase]) return
    heroIntro[phase] = true
    if (phase === 'stack') window.dispatchEvent(new CustomEvent(HERO_STACK_EVENT))
}

/** the request pulse reached a layer (detail: 0 = UI … 4 = AI): the headline nudges in time */
export const HERO_PULSE_EVENT = 'portfolio:hero-pulse'
export const emitPulse = (layer: number) => window.dispatchEvent(new CustomEvent(HERO_PULSE_EVENT, { detail: layer }))

/** The loader's curtain starts lifting: the hero entrance plays in time with it. */
const LOADER_EXIT_EVENT = 'portfolio:loader-exit'
/** called by the loader when its curtain starts lifting */
export const signalLoaderExit = () => {
    window.dispatchEvent(new CustomEvent(LOADER_EXIT_EVENT))
}
/** runs `cb` when the loader on screen starts leaving; immediately if no loader is showing */
export const onLoaderExit = (cb: () => void) => {
    if (!document.querySelector('.loader-wrapper')) {
        cb()
        return () => {}
    }
    window.addEventListener(LOADER_EXIT_EVENT, cb, { once: true })
    return () => window.removeEventListener(LOADER_EXIT_EVENT, cb)
}
