'use client'
import styled from 'styled-components'
import { device } from './Breakpoints'
import { padding } from './Helpers'

export const StyledSelection = styled.section`
    display: flex;
    align-items: center;
    min-height: 100vh;
    padding-top: 120px;
    padding-bottom: 0px;
    position: relative;
    width: 100%;
    ${padding()}

    @media ${device.sm} {
        min-height: 100vh;
        padding-top: 90px;
    }

    .wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        color: var(--white);

        .status {
            display: inline-flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 40px;

            @media ${device.sm} {
                margin-bottom: 30px;
                gap: 12px;
            }

            .status-image {
                position: relative;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                overflow: hidden;
                /* border: 2px solid #c4ff00; */
                padding: 2px;
                background: linear-gradient(135deg, #c4ff00, #c4ff00);

                @media ${device.sm} {
                    width: 50px;
                    height: 50px;
                }

                .profile-pic {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                }
            }

            .status-text {
                display: flex;
                align-items: center;
                gap: 10px;
                font-family: var(--font-general-sans);
                font-size: 0.875rem;
                font-weight: 500;
                color: var(--white);
                text-transform: uppercase;
                letter-spacing: 1px;

                @media ${device.sm} {
                    font-size: 0.75rem;
                }

                .status-dot {
                    width: 10px;
                    height: 10px;
                    background-color: #c4ff00;
                    border-radius: 50%;
                    animation: pulse 2s ease-in-out infinite;

                    @media ${device.sm} {
                        width: 8px;
                        height: 8px;
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }
            }
        }

        h1 {
            font-family: var(--font-general-sans);
            font-size: clamp(2rem, 5vw, 4.5rem);
            font-weight: 400;
            line-height: 1.2;
            color: var(--white);
            margin-bottom: 60px;

            @media ${device.sm} {
                font-size: clamp(1.5rem, 6vw, 2.5rem);
                margin-bottom: 40px;
            }

            span {
                color: #888;
                font-weight: 300;
            }

            .secondary-text {
                color: #888;
                font-weight: 300;
            }
        }

        .buttons-wrapper {
            display: flex;
            gap: 20px;
            align-items: center;

            button, a {
                min-width: 200px;
                flex: 0 0 auto;
                font-size: 1.125rem;
                padding: 16px 36px;
            }

            @media ${device.sm} {
                flex-direction: column;
                width: 100%;
                gap: 15px;

                button, a {
                    width: 100%;
                    min-width: unset;
                    font-size: 1rem;
                    padding: 14px 28px;
                }
            }
        }
    }
`
