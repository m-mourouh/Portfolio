'use client'
import styled from 'styled-components'
import { device } from './Breakpoints'
import { padding } from './Helpers'

export const StyledSkills = styled.section`
    ${padding()}
    position: relative;
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 100px;
    padding-bottom: 100px;

    @media ${device.sm} {
        padding-top: 80px;
        padding-bottom: 80px;
    }

    .skills-header {
        text-align: center;
        margin-bottom: 60px;

        @media ${device.sm} {
            margin-bottom: 40px;
        }

        h1 {
            font-family: var(--font-general-sans);
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 400;
            color: var(--white);
            margin-bottom: 20px;

            .secondary-text {
                color: #888;
                font-weight: 300;
            }
        }

        .subtitle {
            font-family: var(--font-general-sans);
            font-size: clamp(1rem, 2vw, 1.25rem);
            color: #888;
            font-weight: 300;
        }
    }

    .bento-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        /* grid-auto-rows: 300px ; */
        .certfs {
            max-height: 350px !important;
            overflow: auto;
            display: flex;
            flex-direction: column;

            .card-header {
                position: sticky;
                top: 0;
                background-color: rgb(28, 28, 28);
                z-index: 10;
                padding-bottom: 16px;
                margin-bottom: 16px !important;
            }
        }
        gap: 20px;
        width: 100%;

        @media ${device.lg} {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 280px;
        }

        @media ${device.sm} {
            grid-template-columns: 1fr;
            grid-auto-rows: auto;
            gap: 16px;
        }

        .skill-card {
            position: relative;
            background-color: rgb(28, 28, 28);
            border: 1px solid rgb(41, 41, 41);
            border-radius: 24px;
            padding: 32px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

            @media ${device.sm} {
                padding: 24px;
                border-radius: 16px;
            }

            &:hover {
                transform: translateY(-8px);
                /* border-color: #c4ff00;
                box-shadow: 0 10px 30px rgba(196, 255, 0, 0.1); */

                .card-accent {
                    opacity: 1;
                    transform: scale(1.2);
                }

                .skill-tag {
                    border-color: rgba(196, 255, 0, 0.3);
                }
            }

            &.large {
                grid-column: span 2;
                grid-row: span 2;
                min-height: 580px;

                @media ${device.lg} {
                    grid-column: span 2;
                    grid-row: span 1;
                    min-height: auto;
                }

                @media ${device.sm} {
                    grid-column: span 1;
                    grid-row: span 1;
                    min-height: auto;
                }
            }

            &.tall {
                grid-column: span 1;
                grid-row: span 2;

                @media ${device.lg} {
                    grid-column: span 1;
                    grid-row: span 1;
                }
            }

            &.wide {
                grid-column: span 2;
                grid-row: span 1;

                @media ${device.lg} {
                    grid-column: span 2;
                }

                @media ${device.sm} {
                    grid-column: span 1;
                }
            }

            &.medium {
                grid-column: span 1;
                grid-row: span 1;
            }

            .card-accent {
                position: absolute;
                top: -50%;
                right: -50%;
                width: 200px;
                height: 200px;
                background: radial-gradient(
                    circle,
                    rgba(196, 255, 0, 0.15) 0%,
                    transparent 70%
                );
                border-radius: 50%;
                opacity: 0;
                transition: all 0.6s ease;
                pointer-events: none;
            }

            .card-header {
                margin-bottom: 32px;
                flex-shrink: 0;

                h3 {
                    font-family: var(--font-general-sans);
                    font-size: clamp(1.5rem, 2.5vw, 2rem);
                    font-weight: 600;
                    color: var(--white);
                    margin: 0 0 16px 0;

                    @media ${device.sm} {
                        font-size: 1.5rem;
                    }
                }

                .card-description {
                    font-family: var(--font-general-sans);
                    font-size: 0.95rem;
                    color: #888;
                    font-weight: 300;
                    line-height: 1.6;

                    @media ${device.sm} {
                        font-size: 0.875rem;
                    }
                }
            }

            .skills-list {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                align-content: flex-start;
                margin-bottom: auto;

                @media ${device.sm} {
                    gap: 10px;
                }

                .skill-tag {
                    padding: 12px 20px;
                    background-color: rgb(44, 44, 44);
                    border: 1px solid rgb(57, 57, 57);
                    border-radius: 10px;
                    font-family: var(--font-general-sans);
                    font-size: 0.95rem;
                    color: var(--white);
                    font-weight: 400;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                    display: flex;
                    align-items: center;
                    gap: 8px;

                    @media ${device.sm} {
                        font-size: 0.85rem;
                        padding: 8px 14px;
                        gap: 6px;
                    }

                    .skill-icon {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #c4ff00;
                        font-size: 1.1rem;

                        @media ${device.sm} {
                            font-size: 1rem;
                        }

                        svg {
                            width: 18px;
                            height: 18px;

                            @media ${device.sm} {
                                width: 16px;
                                height: 16px;
                            }
                        }
                    }

                    &:hover {
                        background-color: rgb(57, 57, 57);
                        border-color: #c4ff00;
                        color: #c4ff00;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(196, 255, 0, 0.2);

                        .skill-icon {
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
`

export const CertContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0;
    width: 100%;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;

    /* Custom scrollbar */
    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-track {
        background: rgb(44, 44, 44);
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(196, 255, 0, 0.3);
        border-radius: 4px;

        &:hover {
            background: rgba(196, 255, 0, 0.5);
        }
    }

    .cert-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background-color: rgb(44, 44, 44);
        border: 1px solid rgb(57, 57, 57);
        border-radius: 10px;
        opacity: 0;
        transition: all 0.3s ease;
        flex-shrink: 0;
        text-decoration: none;
        color: inherit;
        cursor: pointer;
        position: relative;

        @media ${device.sm} {
            padding: 10px;
            gap: 10px;
        }

        &:hover {
            background-color: rgb(50, 50, 50);
            border-color: rgba(196, 255, 0, 0.3);
            transform: translateX(4px);

            .external-icon {
                opacity: 1;
            }
        }

        .external-icon {
            position: absolute;
            top: 12px;
            right: 12px;
            color: #c4ff00;
            opacity: 0;
            transition: opacity 0.3s ease;
            font-size: 12px;

            @media ${device.sm} {
                top: 10px;
                right: 10px;
                font-size: 10px;
            }
        }

        .cert-icon {
            width: 40px;
            height: 40px;
            min-width: 40px;
            background: linear-gradient(
                135deg,
                rgba(196, 255, 0, 0.2),
                rgba(196, 255, 0, 0.1)
            );
            border: 2px solid rgba(196, 255, 0, 0.3);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #c4ff00;

            svg {
                width: 22px;
                height: 22px;

                @media ${device.sm} {
                    width: 20px;
                    height: 20px;
                }
            }

            @media ${device.sm} {
                width: 36px;
                height: 36px;
                min-width: 36px;
            }
        }

        .cert-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;

            .cert-name {
                font-family: var(--font-general-sans);
                font-size: 0.9rem;
                font-weight: 600;
                color: var(--white);
                line-height: 1.3;

                @media ${device.sm} {
                    font-size: 0.8rem;
                }
            }

            .cert-issuer {
                font-family: var(--font-general-sans);
                font-size: 0.75rem;
                color: #888;
                font-weight: 400;

                @media ${device.sm} {
                    font-size: 0.7rem;
                }
            }
        }

        .cert-year {
            font-family: var(--font-general-sans);
            font-size: 0.85rem;
            font-weight: 600;
            color: #c4ff00;
            min-width: 45px;
            text-align: right;

            @media ${device.sm} {
                font-size: 0.75rem;
                min-width: 40px;
            }
        }
    }
`
