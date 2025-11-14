'use client'
import { useEffect, useState } from 'react'
import { StyledThemeToggle } from '@/styles/styled-components/ThemeToggle.styled'
import { HiSun, HiMoon } from 'react-icons/hi'

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(true)

    useEffect(() => {
        // Check localStorage for saved theme
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            setIsDark(savedTheme === 'dark')
            document.documentElement.setAttribute('data-theme', savedTheme)
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark'
        setIsDark(!isDark)
        document.documentElement.setAttribute('data-theme', newTheme)
        localStorage.setItem('theme', newTheme)
    }

    return (
        <StyledThemeToggle onClick={toggleTheme} aria-label="Toggle theme">
            <div className={`toggle-track ${isDark ? 'dark' : 'light'}`}>
                <div className="toggle-thumb">
                    {isDark ? <HiMoon /> : <HiSun />}
                </div>
            </div>
        </StyledThemeToggle>
    )
}
