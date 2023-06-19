'use client'
import styled from 'styled-components'
import { device } from './Breakpoints'

export const StyledDiv = styled.div`
    .icons {
        display: none;
        align-items: center;
        justify-content: center;
        grid-gap: 20px;
        .icon {
            color: var(--c1);
            /* font-size: 1rem; */
            transition: all 0.25s ease;
            &:hover {
                color: var(--orchid);
            }
            @media ${device.sm} {
                font-size: 1.2rem;
            }
        }
        @media ${device.sm} {
            display: flex;
        }
    }
    .links {
        position: fixed;
        right: 10px;
        bottom: 20px;
        z-index: 99;
        display: flex;
        flex-direction: column;
        grid-gap: 40px 0;
        transform: rotate(-180deg);
        a {
            text-decoration: none;
            text-transform: uppercase;
            writing-mode: vertical-rl;
            text-orientation: mixed;
            text-align: center;
            display: inline-block;
            color: var(--c1);
            font-family: var(--font-roboto-mono);
            padding: 5px 10px;
            transition: all 0.25s ease;
            position: relative;

            &:hover {
                color: var(--orchid);
                .tooltiptext {
                    visibility: visible;
                    opacity: 1;
                    right: calc(-10% - 7ch);
                }
            }
            &::after {
                content: '';
                position: absolute;
                transform: translateX(calc(-50% - 1px));
                left: 50%;
                top: 100%;
                width: 0.5px;
                height: 100%;
                background: var(--c1);
                opacity: 0.5;
                z-index: -55;
             
            }
            .tooltiptext {
                font-family: var(--font-roboto-mono);
                visibility: hidden;
                background-color: var(--color0);
                color: var(--color1);
                text-align: center;
                border-radius: 50px;
                padding: 17px 8px;
                position: absolute;
                z-index: 1;
                top: 50%;
                width: max-content;
                transform: translateY(-50%) rotate(90deg);
                right: -100%;
                opacity: 0;
                text-transform: uppercase;
                transition: all 0.25s ease;
                font-size: 1rem;
            }
            /* &::first-letter {
                color: var(--orchid);
            } */
        }
        @media ${device.sm} {
            display: none;
        }
    }
`
