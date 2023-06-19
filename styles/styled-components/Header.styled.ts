'use client'
import styled from 'styled-components'
import { device } from './Breakpoints'

export const StyledHeader = styled.header`
    padding: 0 50px;
    width: 100%;
    height: var(--nav-height);
    position: sticky;
    top: 0;
    z-index: 99999999;
    transition: all 0.5s ease-in-out;
    &.scrolling {
        background: ${({ theme }) => theme.dark.background};
        height: 80px;
        @media ${device.sm} {
            height: 60px;
        }
    }
    @media ${device.sm} {
        height: 60px;
    }
    display: flex;
    align-items: center;
    transition: 0.25s ease-in-out;
    /* media queries */
    @media ${device.sm} {
        padding: 0 20px;
    }
`
