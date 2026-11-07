'use client'
import styled from 'styled-components'
import { device } from './Breakpoints'
import { padding } from './Helpers'

const mono = `font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;`

export const StyledAbout = styled.section`
    &.about {
        position: relative;
        width: 100%;
        color: var(--c-text);
        ${padding()}
        padding-top: var(--section-space);
        padding-bottom: var(--section-space);
        display: grid;
        gap: var(--section-space);

        @media ${device.sm} {
            gap: var(--sp-8);
        }
    }

    /* ---------- portrait + text: asymmetric 12-column composition ---------- */
    .about__grid {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        column-gap: 24px;
        align-items: center;

        @media ${device.sm} {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: var(--sp-4);
        }
    }

    .portrait {
        grid-column: 1 / span 5;
        margin: 0;

        @media ${device.md} {
            grid-column: 1 / span 5;
            align-self: start;
        }
        @media ${device.sm} {
            align-self: stretch;
        }
    }
    .portrait-frame {
        position: relative;
        aspect-ratio: 4 / 5;
        overflow: hidden;
        background: #111;
        /* thin lime edge */
        box-shadow: inset 2px 0 0 var(--c-accent);

        @media ${device.sm} {
            aspect-ratio: 16 / 11; /* a cropped band on phones */
        }

        img {
            object-fit: cover;
            object-position: 50% 30%;
            /* charcoal duotone */
            filter: grayscale(1) contrast(1.12) brightness(0.78);
            transition: filter 0.6s ease;

            @media ${device.sm} {
                object-position: 50% 26%;
            }
        }
        .tint {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(22, 22, 22, 0.7), rgba(22, 22, 22, 0) 45%),
                linear-gradient(rgba(196, 255, 0, 0.06), rgba(196, 255, 0, 0.06));
            mix-blend-mode: normal;
        }
        /* fine technical grid */
        .grid {
            position: absolute;
            inset: 0;
            background-image: linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
            background-size: 32px 32px;
            -webkit-mask-image: linear-gradient(to bottom, #000, rgba(0, 0, 0, 0.35));
            mask-image: linear-gradient(to bottom, #000, rgba(0, 0, 0, 0.35));
        }
        .corner {
            position: absolute;
            width: 18px;
            height: 18px;
            border: 0 solid var(--c-accent);
        }
        .tl {
            top: 10px;
            left: 10px;
            border-top-width: 1px;
            border-left-width: 1px;
        }
        .tr {
            top: 10px;
            right: 10px;
            border-top-width: 1px;
            border-right-width: 1px;
        }
        .bl {
            bottom: 10px;
            left: 10px;
            border-bottom-width: 1px;
            border-left-width: 1px;
        }
        .br {
            bottom: 10px;
            right: 10px;
            border-bottom-width: 1px;
            border-right-width: 1px;
        }

        @media (hover: hover) and (pointer: fine) {
            &:hover img {
                filter: grayscale(1) contrast(1.12) brightness(0.92);
            }
        }
    }
    .portrait figcaption {
        ${mono}
        margin-top: 12px;
        font-size: 12px;
        letter-spacing: 0.14em;
        color: var(--c-text-muted);
    }

    .about__text {
        grid-column: 7 / span 6;

        @media ${device.md} {
            grid-column: 6 / span 7;
        }
    }

    .about__heading {
        font-size: var(--fs-h2);
        font-weight: 500;
        line-height: 1;
        letter-spacing: -0.03em;
        text-transform: uppercase;
        color: var(--c-text);
        margin: 0 0 var(--sp-4);

        .serif {
            color: var(--c-accent);
            text-transform: none;
        }
    }

    /* ---------- interactive paragraph ---------- */
    .about__intro {
        font-size: clamp(1.125rem, 1.6vw, 1.625rem);
        line-height: 1.6;
        color: var(--c-text);
        margin: 0;

        .morocco {
            color: var(--c-accent);
        }
        .secondary-text {
            color: var(--c-text-muted);
        }
    }

    .term {
        position: relative;
        display: inline;
    }
    .term-btn {
        display: inline;
        padding: 0;
        margin: 0;
        font: inherit;
        line-height: inherit;
        color: var(--c-text);
        background: none;
        border: 0;
        border-bottom: 1px dashed rgba(196, 255, 0, 0.6);
        cursor: pointer;
        transition: color 0.2s ease, border-color 0.2s ease;

        &:hover,
        &[aria-expanded='true'] {
            color: var(--c-accent);
            border-bottom-style: solid;
        }
        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: 3px;
            border-radius: 2px;
        }
        /* larger touch target without changing the text layout */
        @media (pointer: coarse) {
            padding-block: 10px;
            margin-block: -10px;
        }
    }
    .term-card {
        --shift: 0px;
        position: absolute;
        z-index: 20;
        left: 0;
        top: calc(100% + 10px);
        transform: translateX(var(--shift));
        display: grid;
        gap: 6px;
        width: max-content;
        max-width: min(340px, calc(100vw - 32px));
        padding: 14px 16px;
        border: 1px solid var(--c-line-strong);
        border-left: 2px solid var(--c-accent);
        border-radius: 6px;
        background: rgba(20, 20, 20, 0.98);
        box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
        font-size: 14px;
        line-height: 1.5;
        text-align: start;
        opacity: 1 !important; /* never dimmed by the word highlight */

        &[hidden] {
            display: none;
        }
        .tc-title {
            font-weight: 600;
            color: var(--c-accent);
        }
        .tc-text {
            color: var(--c-text);
        }
        .tc-meta {
            ${mono}
            font-size: 12px;
            letter-spacing: 0.04em;
            color: var(--c-text-muted);
        }
        .tc-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 4px;

            button,
            a {
                display: inline-flex;
                align-items: center;
                min-height: 36px;
                padding: 6px 12px;
                border: 1px solid var(--c-line-strong);
                border-radius: 999px;
                background: none;
                font: inherit;
                font-size: 13px;
                color: var(--c-text);
                text-decoration: none;
                cursor: pointer;

                &:hover {
                    border-color: var(--c-accent);
                    color: var(--c-accent);
                }
                &:focus-visible {
                    outline: 2px solid var(--c-accent);
                    outline-offset: 2px;
                }
                @media (pointer: coarse) {
                    min-height: 44px;
                }
            }
        }
    }

    /* ---------- facts strip ---------- */
    .about__foot {
        margin-top: calc(var(--sp-4) - var(--section-space));
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--sp-4);
        padding-top: var(--sp-3);
        border-top: 1px solid var(--c-line);

        @media ${device.sm} {
            flex-direction: column;
            align-items: flex-start;
        }
    }
    .facts {
        ${mono}
        display: flex;
        flex-wrap: wrap;
        gap: 8px 0;
        list-style: none;
        margin: 0;
        padding: 0;
        font-size: 12px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--c-text-muted);

        li + li::before {
            content: '·';
            margin: 0 12px;
            color: var(--c-accent);
        }

        /* phones: a compact two-column list instead of a wrapped line */
        @media ${device.sm} {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px 16px;

            li::before,
            li + li::before {
                content: '';
                display: inline-block;
                width: 5px;
                height: 5px;
                margin: 0 8px 2px 0;
                background: var(--c-accent);
            }
        }
    }
`
