'use client'
import styled from 'styled-components'
import {
    padding,
    resposiveParagraph,
    selection,
    titleFont,
    titleLine,
} from './Helpers'
import { device } from './Breakpoints'

export const StyledProjects = styled.section`
    @media ${device.sm} {
        margin-top: 100px;
    }
    ${padding()}
    font-family: var(--font-roboto-mono);
    color: var(--white);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
                ${titleLine(8)}
    }
    .projects-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        @media ${device.sm} {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }
        grid-gap: 50px 50px;
        .project-card {
            width: 100%;
            position: relative;
            display: flex;
            /* justify-content: center; */
            flex-direction: column;
            /* align-items: center; */
            grid-gap: 50px;
            &:nth-child(2n) {
                .left-col {
                    /* order: 2; */
                    @media (max-width: 1193px) {
                        order: initial;
                    }
                }
            }

            @media (max-width: 1421px) {
                grid-gap: 50px;
            }
            @media (max-width: 1193px) {
                grid-gap: 50px;
                flex-direction: column;
            }

            .line {
                opacity: 0.3;
            }
            .left-col {
                position: relative;
                cursor: pointer;
                width: 100%;
                height: 100%;
                /* max-width: 400px; */
                @media (max-width: 1193px) {
                    width: 100%;
                    max-height: none;
                }
                .project-link {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 999;
                }
                .top-card {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    .line {
                        height: 1px;
                        flex: 2;
                        background: linear-gradient(
                            270deg,
                            #160820 0%,
                            #9400ff 67.99%,
                            #160820 100%
                        );
                    }
                    .title {
                        font-size: 0.8rem;
                        cursor: initial;
                        text-transform: capitalize;
                    }
                }

                .project-image {
                    max-height: 400px;
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 5px;
                    /* border: 1px solid var(--); */
                    overflow: hidden;

                    .links {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        z-index: 9999;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;
                        grid-gap: 10px;
                        transition: all 0.4s ease-in-out;

                        .link {
                            position: relative;
                            opacity: 0.8;
                            color: var(--white);
                            font-size: 1.3rem;
                            cursor: pointer;
                            transition: all 0.2s ease-in-out;
                            &:hover {
                                opacity: 0.5;
                                color: var(--orchid);
                            }
                            @media (max-width: 1421px) {
                                grid-gap: 20px;
                                font-size: 1.2rem;
                            }
                        }
                    }
                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transition: all 0.4s ease-in-out;
                        /* border-radius: 10px; */
                        /* filter: grayscale(1); */
                    }
                    &::after {
                        content: '';
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(
                            360deg,
                            rgba(92, 0, 156, .3) 44.58%,
                            rgba(22, 8, 32, 0.5) 103.42%
                        );

                        z-index: 99;
                        opacity: 0.6;
                    }
                }
                .bottom-card {
                    margin-top: 10px;
                    display: flex;
                    align-items: center;
                    .line {
                        height: 1px;
                        flex: 2;
                        background: linear-gradient(
                            270deg,
                            #160820 0%,
                            #9400ff 67.99%,
                            #160820 100%
                        );
                        transition: all 0.4s ease-in-out;
                    }
                    .list {
                        text-transform: uppercase;
                        display: flex;
                        grid-gap: 10px;
                        small {
                            font-family: var(--font-fira-code);
                        }
                        cursor: initial;
                    }
                }
                &:hover {
                    img {
                        transform: scale(1.1);
                        filter: none;
                    }
                    .line {
                        /* background: linear-gradient(
                            270deg,
                            #160820 0%,
                            var(--c2) 67.99%,
                            #160820 100%
                        ); */
                        opacity: 0.2;
                    }
                }
            }
            .right-col {
                display: none;
                position: relative;
                /* width: 50% */

                @media (max-width: 1193px) {
                    width: 100%;
                    p {
                        font-size: 0.9rem;
                        ${resposiveParagraph()}
                    }
                }
                p {
                    line-height: 2rem;
                    color: var(--c1);
                    text-align: justify;
                    word-spacing: -4px;
                }
                &::after {
                    content: '';
                    position: absolute;
                    top: -20px;
                    height: 1px;
                    width: 100%;
                    background: linear-gradient(
                        270deg,
                        #160820 0%,
                        #9400ff 67.99%,
                        #160820 100%
                    );
                    opacity: 0.3;
                }
                &::before {
                    content: '';
                    position: absolute;
                    bottom: -20px;
                    height: 1px;
                    width: 100%;
                    background: linear-gradient(
                        270deg,
                        #160820 0%,
                        #9400ff 67.99%,
                        #160820 100%
                    );
                    opacity: 0.3;
                }
            }
        }
    }
    .showBtn {
        margin: 0 auto;
        margin-top: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        grid-gap: 10px;
        font-size: 1rem;
    }
`
