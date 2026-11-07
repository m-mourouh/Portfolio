'use client'
import styled from 'styled-components'
import { device } from './Breakpoints'

export const StyledHeader = styled.header`
    position: sticky;
    top: 0;
    z-index: 99999999;
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 18px 40px;
    pointer-events: none; /* only the pill itself takes clicks */
    transition: transform 0.45s var(--ease-out);

    @media ${device.sm} {
        padding: 10px 16px;
    }

    /* hidden while scrolling down, back on scroll up */
    &.is-hidden {
        transform: translateY(-130%);
    }

    .skip {
        position: absolute;
        left: 16px;
        top: -80px;
        z-index: 2;
        padding: 12px 18px;
        border-radius: 10px;
        background: var(--c-accent);
        color: #111;
        font-weight: 600;
        text-decoration: none;
        pointer-events: auto;

        &:focus {
            top: 12px;
            outline: 2px solid var(--c-text);
            outline-offset: 2px;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`
