'use client'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { gsap } from 'gsap'
import { FiArrowUpRight } from 'react-icons/fi'
import { CERTIFICATIONS, FEATURED_CERTS } from '@/lib/expertise'
import { useLanguage } from '@/contexts/LanguageContext'
import { device } from '@/styles/styled-components/Breakpoints'

/**
 * Certifications ledger: the four most relevant first, "Show all" reveals the rest.
 * Hover / focus a row to highlight its technology in the diagram (only when the mapping is clear).
 */
const ordered = [
    ...FEATURED_CERTS.map((id) => CERTIFICATIONS.find((c) => c.id === id)!),
    ...CERTIFICATIONS.filter((c) => !FEATURED_CERTS.includes(c.id)),
]

export default function CertLedger({ onHighlight }: { onHighlight: (tech: string | null) => void }) {
    const { t } = useLanguage()
    const [open, setOpen] = useState(false)
    const list = useRef<HTMLOListElement>(null)
    const first = useRef(true)

    // animate the newly shown rows (reduced motion: they simply appear)
    useEffect(() => {
        if (first.current) {
            first.current = false
            return
        }
        if (!open || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const rows = list.current?.querySelectorAll('.extra')
        if (rows?.length) gsap.fromTo(rows, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', stagger: 0.04 })
    }, [open])

    return (
        <Ledger>
            <h3 className="ledger-title">
                {t('skills.certifications')} <span>{String(CERTIFICATIONS.length).padStart(2, '0')}</span>
            </h3>
            <ol className="rows" ref={list} id="cert-rows">
                {ordered.map((c, i) => {
                    const extra = i >= FEATURED_CERTS.length
                    return (
                        <li key={c.id} className={extra ? 'extra' : ''} hidden={extra && !open}>
                            <a
                                className="row"
                                href={c.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseEnter={() => onHighlight(c.tech || null)}
                                onMouseLeave={() => onHighlight(null)}
                                onFocus={() => onHighlight(c.tech || null)}
                                onBlur={() => onHighlight(null)}
                            >
                                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                                <span className="title">{t(c.nameKey)}</span>
                                <span className="issuer">{c.issuer}</span>
                                <span className="year">{c.year}</span>
                                <FiArrowUpRight className="arrow" aria-hidden="true" />
                            </a>
                        </li>
                    )
                })}
            </ol>
            <button type="button" className="more" aria-expanded={open} aria-controls="cert-rows" onClick={() => setOpen((o) => !o)}>
                {open ? t('skills.showFewerCerts') : t('skills.showAllCerts', { count: CERTIFICATIONS.length })}
            </button>
        </Ledger>
    )
}

const Ledger = styled.div`
    margin-top: var(--section-space);
    color: var(--c-text);

    .ledger-title {
        display: flex;
        align-items: baseline;
        gap: 12px;
        margin: 0 0 var(--sp-3);
        font-size: clamp(1.5rem, 2.4vw, 2.25rem);
        font-weight: 500;
        letter-spacing: -0.02em;

        span {
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 14px;
            color: var(--c-accent);
        }
    }
    .rows {
        list-style: none;
        margin: 0;
        padding: 0;
        border-top: 1px solid var(--c-line);

        li[hidden] {
            display: none;
        }
    }
    .row {
        display: grid;
        grid-template-columns: 48px minmax(0, 1fr) minmax(140px, auto) 56px 24px;
        gap: 16px;
        align-items: center;
        min-height: 56px;
        padding: 14px 8px;
        border-bottom: 1px solid var(--c-line);
        color: inherit;
        text-decoration: none;
        transition: background 0.25s;

        &:hover,
        &:focus-visible {
            background: rgba(255, 255, 255, 0.03);
        }
        &:hover .title,
        &:focus-visible .title,
        &:hover .arrow,
        &:focus-visible .arrow {
            color: var(--c-accent);
        }
        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: -2px;
        }
        @media ${device.sm} {
            grid-template-columns: 36px minmax(0, 1fr) 24px;
            gap: 4px 12px;

            .issuer {
                grid-column: 2;
                grid-row: 2;
            }
            .year {
                display: none;
            }
            .arrow {
                grid-row: 1 / span 2;
                grid-column: 3;
            }
        }
    }
    .num,
    .year {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 13px;
        color: var(--c-accent);
    }
    .title {
        font-size: 17px;
        font-weight: 500;
        color: var(--c-text);
        transition: color 0.25s;
    }
    .issuer {
        font-size: 14px;
        color: var(--c-text-muted);
    }
    .arrow {
        color: var(--c-text-muted);
        transition: color 0.25s;
    }
    .more {
        display: block;
        min-height: 44px;
        margin: var(--sp-3) 0 0;
        padding: 0 20px;
        border-radius: 999px;
        border: 1px solid var(--c-line-strong);
        background: none;
        color: var(--c-text);
        font-size: 15px;
        cursor: pointer;

        &:hover {
            border-color: var(--c-accent);
            color: var(--c-accent);
        }
        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: 3px;
        }
    }
`
