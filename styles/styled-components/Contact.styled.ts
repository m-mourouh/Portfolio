'use client'
import styled from 'styled-components'
import { device } from './Breakpoints'
import { padding, selection } from './Helpers'

const mono = `font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;`

export const StyledSection = styled.section`
    ${padding()}
    padding-top: var(--section-space);
    padding-bottom: var(--section-space);
    position: relative;
    width: 100%;
    color: var(--c-text);

    .contact-header {
        text-align: center;
        margin-bottom: var(--sp-8);

        h2 {
            font-family: var(--font-general-sans);
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 400;
            line-height: 1.2;
            color: var(--white);
            margin: 0 0 20px 0;
            ${selection(true, '#fff')}

            .secondary-text {
                color: #888;
                font-weight: 300;
            }
        }
        .subtitle {
            font-size: clamp(1rem, 2vw, 1.25rem);
            color: var(--c-text-muted);
            font-weight: 300;
            line-height: 1.6;
            max-width: 600px;
            margin: 0 auto;
        }
    }

    /* info left, form right; phones: info above the form */
    .contact-grid {
        display: grid;
        grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
        gap: clamp(32px, 5vw, 96px);
        align-items: start;

        @media ${device.md} {
            grid-template-columns: 1fr;
        }
    }

    .info {
        display: grid;
        gap: var(--sp-4);
    }
    .mail {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
    }
    .mail-link {
        font-size: clamp(1.5rem, 2.6vw, 2.5rem);
        font-weight: 500;
        letter-spacing: -0.02em;
        color: var(--c-text);
        text-decoration: none;
        border-bottom: 2px solid var(--c-accent);
        overflow-wrap: anywhere;

        &:hover {
            color: var(--c-accent);
        }
        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: 4px;
        }
    }
    .copy {
        display: grid;
        place-items: center;
        width: 44px;
        height: 44px;
        border-radius: 12px;
        border: 1px solid var(--c-line-strong);
        background: none;
        color: var(--c-text);
        font-size: 18px;
        cursor: pointer;

        &:hover {
            border-color: var(--c-accent);
        }
        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: 2px;
        }
    }
    .copied {
        font-size: 14px;
        color: var(--c-accent);
    }

    .facts {
        display: grid;
        gap: 14px;
        margin: 0;

        div {
            display: grid;
            gap: 4px;
        }
        dt {
            ${mono}
            font-size: 12px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--c-text-muted);
        }
        dd {
            margin: 0;
            font-size: 16px;
        }
        time {
            color: var(--c-accent);
        }
    }
    .avail {
        display: inline-flex;
        align-items: center;
        gap: 10px;

        .dot {
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: var(--c-accent);
            box-shadow: 0 0 0 4px rgba(196, 255, 0, 0.15);
        }
    }

    .elsewhere {
        p {
            ${mono}
            margin: 0 0 10px;
            font-size: 12px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--c-text-muted);
        }
        ul {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            list-style: none;
            margin: 0;
            padding: 0;
        }
        a {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            min-height: 44px;
            padding: 0 14px;
            border-radius: 999px;
            border: 1px solid var(--c-line-strong);
            color: var(--c-text);
            font-size: 15px;
            text-decoration: none;

            &:hover {
                border-color: var(--c-accent);
                color: var(--c-accent);
            }
            &:focus-visible {
                outline: 2px solid var(--c-accent);
                outline-offset: 2px;
            }
        }
    }
`
