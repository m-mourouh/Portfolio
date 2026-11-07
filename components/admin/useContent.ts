'use client'
import { useCallback, useEffect, useState } from 'react'

export type PendingImage = { name: string; base64: string; preview: string }

type State<T> =
    | { status: 'loading' }
    | { status: 'error'; error: string }
    | { status: 'ready'; data: T; sha: string }

/** Loads a content file through the admin API and saves it back (one commit per save). */
export function useContent<T>(key: 'projects' | 'articles') {
    const [state, setState] = useState<State<T>>({ status: 'loading' })

    const load = useCallback(async () => {
        setState({ status: 'loading' })
        try {
            const res = await fetch(`/api/admin/content/${key}`, { cache: 'no-store' })
            const body = await res.json()
            if (!res.ok) throw new Error(body.error || 'Could not load content')
            setState({ status: 'ready', data: body.data, sha: body.sha })
        } catch (e) {
            setState({ status: 'error', error: e instanceof Error ? e.message : 'Could not load content' })
        }
    }, [key])

    useEffect(() => {
        load()
    }, [load])

    const save = useCallback(
        async (data: T, images: PendingImage[]): Promise<{ ok: true; commitUrl: string; data: T; removedImages: string[] } | { ok: false; error: string }> => {
            if (state.status !== 'ready') return { ok: false, error: 'Content is not loaded' }
            try {
                const res = await fetch(`/api/admin/content/${key}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        data,
                        sha: state.sha,
                        images: images.map(({ name, base64 }) => ({ name, base64 })),
                    }),
                })
                const body = await res.json().catch(() => ({}))
                if (!res.ok) return { ok: false, error: body.error || `Save failed (${res.status})` }
                setState({ status: 'ready', data: body.data, sha: body.sha })
                return { ok: true, commitUrl: body.commitUrl, data: body.data, removedImages: body.removedImages || [] }
            } catch {
                return { ok: false, error: 'Network error, nothing was saved.' }
            }
        },
        [key, state]
    )

    return { state, load, save }
}

/** Warns before leaving the page with unsaved changes. */
export function useUnsavedWarning(dirty: boolean) {
    useEffect(() => {
        if (!dirty) return
        const onBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault()
            e.returnValue = ''
        }
        window.addEventListener('beforeunload', onBeforeUnload)
        return () => window.removeEventListener('beforeunload', onBeforeUnload)
    }, [dirty])
}
