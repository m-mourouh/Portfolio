'use client'
import styled from 'styled-components'

/** Section label like "03 — Work": the same lime numbering as the project cards. */
export default function SectionIndex({ n, label, center = false }: { n: number; label: string; center?: boolean }) {
    return (
        <Eyebrow className={`section-index${center ? ' center' : ''}`}>
            <span className="num">{String(n).padStart(2, '0')}</span>
            <span className="line" aria-hidden="true" />
            <span className="label">{label}</span>
        </Eyebrow>
    )
}

const Eyebrow = styled.p`
    /* its own line above the title, only as wide as its content */
    display: flex;
    width: fit-content;
    align-items: center;
    gap: 12px;
    margin: 0 0 20px;
    font-family: var(--font-general-sans);
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #888;

    &.center {
        margin-inline: auto;
    }

    .num {
        color: #c4ff00;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
    }

    .line {
        width: 36px;
        height: 1px;
        background: #444;
    }
`
