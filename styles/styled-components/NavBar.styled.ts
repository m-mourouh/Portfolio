'use client'
import styled from 'styled-components'

const mono = `font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;`
/* below this width: hamburger + full-screen menu */
const compact = '(max-width: 1061px)'

export const StyledNav = styled.nav`
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 100%;
    padding: 7px 7px 7px 14px;
    border: 1px solid rgb(48, 48, 48);
    border-radius: 999px;
    /* opaque enough that page content never shows through */
    background: rgba(20, 20, 20, 0.97);
    backdrop-filter: blur(20px) saturate(140%);
    -webkit-backdrop-filter: blur(20px) saturate(140%);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);

    .logo {
        display: grid;
        place-items: center;
        flex: 0 0 auto;
        border-radius: 50%;

        img {
            width: 38px;
            height: 38px;
        }
        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: 3px;
        }
    }

    /* ---------- compact: current section ---------- */
    .current {
        display: grid;
        grid-template-columns: auto auto;
        align-items: baseline;
        column-gap: 8px;
        padding: 0 6px;
        white-space: nowrap;
        transition: opacity 0.3s var(--ease-out);

        .c-num {
            ${mono}
            font-size: 12px;
            color: var(--c-accent);
        }
        .c-name {
            font-size: 15px;
            font-weight: 500;
            color: var(--c-text);
        }
        .c-bar {
            grid-column: 1 / -1;
            height: 2px;
            margin-top: 5px;
            border-radius: 2px;
            background: var(--c-line-strong);
            overflow: hidden;

            span {
                display: block;
                height: 100%;
                background: var(--c-accent);
                transform-origin: left;
                transition: transform 0.2s linear;
            }
        }
    }
    &.is-expanded .current {
        display: none;
    }

    /* ---------- expanding part (grid 0fr → 1fr) ---------- */
    .expand {
        display: grid;
        grid-template-columns: 0fr;
        transition: grid-template-columns 0.45s var(--ease-out);
    }
    .expand-inner {
        display: flex;
        align-items: center;
        gap: 14px;
        min-width: 0;
        overflow: hidden;
        opacity: 0;
        transition: opacity 0.3s var(--ease-out);
    }
    &.is-expanded .expand {
        grid-template-columns: 1fr;
    }
    &.is-expanded .expand-inner {
        opacity: 1;
        overflow: visible; /* the language dropdown can open */
    }

    .links {
        display: flex;
        gap: 2px;
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .nav-link {
        position: relative;
        display: inline-flex;
        align-items: baseline;
        gap: 6px;
        padding: 10px 12px;
        border-radius: 999px;
        font-size: 15px;
        color: var(--c-text-muted);
        text-decoration: none;
        white-space: nowrap;
        transition: color 0.25s, background 0.25s;

        .n {
            ${mono}
            font-size: 11px;
            color: var(--c-text-muted);
        }
        &:hover {
            color: var(--c-text);
        }
        /* a clear active state: lime pill, not just a dot */
        &.is-current {
            color: #111;
            background: var(--c-accent);

            .n {
                color: #111;
            }
        }
        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: 2px;
        }
    }

    .tools {
        display: flex;
        align-items: center;
        gap: 6px;
        padding-inline-start: 10px;
        border-inline-start: 1px solid var(--c-line);
    }
    .search {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 44px;
        padding: 0 12px;
        border-radius: 12px;
        border: 1px solid rgb(57, 57, 57);
        background: rgb(36, 36, 36);
        color: var(--c-text);
        font-size: 14px;
        cursor: pointer;
        white-space: nowrap;

        kbd {
            ${mono}
            font-size: 11px;
            padding: 2px 5px;
            border-radius: 4px;
            border: 1px solid var(--c-line-strong);
            color: var(--c-text-muted);
        }
        &:hover,
        &:focus-visible {
            border-color: var(--c-accent);
        }
        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: 2px;
        }
    }

    .toggle {
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1px solid var(--c-line-strong);
        background: none;
        color: var(--c-text);
        cursor: pointer;
        transition: transform 0.3s var(--ease-out);

        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: 2px;
        }
    }
    &.is-expanded .toggle {
        transform: rotate(180deg);
    }

    /* the primary action: lime, like the hero CTA */
    .cta {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 44px;
        padding: 0 20px;
        border-radius: 999px;
        background: var(--c-accent);
        color: #111;
        font-weight: 600;
        font-size: 15px;
        text-decoration: none;
        white-space: nowrap;
        transition: transform 0.25s var(--ease-out);

        &:hover {
            transform: translateY(-1px);
        }
        &:focus-visible {
            outline: 2px solid var(--c-text);
            outline-offset: 3px;
        }
    }

    .burger {
        display: none;
    }

    /* ---------- phones / tablets ---------- */
    @media ${compact} {
        width: 100%;
        justify-content: space-between;
        border-radius: 16px;

        .expand,
        .toggle,
        .cta {
            display: none;
        }
        .current {
            margin-inline-end: auto;
        }
        &.is-expanded .current {
            display: grid;
        }
        .burger {
            position: relative;
            display: block;
            width: 48px;
            height: 48px;
            border-radius: 12px;
            border: 1px solid var(--c-line-strong);
            background: #1c1c1c;
            cursor: pointer;

            span {
                position: absolute;
                left: 13px;
                width: 22px;
                height: 2px;
                background: var(--c-text);
                transition: transform 0.35s var(--ease-out), top 0.35s var(--ease-out);
            }
            span:first-child {
                top: 19px;
            }
            span:last-child {
                top: 27px;
            }
            /* morph into a close icon */
            &.is-open span:first-child {
                top: 23px;
                transform: rotate(45deg);
            }
            &.is-open span:last-child {
                top: 23px;
                transform: rotate(-45deg);
            }
            &:focus-visible {
                outline: 2px solid var(--c-accent);
                outline-offset: 3px;
            }
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .expand,
        .expand-inner,
        .toggle,
        .burger span {
            transition: none;
        }
    }
`
