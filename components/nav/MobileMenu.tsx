'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { gsap } from 'gsap'
import { FiCopy, FiCheck, FiArrowUpRight } from 'react-icons/fi'
import { FaLinkedinIn, FaGithub, FaMedium, FaXTwitter } from 'react-icons/fa6'
import { SECTIONS, SectionId } from '@/lib/sections'
import { useLanguage } from '@/contexts/LanguageContext'
import { useLocalTime } from '@/lib/useLocalTime'
import { openContactDrawer } from '@/lib/contactDrawer'
import { getLenis } from '@/lib/lenis'
import userData from '@/data/user.json'
import profiles from '@/data/profiles.json'
import MusicToggle from '../MusicToggle'

/**
 * Full-screen typographic menu (phones / tablets). Rendered into <body> so no transformed or
 * blurred ancestor can clip it. Locks page scroll, traps focus, closes on Esc / link tap /
 * route change, and gives focus back to the trigger.
 */
export default function MobileMenu({
    open,
    onClose,
    current,
    goTo,
    trigger,
}: {
    open: boolean
    onClose: () => void
    current: SectionId
    goTo: (id: string) => void
    trigger: React.RefObject<HTMLButtonElement | null>
}) {
    const { t, language, changeLanguage } = useLanguage()
    const time = useLocalTime(language)
    const panel = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)
    const [copied, setCopied] = useState(false)
    useEffect(() => setMounted(true), [])

    // scroll lock + focus management
    useEffect(() => {
        if (!open) return
        const html = document.documentElement
        const prev = html.style.overflow
        html.style.overflow = 'hidden'
        getLenis()?.stop()
        const first = panel.current?.querySelector<HTMLElement>('a, button')
        first?.focus()
        const triggerEl = trigger.current
        return () => {
            html.style.overflow = prev
            getLenis()?.start()
            triggerEl?.focus()
        }
    }, [open, trigger])

    // Esc + focus trap
    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') return onClose()
            if (e.key !== 'Tab' || !panel.current) return
            const items = Array.from(panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')).filter((el) => el.offsetParent)
            if (!items.length) return
            const firstEl = items[0]
            const lastEl = items[items.length - 1]
            if (e.shiftKey && document.activeElement === firstEl) {
                e.preventDefault()
                lastEl.focus()
            } else if (!e.shiftKey && document.activeElement === lastEl) {
                e.preventDefault()
                firstEl.focus()
            }
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open, onClose])

    // reveal: staggered links (reduced motion: the overlay just fades)
    useLayoutEffect(() => {
        if (!open || !panel.current) return
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const ctx = gsap.context(() => {
            gsap.fromTo(panel.current, { opacity: 0 }, { opacity: 1, duration: reduced ? 0.2 : 0.25, ease: 'none' })
            if (!reduced) {
                gsap.fromTo('.m-link', { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.05, delay: 0.05 })
                gsap.fromTo('.m-foot > *', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out', stagger: 0.04, delay: 0.25 })
            }
        }, panel)
        return () => ctx.revert()
    }, [open])

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(userData.user.email)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            window.location.href = `mailto:${userData.user.email}`
        }
    }

    if (!mounted || !open) return null
    const socials = [
        { href: profiles.data.linkedin, label: 'LinkedIn', icon: <FaLinkedinIn /> },
        { href: profiles.data.github, label: 'GitHub', icon: <FaGithub /> },
        { href: profiles.data.medium, label: 'Medium', icon: <FaMedium /> },
        { href: profiles.data.x, label: 'X', icon: <FaXTwitter /> },
    ].filter((s) => s.href)

    return createPortal(
        <Overlay ref={panel} id="mobile-menu" role="dialog" aria-modal="true" aria-label={t('nav.menu')}>
            <button type="button" className="m-close" onClick={onClose} aria-label={t('nav.closeMenu')}>
                <span />
                <span />
            </button>
            <nav aria-label={t('nav.menu')}>
                <ol className="m-links">
                    {SECTIONS.map((s) => (
                        <li key={s.id} className={current === s.id ? 'is-current' : ''}>
                            <a
                                className="m-link"
                                href={`#${s.id}`}
                                aria-current={current === s.id ? 'location' : undefined}
                                onClick={(e) => {
                                    e.preventDefault()
                                    onClose()
                                    // after the overlay is gone and scrolling is unlocked
                                    requestAnimationFrame(() => goTo(s.id))
                                }}
                            >
                                <span className="m-num">{String(s.n).padStart(2, '0')}</span>
                                {t(s.key)}
                            </a>
                        </li>
                    ))}
                </ol>
            </nav>

            <div className="m-foot">
                <div className="m-mail">
                    <a href={`mailto:${userData.user.email}`} aria-label={`${t('nav.sendEmail')}: ${userData.user.email}`}>
                        {userData.user.email}
                    </a>
                    <button type="button" onClick={copy} aria-label={t('nav.copyEmail')}>
                        {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
                    </button>
                    <span className="m-feedback" role="status">
                        {copied ? t('nav.copied') : ''}
                    </span>
                </div>
                <ul className="m-socials">
                    {socials.map((s) => (
                        <li key={s.label}>
                            <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                                {s.icon}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="m-row">
                    <span className="m-time">
                        {t('nav.localTime')} · Casablanca {time && <time>{time}</time>}
                    </span>
                    <div className="m-tools">
                        <div className="m-lang" role="group" aria-label="Language">
                            {(['en', 'fr', 'ar'] as const).map((l) => (
                                <button key={l} type="button" lang={l} aria-pressed={language === l} onClick={() => changeLanguage(l)}>
                                    {l === 'en' ? 'EN' : l === 'fr' ? 'FR' : 'ع'}
                                </button>
                            ))}
                        </div>
                        <MusicToggle showLabel />
                    </div>
                </div>
                <button
                    type="button"
                    className="m-cta"
                    onClick={() => {
                        onClose()
                        openContactDrawer()
                    }}
                    aria-haspopup="dialog"
                >
                    {t('nav.startProject')} <FiArrowUpRight aria-hidden="true" />
                </button>
            </div>
        </Overlay>,
        document.body
    )
}

const mono = `font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;`

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 2147483000;
    display: flex;
    flex-direction: column;
    height: 100dvh;
    padding: calc(env(safe-area-inset-top) + 76px) calc(env(safe-area-inset-right) + 24px) calc(env(safe-area-inset-bottom) + 20px)
        calc(env(safe-area-inset-left) + 24px);
    overflow-y: auto;
    overscroll-behavior: contain;
    background-color: #141414;
    background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 36px 36px;
    color: var(--c-text);

    .m-close {
        position: absolute;
        top: calc(env(safe-area-inset-top) + 14px);
        right: calc(env(safe-area-inset-right) + 18px);
        width: 48px;
        height: 48px;
        border-radius: 12px;
        border: 1px solid var(--c-line-strong);
        background: #1c1c1c;
        cursor: pointer;

        span {
            position: absolute;
            left: 13px;
            top: 23px;
            width: 22px;
            height: 2px;
            background: var(--c-text);
            transform: rotate(45deg);
        }
        span + span {
            transform: rotate(-45deg);
        }
        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: 3px;
        }
    }

    /* huge numbered links on a node line */
    .m-links {
        position: relative;
        list-style: none;
        margin: 0;
        padding: 0 0 0 26px;

        &::before {
            content: '';
            position: absolute;
            left: 5px;
            top: 18px;
            bottom: 18px;
            width: 1px;
            background: var(--c-line-strong);
        }
        li {
            position: relative;
            overflow: hidden;

            &::before {
                content: '';
                position: absolute;
                left: -26px;
                top: 50%;
                width: 11px;
                height: 11px;
                margin-top: -5px;
                border-radius: 2px;
                border: 1px solid var(--c-text-muted);
                background: #141414;
            }
            &.is-current::before {
                background: var(--c-accent);
                border-color: var(--c-accent);
            }
        }
    }
    .m-link {
        display: flex;
        align-items: baseline;
        gap: 14px;
        padding: 6px 0;
        font-size: clamp(2.75rem, 13vw, 4rem);
        font-weight: 500;
        line-height: 1.05;
        letter-spacing: -0.03em;
        color: var(--c-text-muted);
        text-decoration: none;

        .m-num {
            ${mono}
            font-size: 14px;
            letter-spacing: 0.1em;
            color: var(--c-text-muted);
        }
        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: 2px;
            border-radius: 4px;
        }
    }
    .is-current .m-link {
        color: var(--c-text);

        .m-num {
            color: var(--c-accent);
        }
    }

    .m-foot {
        display: grid;
        gap: 18px;
        margin-top: auto;
        padding-top: 32px;
    }
    .m-mail {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;

        a {
            font-size: 18px;
            color: var(--c-text);
            text-decoration: none;
            border-bottom: 1px solid var(--c-line-strong);
            padding: 10px 0;
        }
        button {
            display: grid;
            place-items: center;
            width: 44px;
            height: 44px;
            border-radius: 10px;
            border: 1px solid var(--c-line-strong);
            background: none;
            color: var(--c-text);
            font-size: 17px;
            cursor: pointer;
        }
        .m-feedback {
            font-size: 14px;
            color: var(--c-accent);
        }
        a:focus-visible,
        button:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: 3px;
        }
    }
    .m-socials {
        display: flex;
        gap: 8px;
        list-style: none;
        margin: 0;
        padding: 0;

        a {
            display: grid;
            place-items: center;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: 1px solid var(--c-line-strong);
            color: var(--c-text);
            font-size: 17px;

            &:focus-visible {
                outline: 2px solid var(--c-accent);
                outline-offset: 3px;
            }
        }
    }
    .m-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }
    .m-time {
        ${mono}
        font-size: 14px;
        letter-spacing: 0.06em;
        color: var(--c-text-muted);

        time {
            color: var(--c-accent);
        }
    }
    .m-tools {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
    }
    .m-lang {
        display: inline-flex;
        padding: 3px;
        border: 1px solid var(--c-line-strong);
        border-radius: 12px;

        button {
            min-width: 44px;
            height: 40px;
            border: 0;
            border-radius: 9px;
            background: none;
            color: var(--c-text-muted);
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;

            &[aria-pressed='true'] {
                background: var(--c-accent);
                color: #111;
            }
            &:focus-visible {
                outline: 2px solid var(--c-accent);
                outline-offset: 2px;
            }
        }
    }
    .m-cta {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        min-height: 52px;
        border: 0;
        border-radius: 999px;
        background: var(--c-accent);
        color: #111;
        font-size: 17px;
        font-weight: 600;
        cursor: pointer;

        &:focus-visible {
            outline: 2px solid var(--c-text);
            outline-offset: 3px;
        }
    }
`
