'use client'
import { Theme } from '@/types/Theme.types'
import { createGlobalStyle } from 'styled-components'
import { device } from './Breakpoints'
export const GlobalStyle = createGlobalStyle<Theme>`
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
        --font-fira-code: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace;
        --font-dancing-script: "Brush Script MT", cursive;
    }

    body {
        font-family: var(--font-general-sans);
        background-color: ${({ theme }) => theme.dark.background};
        overflow-x: hidden;
    }
    html, body {
      overflow-x: hidden;
  scroll-behavior: smooth;
    cursor: none;
    @media ${device.sm} {
        cursor: initial;
    }
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
