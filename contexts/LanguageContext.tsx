'use client'
import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import '@/lib/i18n'

type Language = 'en' | 'fr' | 'ar'

interface LanguageContextType {
    language: Language
    changeLanguage: (lang: Language) => void
    t: (key: string, params?: any) => string
    dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const { t, i18n } = useTranslation()

    // Detect and set language after hydration (runs once on mount)
    useEffect(() => {
        const detectLanguage = () => {
            // Check localStorage first
            const savedLang = localStorage.getItem('i18nextLng')
            if (savedLang && ['en', 'fr', 'ar'].includes(savedLang)) {
                return savedLang as Language
            }

            // Detect from browser
            const browserLang = navigator.language.toLowerCase()
            if (browserLang.startsWith('ar')) return 'ar'
            if (browserLang.startsWith('fr')) return 'fr'
            return 'en'
        }

        const detectedLang = detectLanguage()
        if (detectedLang !== i18n.language) {
            i18n.changeLanguage(detectedLang)
            localStorage.setItem('i18nextLng', detectedLang)
        }
    }, []) // Run once on mount

    // Update document attributes when language changes
    useEffect(() => {
        const currentLang = i18n.language as Language
        document.documentElement.setAttribute('lang', currentLang)
        document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr')
    }, [i18n.language])

    const changeLanguage = (lang: Language) => {
        i18n.changeLanguage(lang)
        localStorage.setItem('i18nextLng', lang)
        document.documentElement.setAttribute('lang', lang)
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
    }

    const value: LanguageContextType = {
        language: i18n.language as Language,
        changeLanguage,
        t,
        dir: i18n.language === 'ar' ? 'rtl' : 'ltr',
    }

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
