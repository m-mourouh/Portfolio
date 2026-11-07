'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { FiSearch, FiChevronDown, FiArrowUpRight } from 'react-icons/fi'
import { StyledNav } from '@/styles/styled-components/NavBar.styled'
import userData from '@/data/user.json'
import Logo from '@/public/images/logo.svg'
import LanguageSwitcher from './LanguageSwitcher'
import MusicToggle from './MusicToggle'
import MobileMenu from './nav/MobileMenu'
import { useSection } from './nav/useSection'
import { SECTIONS } from '@/lib/sections'
import { useLanguage } from '@/contexts/LanguageContext'
import { openContactDrawer } from '@/lib/contactDrawer'
import { openCommandMenu } from '@/lib/commandMenu'
import { getLenis } from '@/lib/lenis'

// Smooth-scroll to a section (real #links underneath, so they also work without JS)
const goTo = (id: string) => {
    const el = document.getElementById(id)
    // on another page (e.g. a case study): go back to the home page section
    if (!el) return window.location.assign(id === 'head' ? '/' : `/#${id}`)
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(el, { offset: id === 'head' ? 0 : -90 })
    else el.scrollIntoView({ behavior: 'smooth' })
    history.replaceState(null, '', id === 'head' ? location.pathname : `#${id}`)
}

/**
 * Desktop: a compact pill (logo, current numbered section + progress line, lime Contact) that
 * expands into the full numbered nav on hover / focus / click; Esc collapses it. At the very
 * top of the page it is expanded. Phones / tablets: a hamburger opening the full-screen menu.
 */
export default function NavBar({ atTop }: { atTop: boolean }) {
    const { t } = useLanguage()
    const { current, progress } = useSection()
    const [hover, setHover] = useState(false)
    const [focusIn, setFocusIn] = useState(false)
    const [pinned, setPinned] = useState(false)
    const [escaped, setEscaped] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const burger = useRef<HTMLButtonElement>(null)
    const pathname = usePathname()

    const expanded = (atTop || hover || focusIn || pinned) && !escaped
    const section = SECTIONS.find((s) => s.id === current)

    // close the mobile menu on route change
    useEffect(() => setMenuOpen(false), [pathname])
    const closeMenu = useCallback(() => setMenuOpen(false), [])

    return (
        <StyledNav
            aria-label={t('nav.menu')}
            className={expanded ? 'is-expanded' : ''}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => {
                setHover(false)
                setEscaped(false)
            }}
            onFocus={() => setFocusIn(true)}
            onBlur={(e: React.FocusEvent<HTMLElement>) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setFocusIn(false)
                    setPinned(false)
                    setEscaped(false)
                }
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
                if (e.key === 'Escape' && expanded) {
                    setPinned(false)
                    setEscaped(true)
                }
            }}
        >
            <a className="logo" href="#head" aria-label={`${userData.user.name}, ${t('nav.home')}`} onClick={(e) => { e.preventDefault(); goTo('head') }}>
                <Image src={Logo} alt="" width={44} height={44} />
            </a>

            {/* compact: where am I */}
            <div className="current" aria-hidden="true">
                <span className="c-num">{section ? String(section.n).padStart(2, '0') : '00'}</span>
                <span className="c-name">{section ? t(section.key) : t('nav.home')}</span>
                <span className="c-bar">
                    <span style={{ transform: `scaleX(${section ? progress : 0})` }} />
                </span>
            </div>

            {/* expanded: every section + tools */}
            <div className="expand">
                <div className="expand-inner">
                    <ul className="links" id="nav-links">
                        {SECTIONS.map((s) => (
                            <li key={s.id}>
                                <a
                                    className={`nav-link${current === s.id ? ' is-current' : ''}`}
                                    aria-current={current === s.id ? 'location' : undefined}
                                    href={`#${s.id}`}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        goTo(s.id)
                                    }}
                                >
                                    <span className="n">{String(s.n).padStart(2, '0')}</span>
                                    {t(s.key)}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="tools">
                        <button type="button" className="search" onClick={openCommandMenu} aria-label={`${t('nav.search')} (Ctrl+K)`}>
                            <FiSearch aria-hidden="true" />
                            <span>{t('nav.search')}</span>
                            <kbd aria-hidden="true">⌘K</kbd>
                        </button>
                        <MusicToggle showLabel />
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>

            <button
                type="button"
                className="toggle"
                aria-expanded={expanded}
                aria-controls="nav-links"
                aria-label={t('nav.expand')}
                onClick={() => {
                    if (expanded) {
                        // collapse, even while hovered / focused (until the pointer or focus leaves)
                        setPinned(false)
                        setEscaped(true)
                    } else {
                        setEscaped(false)
                        setPinned(true)
                    }
                }}
            >
                <FiChevronDown aria-hidden="true" />
            </button>

            <a
                className="cta"
                href={`mailto:${userData.user.email}`}
                onClick={(e) => {
                    e.preventDefault()
                    openContactDrawer()
                }}
                aria-haspopup="dialog"
            >
                {t('nav.contact')} <FiArrowUpRight aria-hidden="true" />
            </a>

            <button
                ref={burger}
                type="button"
                className={`burger${menuOpen ? ' is-open' : ''}`}
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? t('nav.closeMenu') : t('nav.menu')}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
            >
                <span />
                <span />
            </button>

            <MobileMenu open={menuOpen} onClose={closeMenu} current={current} goTo={goTo} trigger={burger} />
        </StyledNav>
    )
}
