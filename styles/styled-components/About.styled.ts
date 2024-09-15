'use client'
import styled from 'styled-components'
import { device } from './Breakpoints'
import { padding, resposiveParagraph, selection, titleLine } from './Helpers'
import { titleFont } from './Helpers'

export const StyledAbout = styled.section`
    &.about {
        position: relative;
        min-height: 100vh;
        width: 100%;
        @media ${device.sm} {
            margin-top: 100px;
        }
        display: flex;
        grid-gap: 50px;
        @media ${device.md} {
            flex-direction: column;
        }
        align-items: center;
        color: var(--white);
        /* overflow: hidden; */
        ${padding()}
        .about__left-col {
            position: relative;
            max-width: 1000px;
            h1 {
                text-transform: capitalize;
                font-family: var(--font-roboto);
                margin-bottom: 55px;
                position: relative;
                /* features */
                color: transparent;
                -webkit-text-stroke: 1px var(--white);
                ${selection(true, '#fff')}
                ${titleFont(false)}
                ${titleLine(9)}
            }
            p {
                font-family: var(--font-roboto-mono);
                line-height: 2.5rem;
                color: var(--c2);
                &:last-child {
                    margin-top: 20px;
                    color: var(--c2);
                    /* opacity: 0.3; */
                }
                ${resposiveParagraph()}
            }
            &::after {
                content: 'about me';
                text-transform: capitalize;
                position: absolute;
                bottom: 0;
                left: 0;
                font-size: clamp(100px, 7vw, 200px);
                word-wrap: break-word;
                color: transparent;
                -webkit-text-stroke: 2px var(--white);
                /* transform: rotate(90deg); */
                display: none;
                z-index: -1;
                opacity: 0.05;
                font-weight: 900;
                @media (max-width: 350px) {
                    font-size: 50rem;
                }
            }
        }
        .about__right-col {
            text-align: center;
            margin: 0 auto;
            max-width: 300px;
            max-height: 300px;
            min-width: 250px;
            min-height: 250px;
            object-fit: cover;
            position: relative;
            /* border: 2px solid var(--orchid);
            border-radius: 50%; */
            padding: 14px;
            &::after {
                content: '';
                width: 100%;
                height: 100%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border: 2px solid var(--white);
                /* background: var(--white); */
                object-fit: cover;
                z-index: -1;
                border-radius: 50%;
                padding: 1px;
                opacity: 0.1;
                border: 3px solid var(--white);
                transition: all 0.4s ease-in-out;
                transform-origin: 50% 50%;
            }
            &::before {
                content: '';
                width: 90%;
                height: 90%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border: 2px solid var(--white);
                background: var(--white);
                object-fit: cover;

                border-radius: 50%;
                padding: 10px;
                opacity: 0.1;
                border: 4px solid var(--white);
                transition: all 0.2s ease-in-out;
                transform-origin: 50% 50%;
                z-index: -1;
            }
            @media ${device.xs} {
                max-width: 250px;
                max-height: 250px;
            }
            img {
                transition: all 0.5s ease-in-out;
                background: var(--white);
                user-select: none;
                width: 100%;
                height: 100%;
                /* border: 4px solid var(--white); */
                border-radius: 50%;
    
            }

            .icon {
                display: none;
                position: absolute;
                background: var(--c2);
                z-index: 999;
                mix-blend-mode: overlay;
                bottom: 13px;
                left: 50%;
                transform: translate(-50%, 0%);
                opacity: 0.5;
                width: 30px;
                height: 30px;
                border-radius: 50px;
                padding: 5px;

                @media ${device.xs} {
                    bottom: 12px;
                }
                transition: all 0.25s ease-in-out;
            }
            &:hover {
                .icon {
                    opacity: 1;
                }
                &::after,
                &::before {
                    transform: translate(-50%, -50%) scale(1.05);
                    z-index: -1;
                }
            }
        }
    }
    .about_animate {
        opacity: 0;
    }
`
