'use client'

import styled from 'styled-components'
import { device } from './Breakpoints'

export const StyledDiv = styled.div`
    font-family: var(--font-roboto-mono);
    position: fixed;
    display: flex;
    flex-direction: column-reverse;
    z-index: 999;
    /* overflow-x: hidden; */
    .shareBtn {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        grid-gap: 10px;
        color: var(--c1);
        text-decoration: none;
        writing-mode: vertical-rl;
        text-orientation: mixed;
        transform: rotate(-180deg);
        transition: all 0.25s ease-in-out;
        .icon {
            transform: rotate(90deg);
        }
        &::before {
            content: '';
            position: absolute;
            bottom: calc(100% + 20px);
            width: 0.5px;
            height: 100px;
            background: var(--c1);
            transition: all 0.5s ease-in-out;
            opacity: 0.5;
        }
        &:hover {
            color: var(--orchid);
            /* text-decoration: line-through; */
            &::before {
                opacity: 0.1;
            }
        }
    }
    .platforms {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: calc(-100% - 50px);
        ul {
            list-style-type: none;
            display: flex;
            flex-direction: column-reverse;
            grid-gap: 15px;

            li {
                .icon {
                    display: block;
                    color: var(--c1);
                    cursor: pointer;
                    padding: 5px 0;
                    transition: all 0.25s ease-in-out;
                    font-size: 1.2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    &:hover {
                        color: var(--orchid);
                    }
                    opacity: 0;
                }
            }
        }
    }
    &.vertical {
        bottom: 100px;
        left: 20px;
        @media ${device.sm} {
            display: none;
        }
    }

    &.horizontal {
        display: none;
        position: relative;
        flex-direction: row;
        left:0 ;
        bottom: 100px;
        /* media queries */
        @media ${device.sm} {
            display: flex;
        }
        .shareBtn {
            display: flex;
            align-items: center;
            writing-mode: initial;
            text-orientation: initial;
            transform: none;
            margin-left: 50px;
            .icon {
                transform: none;
            }
            p {
                margin-top: 0;
            }
            &::before {
                left: -75%;
                top: 50%;
                width: 58px;
                height: 0.5px;
                transform: translateY(-50%);
            }
        }
        .platforms {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 180px;
            ul {
                flex-direction: row;
            }
            .icon {
                padding: 0 5px;
            }
        }
    }
`
