'use client'
import { useEffect, useState } from 'react'

/** Casablanca local time "14:05", set after mount (no hydration mismatch), updated every 30 s. */
export function useLocalTime(language: string) {
    const [time, setTime] = useState('')
    useEffect(() => {
        const fmt = () =>
            new Date().toLocaleTimeString(language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Africa/Casablanca',
            })
        setTime(fmt())
        const id = setInterval(() => setTime(fmt()), 30000)
        return () => clearInterval(id)
    }, [language])
    return time
}
