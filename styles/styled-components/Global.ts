'use client'
import { createGlobalStyle } from 'styled-components'
import { device } from './Breakpoints'
export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    :root {
        /* colors varibales */
        --orchid: #c4ff00;
        --white: #FFFFFF;
        --black: #000;
        --gray: #D3D3D3;
        --subtitle: #6a6174;
        --thumb: #41354a;
        --c1: #878787;
        --c2: #ebebeb99;
        --nav-height: 100px;
        --fz-heading: 32px;
        --color-1: #00fff5;
        --color-2: #00ff45;

        /* Font families - using system fonts as fallback */
        --font-general-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        --font-roboto: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        --font-roboto-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace;
        --font-dancing-script: "Brush Script MT", cursive;

        /* ===== Design tokens: "Systems in Motion" ===== */
        /* color */
        --c-bg: #141414;
        --c-surface: #1c1c1c;
        --c-surface-2: #242424;
        --c-line: #2d2d2d;
        --c-line-strong: #3d3d3d;
        --c-text: #f3f1ec;          /* warm white */
        --c-text-muted: #a3a3a3;    /* >= 4.5:1 on surfaces */
        --c-text-dim: #7a7a7a;      /* large text / decoration only */
        --c-accent: #c4ff00;        /* electric acid lime */
        --c-accent-dim: rgba(196, 255, 0, 0.14);
        /* type scale (fluid) */
        --fs-display: clamp(2.75rem, min(6.6vw, 9.4vh), 8.25rem);
        --fs-h2: clamp(2.25rem, 4.6vw, 4.25rem);
        --fs-h3: clamp(1.35rem, 2vw, 1.75rem);
        --fs-lead: clamp(1.05rem, 1.4vw, 1.3rem);
        --fs-body: 1rem;
        --fs-small: 0.875rem;
        --fs-micro: 0.75rem;
        --tracking-caps: 0.16em;
        /* spacing (8pt) */
        --sp-1: 8px;
        --sp-2: 16px;
        --sp-3: 24px;
        --sp-4: 32px;
        --sp-6: 48px;
        --sp-8: 64px;
        --sp-12: 96px;
        --sp-16: 128px;
        /* grid */
        --grid-cell: 50px;
        --gutter: clamp(20px, 7.8vw, 150px);
        /* one vertical rhythm for every section */
        --section-space: clamp(72px, 7.5vw, 136px);
        /* shape */
        --radius-s: 8px;
        --radius-m: 14px;
        --radius-l: 22px;
        /* motion */
        --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
        --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
        --dur-fast: 0.2s;
        --dur-base: 0.45s;
        --dur-slow: 0.9s;
    }

    /* Visible keyboard focus everywhere (mouse clicks don't show it) */
    :focus-visible {
        outline: 2px solid var(--c-accent);
        outline-offset: 3px;
    }

    /* Editorial serif accent (Latin only; Arabic keeps Tajawal) */
    .serif {
        font-family: var(--font-serif-display), Georgia, serif;
        font-style: italic;
        font-weight: 400;
        letter-spacing: -0.01em;
        text-transform: none;
    }

    /* Hidden visually, still read by screen readers */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    body {
        font-family: var(--font-space-grotesk), var(--font-general-sans);
        background-color: ${({ theme }) => theme.dark.background};
        overflow-x: hidden;
        overflow-x: clip; /* clip, not hidden: hidden makes <body> a scroll container and breaks the sticky header */
    }

    html, body {
      overflow-x: hidden;
      overflow-x: clip;
      scroll-behavior: smooth;
      cursor: none;
      @media ${device.sm} {
          cursor: initial;
      }
    }

    /* Lenis smooth scroll: native smooth-behavior must be off while Lenis runs */
    html.lenis, html.lenis body {
        height: auto;
    }
    .lenis.lenis-smooth {
        scroll-behavior: auto !important;
    }
    .lenis.lenis-stopped {
        overflow: hidden;
    }

    /* Apply Tajawal font for Arabic (RTL) - must come after body rules */
    html[dir="rtl"] body,
    html[dir="rtl"] * {
        font-family: var(--font-tajawal), var(--font-general-sans) !important;
    }

    /* Apply Space Grotesk for LTR languages (English, French) */
    html[dir="ltr"] body,
    html[dir="ltr"] *:not(.serif) {
        font-family: var(--font-space-grotesk), var(--font-general-sans) !important;
    }
    html[dir="ltr"] .serif {
        font-family: var(--font-serif-display), Georgia, serif !important;
    }
    /* Scrollbar */
::-webkit-scrollbar {
  width: 0px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
    background-color: var(--black);
    border: 3px solid ${({ theme }) => theme.dark.background};
    border-radius: 10px;
}
::selection {
        background: #2e2e2e;
        color: var(--white);
        border-radius: 50%;
}

.gtm-iframe {
    display: none !important;
    visibility: hidden !important;
}

`
