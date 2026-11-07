'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MusicEngine } from '@/lib/music'

const STORAGE_KEY = 'portfolio:music'
export const TOGGLE_MUSIC_EVENT = 'portfolio:toggle-music'
export const toggleMusic = () => window.dispatchEvent(new CustomEvent(TOGGLE_MUSIC_EVENT))
export const MUSIC_STATE_EVENT = 'portfolio:music-state'

const remember = (on: boolean) => {
    try {
        localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off')
    } catch {}
}

/**
 * Background music engine controller (the play/pause button lives in the navbar: MusicToggle).
 * Tries to start on load; browsers usually require an interaction first, so otherwise it
 * starts on the first click / tap / key press. The button (or Ctrl+K) pauses and resumes it,
 * and a visitor who pauses it won't get it automatically next time.
 */
export default function BackgroundMusic() {
    const engine = useRef<MusicEngine | null>(null)
    const wantsMusic = useRef(true)
    const [playing, setPlaying] = useState(false)

    const play = useCallback(async (): Promise<boolean> => {
        engine.current = engine.current || new MusicEngine()
        try {
            const started = await engine.current.start()
            setPlaying(started)
            return started
        } catch {
            return false
        }
    }, [])

    const pause = useCallback(() => {
        engine.current?.stop()
        setPlaying(false)
    }, [])

    const toggle = useCallback(() => {
        wantsMusic.current = !(engine.current?.isPlaying ?? false)
        remember(wantsMusic.current)
        if (wantsMusic.current) play()
        else pause()
    }, [play, pause])

    // Start on load if the browser allows it, otherwise on the first interaction
    useEffect(() => {
        try {
            if (localStorage.getItem(STORAGE_KEY) === 'off') wantsMusic.current = false
        } catch {}
        if (!wantsMusic.current) return

        const events = ['pointerdown', 'pointerup', 'click', 'keydown', 'touchend'] as const
        let done = false
        const cleanup = () => events.forEach((e) => window.removeEventListener(e, onGesture, true))
        const onGesture = async (e: Event) => {
            // clicks on the music button are handled by the button itself
            if ((e.target as HTMLElement | null)?.closest?.('[data-music-toggle]')) {
                done = true
                cleanup()
                return
            }
            if (done || !wantsMusic.current) return
            if (await play()) {
                done = true
                cleanup()
            }
        }
        events.forEach((e) => window.addEventListener(e, onGesture, { capture: true, passive: true }))
        // Try right away only if the browser could allow it (avoids console warnings otherwise)
        const nav = navigator as Navigator & { userActivation?: { hasBeenActive: boolean }; getAutoplayPolicy?: (t: string) => string }
        if (nav.userActivation?.hasBeenActive || nav.getAutoplayPolicy?.('audiocontext') === 'allowed') {
            play().then((started) => {
                if (started) {
                    done = true
                    cleanup()
                }
            })
        }
        return cleanup
    }, [play])

    // Pause while the tab is hidden, resume when the visitor comes back
    useEffect(() => {
        const onVisibility = () => {
            if (document.hidden) {
                if (engine.current?.isPlaying) {
                    engine.current.stop()
                    setPlaying(false)
                }
            } else if (wantsMusic.current && engine.current && !engine.current.isPlaying) {
                play()
            }
        }
        document.addEventListener('visibilitychange', onVisibility)
        return () => document.removeEventListener('visibilitychange', onVisibility)
    }, [play])

    // Ctrl+K → "Play / pause music"
    useEffect(() => {
        window.addEventListener(TOGGLE_MUSIC_EVENT, toggle)
        return () => window.removeEventListener(TOGGLE_MUSIC_EVENT, toggle)
    }, [toggle])

    useEffect(() => () => engine.current?.stop(), [])

    // Tell the navbar toggle(s) what's happening
    useEffect(() => {
        window.dispatchEvent(new CustomEvent(MUSIC_STATE_EVENT, { detail: playing }))
    }, [playing])

    return null
}
