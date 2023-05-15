'use client'
import styled, { css } from 'styled-components'
import Img from '@/public/images/logo.svg'
import { device } from './Breakpoints'
import { padding, selection, titleFont } from './Helpers'
import data from '@/data/data.json'
export const StyledSelection = styled.section`
    display: flex;
    align-items: center;
    min-height: calc(100vh - var(--nav-height));
    padding: 0px;
    position: relative;
    ${padding()}
    .bg {
        width: 100vw;
        height: 100vh;
        background-image: url(${Img.src});
        background-repeat: no-repeat;
        background-size: 70%;
        background-position: center right;
        /* background-attachment: fixed; */
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0.1;
        background-color: gray;
        mix-blend-mode: overlay;
        z-index: -1;
        @media ${device.sm} {
            display: none;
        }
    }
    .wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: ${({ theme }) => theme.dark.text};
        h1 {
            position: relative;
            font-family: var(--font-roboto);
            text-transform: uppercase;
            /* background: -webkit-linear-gradient(0turn, var(--orchid), black);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent; */
            opacity: 1;
            ${titleFont()}
            span:first-of-type {
                ${selection()}/* color: var(--orchid); */
            }

            span:last-of-type {
                ${selection(false, '#fff')}
            }
            &::after {
                content: '${data.user.name}';
                position: absolute;
                top: -15px;
                left: 0;
                height: 100%;
                width: 100%;
                font-size: clamp(30px, 7vw, 80px);
                color: transparent;
                -webkit-text-stroke: 1px var(--white);
                transform: scale(1) ;
                z-index: -5;
                opacity: 0.15;
                font-weight: 900;
                @media (max-width: 350px) {
                    font-size: clamp(25px, 4vw, 40px);
                }
            }
        }
        h5 {
            font-family: var(--font-roboto);
            color: transparent;
            -webkit-text-stroke: 1px var(--orchid);
            font-size: clamp(18px, 3vw, 80px);
            font-weight: 800;
            span {
                color: var(--white);
                -webkit-text-stroke: transparent;
                ${selection(false, '#fff')}
            }
            margin-bottom: 30px;
            /* media queries */
            @media ${device.sm} {
                /* color: var(--orchid);
                -webkit-text-stroke: transparent; */
                font-size: clamp(25px, 5vw, 80px);
            }
            ${selection(true)}
        }
        p:first-of-type {
            font-size: 1rem;
            font-family: var(--font-fira-code);
            color: var(--orchid);
            margin-bottom: 20px;
        }
        p:last-of-type {
            font-family: var(--font-roboto-mono);
            /* font-size: 0.9rem; */
            max-width: 880px;
            color: var(--c2);
            line-height: 2.5rem;
        }
        a {
            display: block;
            margin-top: 40px;
        }
    }
`
