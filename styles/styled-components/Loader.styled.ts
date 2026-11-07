'use client'
import Styled from 'styled-components'
import Img from '@/public/images/loader.svg'
export const StyledSection = Styled.section`
    position: fixed;
    inset: 0;
    background-color: ${({ theme }) => theme.dark.background};
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    overflow: hidden;
    width: 100%;
    z-index: 99999999999;
    background-image: url(${Img.src});
    background-repeat: no-repeat;
    background-position: center center;

    /* "Built on the grid": lines sweep out from the center (same 50px grid as the page) */
    .loader-grid {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 0;
    }
    .loader-grid::before,
    .loader-grid::after {
        content: '';
        position: absolute;
        inset: 0;
    }
    .loader-grid::before {
        background: repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.06) 0 1px, transparent 1px 50px);
        clip-path: inset(0 50% 0 50%);
        animation: loader-grid-x 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.05s forwards;
    }
    .loader-grid::after {
        background: repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0 1px, transparent 1px 50px);
        clip-path: inset(50% 0 50% 0);
        animation: loader-grid-y 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards;
    }
    @keyframes loader-grid-x {
        to {
            clip-path: inset(0 0 0 0);
        }
    }
    @keyframes loader-grid-y {
        to {
            clip-path: inset(0 0 0 0);
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .loader-grid::before,
        .loader-grid::after {
            animation: none;
            clip-path: none;
        }
    }

    svg {
        position: relative;
        z-index: 1;
    }

`
