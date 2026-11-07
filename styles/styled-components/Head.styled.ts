'use client'
import styled from 'styled-components'
import { device } from './Breakpoints'

export const StyledSelection = styled.section`
    position: relative;
    min-height: 100vh;
    min-height: 100svh;
    width: 100%;
    display: flex;
    padding: 120px var(--gutter) 24px;
    color: var(--c-text);
    overflow: hidden;

    @media ${device.sm} {
        padding: 104px 20px 32px;
    }

    .hero-inner {
        position: relative;
        z-index: 2;
        width: 100%;
        display: flex;
        flex-direction: column;

        gap: var(--sp-3);

        /* meta on top; headline + bottom row stay together, centered in the remaining space */
        .hero-meta {
            margin-bottom: auto;
        }
        .hero-bottom {
            margin-bottom: auto;
        }

        @media ${device.md} {
            justify-content: flex-end;

            .hero-bottom {
                margin-bottom: 0;
            }
        }
    }

    /* ---------- top line ---------- */
    .hero-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--sp-2);
        flex-wrap: wrap;
        font-size: var(--fs-micro);
        letter-spacing: var(--tracking-caps);
        text-transform: uppercase;
        color: var(--c-text-muted);
    }

    .identity {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        color: var(--c-text);

        .avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            overflow: hidden;
            outline: 1px solid var(--c-accent);
            outline-offset: 2px;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }

    .status {
        display: inline-flex;
        align-items: center;
        gap: 10px;

        .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--c-accent);
            box-shadow: 0 0 0 0 rgba(196, 255, 0, 0.5);
            animation: hero-pulse 2.4s var(--ease-out) infinite;
        }
        .sep {
            color: var(--c-line-strong);
        }
        @media ${device.sm} {
            .sep,
            .location {
                display: none;
            }
        }
    }

    @keyframes hero-pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(196, 255, 0, 0.45);
        }
        70%,
        100% {
            box-shadow: 0 0 0 10px rgba(196, 255, 0, 0);
        }
    }

    /* ---------- headline ---------- */
    .hero-title {
        max-width: 13ch;
        font-size: var(--fs-display);
        font-weight: 500;
        line-height: 1;
        letter-spacing: -0.035em;
        text-transform: uppercase;
        color: var(--c-text);

        .word {
            display: inline-block;
            vertical-align: top;
        }
        .word-inner {
            display: inline-block;
            will-change: transform, opacity;
        }
        .char {
            display: inline-block;
            /* cursor tint (desktop): --t is 0..1 near the pointer */
            color: inherit;
            color: color-mix(in srgb, var(--c-accent) calc(var(--t, 0) * 70%), var(--c-text));
        }
        /* "systems": holds the underline */
        .accent-word {
            position: relative;
        }
        .underline {
            position: absolute;
            left: 0.04em;
            right: 0.1em;
            bottom: -0.02em;
            height: 2px;
            background: rgba(196, 255, 0, 0.55);
            transform-origin: left center;
            pointer-events: none;
        }
        html[dir='rtl'] & .underline {
            transform-origin: right center;
        }
        .node {
            position: absolute;
            top: 50%;
            left: 100%;
            width: 6px;
            height: 6px;
            margin: -3px 0 0 -3px;
            background: var(--c-accent);
            box-shadow: 0 0 10px rgba(196, 255, 0, 0.8);
            opacity: 0.85;
        }


        .accent {
            color: var(--c-accent);
            font-size: 1.12em;
            line-height: 0.8;
            letter-spacing: -0.02em;
        }

        @media ${device.sm} {
            max-width: none;
            font-size: clamp(2.6rem, 12.5vw, 4rem);
            line-height: 0.98;
        }
    }

    html[dir='rtl'] & .hero-title {
        text-transform: none;
        letter-spacing: 0;
        line-height: 1.15;
        max-width: 14ch;
    }

    /* ---------- bottom row ---------- */
    /* paragraph + actions read as one block; the scroll cue sits apart on the right */
    .hero-bottom {
        display: grid;
        grid-template-columns: minmax(0, 46ch) 1fr;
        align-items: end;
        gap: 24px var(--sp-6);

        .supporting,
        .actions {
            grid-column: 1;
        }
        .scroll-cue {
            grid-column: 2;
            grid-row: 1 / span 2;
            justify-self: end;
        }

        @media ${device.md} {
            .scroll-cue {
                grid-column: 1;
                grid-row: auto;
                justify-self: start;
            }
            grid-template-columns: 1fr;
            gap: var(--sp-3);
        }
    }

    .supporting {
        font-size: var(--fs-lead);
        line-height: 1.55;
        color: var(--c-text-muted);
    }

    .actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;

        @media ${device.sm} {
            flex-direction: column;
            align-items: stretch;
        }
    }

    .btn-primary,
    .btn-ghost {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        height: 54px;
        padding: 0 26px;
        border-radius: 999px;
        font-size: var(--fs-body);
        font-weight: 500;
        text-decoration: none;
        cursor: pointer;
        white-space: nowrap;
        transition: background-color var(--dur-fast) ease, border-color var(--dur-fast) ease, color var(--dur-fast) ease;

        svg {
            transition: transform var(--dur-base) var(--ease-out);
        }
        &:hover svg {
            transform: translate(3px, -3px);
        }
        &:active {
            transform: scale(0.98);
        }
    }

    .btn-primary {
        border: 1px solid var(--c-accent);
        background: var(--c-accent);
        color: #111;

        &:hover {
            background: #d6ff4d;
        }
    }

    .btn-ghost {
        border: 1px solid var(--c-line-strong);
        background: rgba(20, 20, 20, 0.6);
        color: var(--c-text);

        &:hover {
            border-color: var(--c-text-muted);
        }
        &:hover svg {
            transform: translate(3px, 3px);
        }
    }

    .scroll-cue {
        justify-self: end;
        display: inline-flex;
        align-items: center;
        gap: 12px;
        font-size: var(--fs-micro);
        letter-spacing: var(--tracking-caps);
        text-transform: uppercase;
        color: var(--c-text-dim);

        .line {
            position: relative;
            width: 1px;
            height: 44px;
            background: var(--c-line-strong);
            overflow: hidden;

            &::after {
                content: '';
                position: absolute;
                left: 0;
                top: -40%;
                width: 1px;
                height: 40%;
                background: var(--c-accent);
                animation: hero-scroll 2s var(--ease-in-out) infinite;
            }
        }

        @media ${device.md} {
            display: none;
        }
    }

    /* First paint: words wait inside their own masks (their space is already reserved, so
       nothing below moves), text and CTAs wait just below their place. The master timeline in
       Head.tsx takes over (html.hero-live). If it never does, this CSS reveals everything. */
    html.js-anim:not(.hero-live) & .hero-title .word-inner {
        opacity: 0;
        transform: translateY(40px);
        animation: hero-fallback-fade 0.8s cubic-bezier(0.22, 1, 0.36, 1) 2.4s forwards;
    }
    html.js-anim:not(.hero-live) & .hero-title .underline {
        transform: scaleX(0);
        animation: hero-fallback-words 0.6s ease 2.6s forwards;
    }
    /* reduced motion: no movement at all, just a short fade of the headline */
    @media (prefers-reduced-motion: reduce) {
        .hero-title .split {
            animation: hero-fade 0.4s ease both;
        }
    }
    @keyframes hero-fade {
        from {
            opacity: 0;
        }
    }
    html.js-anim:not(.hero-live) & .hero-bottom .supporting,
    html.js-anim:not(.hero-live) & .hero-bottom .actions,
    html.js-anim:not(.hero-live) & .hero-bottom .scroll-cue {
        opacity: 0;
        transform: translateY(16px);
        animation: hero-fallback-fade 0.6s ease 2.5s forwards;
    }
    @keyframes hero-fallback-words {
        to {
            transform: none;
        }
    }
    @keyframes hero-fallback-fade {
        to {
            opacity: 1;
            transform: none;
        }
    }

    /* ---------- the stack as SVG: phone band, and the desktop fallback without WebGL ---------- */
    .hero-band {
        display: none;

        &.is-fallback {
            display: block;
            position: absolute;
            right: 4%;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1;

            svg {
                width: min(40vw, 520px);
            }
        }

        @media ${device.sm} {
            &,
            &.is-fallback {
                display: block;
                position: static;
                transform: none;
                margin: 4px 0 0;
            }
            &.is-fallback svg {
                width: min(74vw, 300px);
            }
        }
    }

    /* ---------- technical readout ---------- */
    .hero-readout {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--sp-3);
        margin: 0;
        padding-top: var(--sp-2);
        border-top: 1px solid var(--c-line);

        /* label and value on one line: keeps the readout inside the first screen */
        div {
            min-width: 0;
            display: flex;
            align-items: baseline;
            gap: 10px;
        }
        dt {
            flex-shrink: 0;
            font-size: var(--fs-micro);
            letter-spacing: var(--tracking-caps);
            text-transform: uppercase;
            color: var(--c-text-muted);
        }
        dd {
            margin: 0;
            font-size: var(--fs-small);
            color: var(--c-text);
            font-variant-numeric: tabular-nums;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            time {
                color: var(--c-accent);
            }
        }

        @media ${device.md} {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        /* only where it fits fully in the first screen (a clipped half-row looks worse than none) */
        @media ${device.sm}, (max-height: 960px) {
            display: none;
        }
    }

    @keyframes hero-scroll {
        to {
            top: 100%;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .status .dot,
        .scroll-cue .line::after {
            animation: none;
        }
    }
`
