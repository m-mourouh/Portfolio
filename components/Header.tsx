'use client'
import { useEffect, useState } from 'react'
import { StyledHeader } from '@/styles/styled-components/Header.styled'
import NavBar from './NavBar'
import { useLanguage } from '@/contexts/LanguageContext'

/**
 * Sticky header: always shown at the top of the page, hidden while scrolling down and shown
 * again on scroll up (8px threshold, no flicker). Never hidden while it has keyboard focus.
 */
const Header = () => {
    const { t } = useLanguage()
    const [atTop, setAtTop] = useState(true)
    const [hidden, setHidden] = useState(false)

    useEffect(() => {
        let last = window.scrollY
        let raf = 0
        const check = () => {
            raf = 0
            const y = window.scrollY
            setAtTop(y < 80)
            const header = document.querySelector('header[data-site-header]')
            const hasFocus = !!header?.contains(document.activeElement)
            if (y < 120 || hasFocus) setHidden(false)
            else if (y > last + 8) setHidden(true)
            else if (y < last - 8) setHidden(false)
            if (Math.abs(y - last) > 8 || y < 120) last = y
        }
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(check)
        }
        check()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('scroll', onScroll)
        }
    }, [])

    return (
        <StyledHeader data-site-header className={hidden ? 'is-hidden' : ''} onFocus={() => setHidden(false)}>
            <a className="skip" href="#main">
                {t('nav.skip')}
            </a>
            <NavBar atTop={atTop} />
        </StyledHeader>
    )
}

export default Header
