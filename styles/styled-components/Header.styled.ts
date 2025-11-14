'use client'
import styled from 'styled-components'
import { device } from './Breakpoints'

export const StyledHeader = styled.header`
    padding: 20px 50px;
    width: 100%;
    height: auto;
    position: sticky;
    top: 0;
    z-index: 99999999;
    transition: all 0.5s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.25s ease-in-out;

    /* media queries */
    @media ${device.sm} {
        padding: 10px 20px;
    }

    > nav {
        max-width: 1400px;
        width: 100%;
        background-color: var(--nav-bg);
        backdrop-filter: blur(0px);
        -webkit-backdrop-filter: blur(0px);
        border-radius: 12px;
        padding: 5px 20px;
        border-top-width: 1px;
        border-right-width: 1px;
        border-bottom-width: 1px;
        border-left-width: 1px;
        border-style: solid;
        border-color: var(--border-color);
        opacity: 1;
        transition: all 0.3s ease-in-out;

        [data-theme="light"] & {
            background-color: rgba(255, 255, 255, 0.95);
            border-color: rgba(0, 0, 0, 0.08);
        }

        [data-theme="dark"] & {
            background-color: rgba(28, 28, 28, 0.95);
            border-color: rgb(41, 41, 41);
        }

        @media ${device.sm} {
            border-radius: 12px;
            padding: 5px 20px;
        }
    }

    &.scrolling {
        > nav {
            background-color: var(--nav-bg);
            border-color: var(--border-color);

            [data-theme="light"] & {
                background-color: rgba(255, 255, 255, 0.95);
                border-color: rgba(0, 0, 0, 0.08);
            }

            [data-theme="dark"] & {
                background-color: rgba(28, 28, 28, 0.95);
                border-color: rgb(41, 41, 41);
            }
        }
    }
`
