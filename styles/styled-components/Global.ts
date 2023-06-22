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
        --orchid: #9400FF;
        --white: #FFFFFF;
        --gray: #D3D3D3;
        --subtitle: #6a6174;
        --thumb: #41354a;
        --c1: #878787;
        --c2: #897c8d;
        --nav-height: 100px;
        --fz-heading: 32px;
    }

    body {
        font-family: var(--font-roboto);
        background-color: ${({ theme }) => theme.dark.background};
        overflow-x: hidden;
    }
    html, body {
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
    background-color: var(--thumb);
    border: 3px solid ${({ theme }) => theme.dark.background};
    border-radius: 10px;
}
::selection {
        background: var(--thumb);
        color: var(--orchid);
}

`
