'use client'
import styled from 'styled-components'

import { device } from './Breakpoints'
export const StyledNav = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    a {
        font-family: var(--font-fira-code);
        font-size: 1rem;
        cursor: pointer;
    }
    .overlay {
        content: '';
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100vh;
        transition: all 0.15s ease-in-out;
        background: ${({ theme }) => theme.dark.background};
        z-index: 9;
        opacity: 0.7;
        filter: blur(8px);
        display: none;
        @media ${device.sm} {
            &.active {
                display: block;
            }
        }
    }
    .menu {
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: 0.25s ease-in-out;
        /* media queries */
        @media ${device.sm} {
            visibility: hidden;
            position: fixed;
            top: 0;
            right: -100%;
            padding: 50px 10px;
            width: min(75vw, 400px);
            height: 100vh;
            z-index: 999;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: ${({ theme }) => theme.dark.background};
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
        }
        &.active {
            @media ${device.sm} {
                visibility: visible;
                right: 0;
            }
        }
        ul {
            display: flex;
            align-items: center;
            list-style-type: none;
            grid-gap: 30px;
            margin-right: 40px;
            /* media queries */
            @media ${device.sm} {
                flex-direction: column;
                align-items: center;
                margin-right: 0;
            }
            li {
                a {
                    text-decoration: none;
                    display: inline-block;
                    /* padding-right: 30px; */
                    text-transform: capitalize;
                    color: var(--c1);
                    transition: 0.25s ease-in-out;
                    position: relative;
                    display: inline-block;
                    @media ${device.sm} {
                        margin: 15px 0;
                        padding: 12px 8px;
                    }
                    &:hover {
                        color: var(--orchid);
                    }
                    &:after {
                        content: '';
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        top: -49px;
                        width: 0.5px;
                        height: 50px;
                        background: #ffffff36;
                        z-index: -55;
                        display: none;
                        @media ${device.sm} {
                            display: block;
                        }
                    }
                    /* &::first-letter {
                        color: var(--orchid);
                    } */
                }
            }
        }
        .link {
            display: inline-block;
            margin-left: 20px;
            @media ${device.sm} {
                margin: 0;
                margin-top: 60px;
            }
        }
    }

    .menu-icon {
        display: none;
        position: relative;
        width: 50px;
        height: 50px;
        cursor: pointer;
        z-index: 9999;
        /* media queries */
        @media ${device.sm} {
            display: initial;
        }
        div {
            margin: auto;
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            width: 22px;
            height: 12px;
        }
        span {
            position: absolute;
            display: block;
            width: 100%;
            height: 2px;
            background-color: ${({ theme }) => theme.light.background};
            border-radius: 1px;
            transition: all 0.2s cubic-bezier(0.1, 0.82, 0.76, 0.965);

            &:first-of-type {
                width: 30px;
                top: 0;
            }
            &:last-of-type {
                bottom: 0;
                width: 15px;
            }
        }
        &.active {
            span {
                &:first-of-type {
                    transform: rotate(45deg);
                    top: 5px;
                }
                &:last-of-type {
                    transform: rotate(-45deg);
                    bottom: 5px;
                }
                &.active {
                    width: 22px;
                }
            }
        }
    }
`
