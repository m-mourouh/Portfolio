'use client'
import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { StyledLanguageSwitcher } from '@/styles/styled-components/LanguageSwitcher.styled'
import { HiGlobeAlt, HiChevronDown } from 'react-icons/hi2'

export default function LanguageSwitcher({ isMobile = false }: { isMobile?: boolean }) {
    const { language, changeLanguage } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const languages = [
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'fr', label: 'Français', flag: '🇫🇷' },
        { code: 'ar', label: 'العربية', flag: '🇲🇦' },
    ]

    const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLanguageChange = (code: string) => {
        changeLanguage(code as 'en' | 'fr' | 'ar')
        setIsOpen(false)
    }

    return (
        <StyledLanguageSwitcher ref={dropdownRef} $isMobile={isMobile}>
            <button
                className="language-button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Change language"
            >
                <HiGlobeAlt className="globe-icon" />
                <span className="current-lang">{currentLanguage.code.toUpperCase()}</span>
                <HiChevronDown className={`chevron ${isOpen ? 'open' : ''}`} />
            </button>

            {isOpen && (
                <div className="dropdown">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`dropdown-item ${language === lang.code ? 'active' : ''}`}
                            onClick={() => handleLanguageChange(lang.code)}
                        >
                            <span className="flag">{lang.flag}</span>
                            <span className="label">{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </StyledLanguageSwitcher>
    )
}
