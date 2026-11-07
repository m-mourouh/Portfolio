'use client'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import {
    FiSearch,
    FiHome,
    FiUser,
    FiCode,
    FiBriefcase,
    FiEdit3,
    FiMail,
    FiCopy,
    FiGithub,
    FiLinkedin,
    FiGlobe,
    FiFolder,
    FiCornerDownLeft,
    FiMusic,
} from 'react-icons/fi'
import { FaDev, FaMedium } from 'react-icons/fa'
import Modal from './ui/Modal'
import Notification from './Notification'
import { useLanguage } from '@/contexts/LanguageContext'
import { getLenis } from '@/lib/lenis'
import { openContactDrawer } from '@/lib/contactDrawer'
import { toggleMusic } from './BackgroundMusic'
import { onOpenCommandMenu, openProject } from '@/lib/commandMenu'
import { projects } from '@/lib/projects'
import profiles from '@/data/profiles.json'
import userData from '@/data/user.json'

type Item = {
    id: string
    group: string
    label: string
    keywords?: string
    icon: ReactNode
    run: () => void
}

// Case- and accent-insensitive matching ("francais" finds "Français")
const normalize = (s: string) =>
    s
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()

const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    // not on the home page (e.g. a case study): go to the section there
    if (!el) return window.location.assign(id === 'head' ? '/' : `/#${id}`)
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(el, { offset: id === 'head' ? 0 : -90 })
    else el.scrollIntoView({ behavior: 'smooth' })
}

/** Ctrl+K / ⌘K command palette: jump to sections, open projects, contact actions, language. */
export default function CommandMenu() {
    const { t, changeLanguage } = useLanguage()
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [active, setActive] = useState(0)
    const [toast, setToast] = useState<{ key: number; message: string } | null>(null)
    const pending = useRef<(() => void) | null>(null)
    const listRef = useRef<HTMLUListElement>(null)

    // Global shortcut + "open" events (navbar button)
    useEffect(() => {
        const show = () => {
            setQuery('')
            setActive(0)
            setOpen(true)
        }
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault()
                setOpen((isOpen) => {
                    if (!isOpen) {
                        setQuery('')
                        setActive(0)
                    }
                    return true
                })
            }
        }
        window.addEventListener('keydown', onKey)
        const off = onOpenCommandMenu(show)
        return () => {
            window.removeEventListener('keydown', onKey)
            off()
        }
    }, [])

    useEffect(() => {
        if (!toast) return
        const timer = setTimeout(() => setToast(null), 3600)
        return () => clearTimeout(timer)
    }, [toast])

    const items = useMemo<Item[]>(() => {
        const nav = t('cmd.groups.navigation')
        const proj = t('cmd.groups.projects')
        const act = t('cmd.groups.actions')
        const lang = t('cmd.groups.language')
        const list: Item[] = [
            { id: 'nav-home', group: nav, label: t('nav.home'), keywords: 'home top hero', icon: <FiHome />, run: () => scrollToSection('head') },
            { id: 'nav-about', group: nav, label: t('nav.about'), keywords: 'about', icon: <FiUser />, run: () => scrollToSection('about') },
            { id: 'nav-skills', group: nav, label: t('nav.skills'), keywords: 'skills stack', icon: <FiCode />, run: () => scrollToSection('skills') },
            { id: 'nav-work', group: nav, label: t('nav.work'), keywords: 'work projects portfolio', icon: <FiBriefcase />, run: () => scrollToSection('projects') },
            { id: 'nav-articles', group: nav, label: t('cmd.articles'), keywords: 'articles blog writing medium', icon: <FiEdit3 />, run: () => scrollToSection('articles') },
            { id: 'nav-contact', group: nav, label: t('nav.contact'), keywords: 'contact', icon: <FiMail />, run: () => scrollToSection('contact') },
        ]
        projects
            .filter((p) => !p.hidden)
            .forEach((p) =>
                list.push({
                    id: `project-${p.id}`,
                    group: proj,
                    label: p.name,
                    keywords: p.stack.join(' '),
                    icon: <FiFolder />,
                    run: () => (document.getElementById('projects') ? openProject(p.id) : window.location.assign(`/work/${p.id}`)),
                })
            )
        list.push(
            { id: 'act-contact', group: act, label: t('cmd.openContact'), keywords: 'hire contact message email', icon: <FiMail />, run: openContactDrawer },
            {
                id: 'act-copy',
                group: act,
                label: t('cmd.copyEmail'),
                keywords: `copy email ${userData.user.email}`,
                icon: <FiCopy />,
                run: async () => {
                    try {
                        await navigator.clipboard.writeText(userData.user.email)
                        setToast({ key: Date.now(), message: t('cmd.emailCopied') })
                    } catch {
                        window.location.href = `mailto:${userData.user.email}`
                    }
                },
            }
        )
        list.push({ id: 'act-music', group: act, label: t('cmd.toggleMusic'), keywords: 'music sound audio musique son', icon: <FiMusic />, run: toggleMusic })
        if (profiles.data.github)
            list.push({ id: 'act-github', group: act, label: 'GitHub', keywords: 'github code', icon: <FiGithub />, run: () => window.open(profiles.data.github, '_blank', 'noopener') })
        if (profiles.data.linkedin)
            list.push({ id: 'act-linkedin', group: act, label: 'LinkedIn', keywords: 'linkedin cv resume', icon: <FiLinkedin />, run: () => window.open(profiles.data.linkedin, '_blank', 'noopener') })
        if (profiles.data.medium)
            list.push({ id: 'act-medium', group: act, label: 'Medium', keywords: 'medium articles blog writing', icon: <FaMedium />, run: () => window.open(profiles.data.medium, '_blank', 'noopener') })
        if (profiles.data.devto)
            list.push({ id: 'act-devto', group: act, label: 'dev.to', keywords: 'devto articles blog', icon: <FaDev />, run: () => window.open(profiles.data.devto, '_blank', 'noopener') })
        list.push(
            { id: 'lang-en', group: lang, label: 'English', keywords: 'language langue en', icon: <FiGlobe />, run: () => changeLanguage('en') },
            { id: 'lang-fr', group: lang, label: 'Français', keywords: 'language langue fr french', icon: <FiGlobe />, run: () => changeLanguage('fr') },
            { id: 'lang-ar', group: lang, label: 'العربية', keywords: 'language langue ar arabic', icon: <FiGlobe />, run: () => changeLanguage('ar') }
        )
        // Hide the Articles shortcut if that section isn't on the page (e.g. dev.to unavailable)
        return list.filter((i) => i.id !== 'nav-articles' || (typeof document !== 'undefined' && document.getElementById('articles')))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [t, changeLanguage, open])

    const results = useMemo(() => {
        const q = normalize(query.trim())
        if (!q) return items
        return items.filter((i) => normalize(`${i.label} ${i.keywords || ''} ${i.group}`).includes(q))
    }, [items, query])

    useEffect(() => setActive(0), [query])

    // Keep the highlighted row visible while navigating with arrows
    useEffect(() => {
        listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
    }, [active])

    if (!open) {
        return toast ? <Notification key={toast.key} message={toast.message} /> : null
    }

    return (
        <>
            {toast && <Notification key={toast.key} message={toast.message} />}
            <Modal
                variant="palette"
                labelledBy="command-menu-label"
                onClose={() => {
                    setOpen(false)
                    // Run the chosen command after the menu is gone (scroll is unlocked, focus restored)
                    const run = pending.current
                    pending.current = null
                    run?.()
                }}
            >
                {(close) => {
                    const choose = (item?: Item) => {
                        if (!item) return
                        pending.current = item.run
                        close()
                    }
                    let lastGroup = ''
                    return (
                        <Palette>
                            <label className="search" id="command-menu-label">
                                <FiSearch aria-hidden="true" />
                                <input
                                    data-autofocus
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder={t('cmd.placeholder')}
                                    aria-label={t('cmd.placeholder')}
                                    role="combobox"
                                    aria-expanded="true"
                                    aria-controls="command-menu-list"
                                    aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
                                    autoComplete="off"
                                    spellCheck={false}
                                    onKeyDown={(e) => {
                                        if (e.key === 'ArrowDown') {
                                            e.preventDefault()
                                            setActive((i) => (results.length ? (i + 1) % results.length : 0))
                                        } else if (e.key === 'ArrowUp') {
                                            e.preventDefault()
                                            setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0))
                                        } else if (e.key === 'Enter') {
                                            e.preventDefault()
                                            choose(results[active])
                                        }
                                    }}
                                />
                                <kbd>Esc</kbd>
                            </label>

                            <ul className="results" id="command-menu-list" role="listbox" ref={listRef}>
                                {results.length === 0 && <li className="empty">{t('cmd.noResults')}</li>}
                                {results.map((item, index) => {
                                    const showGroup = item.group !== lastGroup
                                    lastGroup = item.group
                                    return (
                                        <li key={item.id} role="presentation">
                                            {showGroup && <div className="group">{item.group}</div>}
                                            <div
                                                id={`cmd-${item.id}`}
                                                role="option"
                                                aria-selected={index === active}
                                                data-index={index}
                                                className={`item${index === active ? ' active' : ''}`}
                                                onMouseMove={() => index !== active && setActive(index)}
                                                onClick={() => choose(item)}
                                            >
                                                <span className="icon">{item.icon}</span>
                                                <span className="label">{item.label}</span>
                                                {index === active && <FiCornerDownLeft className="enter" aria-hidden="true" />}
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>

                            <div className="hints" aria-hidden="true">
                                <span>
                                    <kbd>↑</kbd>
                                    <kbd>↓</kbd> {t('cmd.hintNavigate')}
                                </span>
                                <span>
                                    <kbd>↵</kbd> {t('cmd.hintSelect')}
                                </span>
                                <span>
                                    <kbd>Esc</kbd> {t('cmd.hintClose')}
                                </span>
                            </div>
                        </Palette>
                    )
                }}
            </Modal>
        </>
    )
}

const Palette = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    font-family: var(--font-general-sans);

    kbd {
        font-family: inherit;
        font-size: 0.75rem;
        padding: 2px 7px;
        border-radius: 6px;
        border: 1px solid rgb(60, 60, 60);
        background: rgb(32, 32, 32);
        color: #aaa;
    }

    .search {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 18px 20px;
        border-bottom: 1px solid rgb(45, 45, 45);
        color: #888;
        font-size: 1.15rem;

        input {
            flex: 1;
            min-width: 0;
            background: none;
            border: none;
            outline: none;
            color: var(--white);
            font-family: inherit;
            font-size: 1.05rem;

            &::placeholder {
                color: #777;
            }
        }
    }

    .results {
        list-style: none;
        margin: 0;
        padding: 8px;
        overflow-y: auto;
        overscroll-behavior: contain;
        min-height: 0;
        flex: 1;
    }

    .group {
        padding: 12px 12px 6px;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #777;
    }

    .item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 11px 12px;
        border-radius: 10px;
        cursor: pointer;
        color: #ddd;

        .icon {
            display: grid;
            place-items: center;
            color: #888;
            font-size: 1.05rem;
        }

        .label {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .enter {
            color: #888;
        }

        &.active {
            background: rgb(36, 36, 36);
            color: var(--white);

            .icon {
                color: #c4ff00;
            }
        }
    }

    .empty {
        padding: 28px 12px;
        text-align: center;
        color: #777;
    }

    .hints {
        display: flex;
        gap: 18px;
        padding: 12px 20px;
        border-top: 1px solid rgb(45, 45, 45);
        font-size: 0.8rem;
        color: #777;

        span {
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }

        @media (max-width: 600px) {
            display: none;
        }
    }
`
