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
    ${padding()}
    padding-top: 120px;
    padding-bottom: 100px;
    font-family: var(--font-roboto-mono);
    color: var(--white);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media ${device.sm} {
        padding-top: 80px;
        padding-bottom: 80px;
    }

    .projects-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 60px;

        @media ${device.sm} {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
            margin-bottom: 40px;
        }

        h1 {
            font-family: var(--font-general-sans);
            margin: 0;
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 400;
            line-height: 1.2;
            color: var(--white);
            ${selection(true, '#fff')}

            .secondary-text {
                color: #888;
                font-weight: 300;
            }
        }

        .view-all-btn {
            background-color: #c4ff00;
            color: #000;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: var(--font-general-sans);
            font-size: 0.95rem;
            font-weight: 500;
            text-decoration: none;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;

            &:hover {
                background-color: #b3e600;
                transform: translateX(4px);
            }

            @media ${device.sm} {
                padding: 10px 20px;
                font-size: 0.875rem;
            }
        }
    }

    .projects-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;

        @media ${device.sm} {
            grid-template-columns: 1fr;
            gap: 20px;
        }

        .project-card {
            display: flex;
            flex-direction: column;
            background-color: rgb(28, 28, 28);
            border: 1px solid rgb(41, 41, 41);
            border-radius: 16px;
            overflow: hidden;

            .card-link {
                display: block;
                text-decoration: none;
            }

            .project-image {
                position: relative;
                width: 100%;
                height: 400px;
                overflow: hidden;
                background-color: rgb(20, 20, 20);

                @media ${device.sm} {
                    height: 240px;
                }

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .image-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.4);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    display: flex;
                    align-items: flex-start;
                    justify-content: flex-end;
                    padding: 20px;

                    @media ${device.sm} {
                        padding: 16px;
                    }

                    .card-links {
                        display: flex;
                        gap: 12px;

                        @media ${device.sm} {
                            gap: 10px;
                        }

                        .link-icon {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 44px;
                            height: 44px;
                            background-color: rgba(255, 255, 255, 0.95);
                            border-radius: 50%;
                            color: #000;
                            font-size: 1.2rem;
                            text-decoration: none;
                            transition: all 0.3s ease;
                            transform: translateY(-10px);
                            opacity: 0;

                            &:hover {
                                background-color: #c4ff00;
                                transform: translateY(0) scale(1.1);
                            }

                            @media ${device.sm} {
                                width: 40px;
                                height: 40px;
                                font-size: 1.1rem;
                            }
                        }
                    }
                }
            }

            &:hover {
                .project-image {
                    img {
                        transform: scale(1.08);
                    }

                    .image-overlay {
                        opacity: 1;

                        .link-icon {
                            opacity: 1;
                            transform: translateY(0);
                            transition-delay: 0.1s;

                            &:nth-child(2) {
                                transition-delay: 0.15s;
                            }
                        }
                    }
                }
            }

            .card-info {
                padding: 24px;
                display: flex;
                flex-direction: column;
                gap: 16px;
                flex: 1;

                @media ${device.sm} {
                    padding: 20px;
                    gap: 14px;
                }

                .project-title {
                    font-family: var(--font-general-sans);
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: var(--white);
                    margin: 0;

                    @media ${device.sm} {
                        font-size: 1.25rem;
                    }
                }

                .project-description {
                    font-family: var(--font-general-sans);
                    font-size: 0.95rem;
                    color: #888;
                    line-height: 1.6;
                    margin: 0;
                    font-weight: 300;

                    @media ${device.sm} {
                        font-size: 0.875rem;
                    }
                }

                .tech-stack {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;

                    .tech-tag {
                        padding: 6px 12px;
                        background-color: rgb(41, 41, 41);
                        border-radius: 6px;
                        font-family: var(--font-general-sans);
                        font-size: 0.75rem;
                        color: #888;
                        font-weight: 400;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;

                        @media ${device.sm} {
                            font-size: 0.7rem;
                            padding: 5px 10px;
                        }
                    }
                }
            }
        }
    }
`
