'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Interactive extras that aren't needed for the first paint: split out of the main bundle
const ContactDrawer = dynamic(() => import('./ContactDrawer'), { ssr: false })
const CommandMenu = dynamic(() => import('./CommandMenu'), { ssr: false })

/**
 * Mounted only in the browser, once it's idle after load. Rendering `ssr: false` components
 * during server rendering makes Next 13 bail out of a Suspense boundary (shown as an error
 * overlay in dev); mounting after hydration avoids that and keeps them off the critical path.
 */
export default function DeferredWidgets() {
    const [ready, setReady] = useState(false)

    useEffect(() => {
        const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void }
        if (w.requestIdleCallback) {
            const id = w.requestIdleCallback(() => setReady(true), { timeout: 2000 })
            return () => w.cancelIdleCallback?.(id)
        }
        const t = setTimeout(() => setReady(true), 300)
        return () => clearTimeout(t)
    }, [])

    if (!ready) return null
    return (
        <>
            <ContactDrawer />
            <CommandMenu />
        </>
    )
}
