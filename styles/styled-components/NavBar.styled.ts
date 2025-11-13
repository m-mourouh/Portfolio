'use client'
import styled from 'styled-components'

import { device } from './Breakpoints'
export const StyledNav = styled.nav`
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    width: calc(100% - 300px);
    max-width: 1400px;
    padding: 20px 60px;
    background-color: rgba(28, 28, 28, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgb(41, 41, 41);
    border-radius: 100px;
    z-index: 1000;
    transition: all 0.3s ease;

    @media (max-width: 1400px) {
        width: calc(100% - 200px);
    }

    @media (max-width: 1061px) {
        width: calc(100% - 160px);
        padding: 20px 40px;
    }

  
    .nav-logo {
        cursor: pointer;
        transition: opacity 0.3s ease;
        justify-self: start;
        &:hover {
            opacity: 0.8;
        }
    }

    a {
        /* font-family: var(--font-fira-code); */
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
        justify-content: center;
        transition: 0.25s ease-in-out;
        grid-column: 2;
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
            grid-column: unset;
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
            grid-gap: 40px;
            margin-right: 0;
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
                    text-transform: none;
                    color: var(--white);
                    transition: 0.25s ease-in-out;
                    position: relative;
                    display: inline-block;
                    font-weight: 400;
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

        .mobile-language-switcher {
            display: none;
            @media ${device.sm} {
                display: block;
                margin-top: 40px;
            }
        }

        .mobile-btn {
            display: none;
            @media ${device.sm} {
                display: inline-block;
                margin: 0;
                margin-top: 20px;
            }
        }
    }

    .nav-button-wrapper {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 16px;
        grid-column: 3;

        @media ${device.sm} {
            display: none;
        }

        .link {
            display: inline-block;
        }
    }

    .menu-icon {
        display: none;
        position: relative;
        width: 50px;
        height: 50px;
        cursor: pointer;
        z-index: 10001;
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

    @media ${device.sm} {
        display: flex;
        justify-content: space-between;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        transform: none;
        padding: 16px 20px;
        background-color: rgba(10, 10, 10, 0.98);
        backdrop-filter: blur(20px);
        border-radius: 0 !important;
        border: none;
        border-bottom: 1px solid rgba(196, 255, 0, 0.2);
        /* box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5); */
        z-index: 10000 !important;
    }

    @media (max-width: 450px) {
        padding: 14px 20px;
        border-radius: 0 !important;
    }

`
