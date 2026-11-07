'use client'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FiArrowUpRight, FiArrowUp } from 'react-icons/fi'
import data from '@/data/user.json'
import profilesData from '@/data/profiles.json'
import { useLanguage } from '@/contexts/LanguageContext'
import { getLenis } from '@/lib/lenis'
import { device } from '@/styles/styled-components/Breakpoints'

const SOCIALS: Array<{ key: keyof typeof profilesData.data; label: string }> = [
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'github', label: 'GitHub' },
    { key: 'medium', label: 'Medium' },
    { key: 'x', label: 'X' },
]

/** Final scene: big email call-to-action, socials, live local time, back to top. */
export default function Footer() {
    const { t, language } = useLanguage()
    const [time, setTime] = useState('')

    // Live time in Casablanca (rendered after mount to avoid a hydration mismatch)
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

    const toTop = () => {
        const lenis = getLenis()
        if (lenis) lenis.scrollTo(0)
        else window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <Foot>
            <p className="eyebrow">{t('footer.cta')}</p>
            <a className="big-mail" href={`mailto:${data.user.email}`}>
                <span>{data.user.email}</span>
                <FiArrowUpRight aria-hidden="true" />
            </a>

            <div className="grid">
                <div>
                    <p className="label">{t('footer.socials')}</p>
                    <ul className="socials">
                        {SOCIALS.filter((s) => profilesData.data[s.key]).map((s) => (
                            <li key={s.key}>
                                <a href={profilesData.data[s.key]} target="_blank" rel="noopener noreferrer">
                                    {s.label} <FiArrowUpRight aria-hidden="true" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="label">{t('footer.localTime')}</p>
                    <p className="value">
                        {t('hero.location')}
                        {time && (
                            <>
                                {' '}
                                · <time>{time}</time>
                            </>
                        )}
                    </p>
                </div>
                <div className="top-wrap">
                    <button type="button" className="to-top" onClick={toTop}>
                        {t('footer.backToTop')} <FiArrowUp aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="bottom">
                <span>
                    © {new Date().getFullYear()} {data.user.name}
                </span>
                <span>{t('footer.colophon')}</span>
            </div>
        </Foot>
    )
}

const Foot = styled.footer`
    padding: var(--sp-12) var(--gutter) var(--sp-4);
    border-top: 1px solid var(--c-line);
    color: var(--c-text);
    background: var(--c-bg);

    @media ${device.sm} {
        padding: var(--sp-8) 20px var(--sp-3);
    }

    .eyebrow {
        font-size: var(--fs-micro);
        letter-spacing: var(--tracking-caps);
        text-transform: uppercase;
        color: var(--c-text-muted);
        margin-bottom: var(--sp-2);
    }

    .big-mail {
        display: inline-flex;
        align-items: center;
        gap: 0.3em;
        max-width: 100%;
        font-size: clamp(1.9rem, 6.4vw, 6rem);
        font-weight: 500;
        letter-spacing: -0.035em;
        line-height: 1.05;
        color: var(--c-text);
        text-decoration: none;
        word-break: break-word;
        background: linear-gradient(var(--c-accent), var(--c-accent)) left bottom / 0% 2px no-repeat;
        transition: background-size var(--dur-slow) var(--ease-out), color var(--dur-base) ease;

        svg {
            flex-shrink: 0;
            transition: transform var(--dur-base) var(--ease-out);
        }
        &:hover,
        &:focus-visible {
            color: var(--c-accent);
            background-size: 100% 2px;
            svg {
                transform: translate(6px, -6px);
            }
        }
    }

    .grid {
        display: grid;
        grid-template-columns: 1.4fr 1fr auto;
        gap: var(--sp-6);
        margin-top: var(--sp-12);
        padding-top: var(--sp-4);
        border-top: 1px solid var(--c-line);

        @media ${device.md} {
            grid-template-columns: 1fr;
            gap: var(--sp-4);
            margin-top: var(--sp-8);
        }
    }

    .label {
        font-size: var(--fs-micro);
        letter-spacing: var(--tracking-caps);
        text-transform: uppercase;
        color: var(--c-text-muted);
        margin-bottom: var(--sp-2);
    }

    .socials {
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        gap: var(--sp-1) var(--sp-4);
        padding: 0;
        margin: 0;

        a {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: var(--c-text);
            text-decoration: none;
            font-size: var(--fs-lead);
            transition: color var(--dur-fast) ease;

            &:hover {
                color: var(--c-accent);
            }
        }
    }

    .value {
        font-size: var(--fs-lead);
        color: var(--c-text);

        time {
            color: var(--c-accent);
            font-variant-numeric: tabular-nums;
        }
    }

    .top-wrap {
        display: flex;
        align-items: flex-end;
    }

    .to-top {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 48px;
        padding: 0 20px;
        border-radius: 999px;
        border: 1px solid var(--c-line-strong);
        background: none;
        color: var(--c-text);
        font-size: var(--fs-small);
        cursor: pointer;
        transition: border-color var(--dur-fast) ease;

        &:hover {
            border-color: var(--c-accent);
        }
    }

    .bottom {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: var(--sp-2);
        margin-top: var(--sp-8);
        font-size: var(--fs-small);
        color: var(--c-text-muted);
    }
`
