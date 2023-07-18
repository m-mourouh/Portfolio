'use client'
import styled from 'styled-components'
import { padding, selection, titleFont, titleLine } from './Helpers'
import { device, size } from './Breakpoints'

export const StyledSkills = styled.section`
    ${padding()}
    @media ${device.sm} {
        margin-top: 100px;
    }
    position: relative;
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    @media ${device.sm} {
        margin-top: 100px;
    }
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
    .inner-wrapper {
        display: flex;
        justify-content: space-between;
        grid-gap: 30px;
        @media (max-width: 976px) {
            flex-direction: column;
        }
        .fields {
            &:hover {
                cursor: all-scroll;
            }
            .field {
                @media (max-width: 976px) {
                    min-width: max-content;
                    height: max-content;
                }
                padding: 12px 20px;
                color: var(--white);
                background: transparent;
                border: 1px solid var(--orchid);
                text-align: center;
                font-family: var(--font-roboto-mono);
                cursor: pointer;
                border-radius: 50px;
                opacity: 0.2;
                transition: all 0.2s ease-in-out;
                &.active,
                &:hover {
                    background-color: rgba(63, 24, 90, 0.5);
                    color: var(--white);
                    opacity: 1;
                }
            }
        }
        .mySwiper {
            &:hover {
                cursor: all-scroll;
            }
            position: relative;
            width: 80%;
            padding-right: 100px;
            height: 400px;
            font-family: var(--font-roboto-mono);
            @media (max-width: 1176px) {
                padding-right: 50px;
                width: 100%;
            }
            @media (max-width: 760px) {
                padding-right: 0;
            }
            @media (max-width: 649px) {
                height: 300px;
            }
            .swiper-slide {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                grid-gap: 20px;
                justify-content: center;
                /* align-items: center; */
                /* @media (max-width: 650px) {
                    grid-template-columns: repeat(3, 1fr);
                }
                @media (max-width: 533px) {
                    grid-template-columns: repeat(2, 1fr);
                } */
                @media (max-width: 760px) {
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                }
                .skill {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    /* height: max-content; */
                    padding: 25px 10px;
                    background-color: rgba(63, 24, 90, 0.5);

                    color: var(--white);
                    border-radius: 10px;
                    border: 1px solid var(--orchid);
                    /* font-weight: 900; */
                    font-size: 1rem;
                    p {
                        text-align: center;
                        text-transform: uppercase;
                        .extension {
                            text-transform: lowercase;
                            font-weight: normal;
                            font-size: 1rem;
                            align-self: flex-end;
                        }
                    }
                    .icon {
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        font-size: 1rem;
                        color: var(--white);
                        opacity: 0.5;
                    }
                }
            }
        }
        .mySwiper2 {
            height: 400px;
            font-family: var(--font-roboto-mono);
            @media (max-width: 976px) {
                height: max-content;
                padding: 5px 0;
            }
        }

        .swiper-pagination {
            @media(max-width: ${size.xs}){
                    display: none;
            } 
            span {
                &.swiper-pagination-bullet {
                    background: rgba(63, 24, 90, 0.8);
                    border: 1px solid rgba(63, 24, 90, 1);
                    width: 4px;
                    height: 50px;
                    border-radius: 10px;
                    transition: 0.2s ease-in-out;
                    @media (max-width: 440px) {
                        height: 20px;
                    }
                    @media (max-width: 760px) {
                        width: 50px;
                        height: 4px;
                    }
                    &:hover {
                        background: rgba(63, 24, 90, 0.8) !important;
                        border: 1px solid rgba(63, 24, 90, 1) !important;
                        opacity: 1;
                    }
                }
            }
            @media (max-width: 760px) {
                bottom: 0px !important;
            }
        }
    }
`
