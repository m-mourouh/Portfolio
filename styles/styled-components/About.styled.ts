'use client'
import styled from 'styled-components'
import { device } from './Breakpoints'
import { padding } from './Helpers'

export const StyledAbout = styled.section`
    &.about {
        position: relative;
        min-height: 100vh;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--white);
        ${padding()}

        @media ${device.sm} {
            margin-top: 100px;
            padding: 80px 20px;
        }

        .about__content {
            width: 100%;
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 24px;
            padding: 80px;
            position: relative;
            transition: background-color 0.3s ease, border-color 0.3s ease;

            @media ${device.md} {
                padding: 60px 40px;
            }

            @media ${device.sm} {
                padding: 40px 24px;
                border-radius: 16px;
            }

            h1 {
                font-family: var(--font-general-sans);
                font-size: clamp(1.25rem, 2.5vw, 1.875rem);
                font-weight: 400;
                line-height: 1.6;
                color: var(--text-primary);
                margin-bottom: 60px;
                transition: color 0.3s ease;

                @media ${device.sm} {
                    font-size: clamp(1rem, 3.5vw, 1.5rem);
                }

                .gray-text {
                    color: var(--text-secondary);
                    font-weight: 300;
                    transition: color 0.3s ease;
                }
            }

            .signature {
                margin-bottom: 80px;

                @media ${device.sm} {
                    margin-bottom: 60px;
                }

                svg {
                    @media ${device.sm} {
                        width: 120px;
                        height: auto;
                    }
                }
            }

            .stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 60px;

                @media ${device.md} {
                    grid-template-columns: 1fr;
                    gap: 40px;
                }

                .stat-item {
                    .stat-number {
                        font-family: var(--font-general-sans);
                        font-size: clamp(3rem, 8vw, 5rem);
                        font-weight: 300;
                        color: var(--text-primary);
                        margin-bottom: 10px;
                        line-height: 1;
                        transition: color 0.3s ease;
                        /* font-weight: 600; */
                        .accent {
                            color: #c4ff00;
                            font-weight: 400;
                        }
                    }

                    .stat-label {
                        font-family: var(--font-general-sans);
                        font-size: 0.875rem;
                        color: var(--text-secondary);
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        font-weight: 600;
                        transition: color 0.3s ease;
                    }
                }
            }
        }
    }
`
