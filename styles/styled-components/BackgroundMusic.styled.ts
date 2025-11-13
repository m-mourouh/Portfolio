'use client'
import styled from 'styled-components'
import { device } from './Breakpoints'

export const StyledBackgroundMusic = styled.div`
    position: fixed;
    bottom: 10px;
    right: 40px;
    z-index: 1000;

    @media ${device.sm} {
        bottom: 10px;
        right: 20px;
    }

    .music-visualizer {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: 6px;
        height: 20px;
        padding: 12px 16px;
        background-color: transparent;
        /* backdrop-filter: blur(10px); */
        /* border: 1px solid rgb(41, 41, 41); */
        border-radius: 50px;
        /* box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); */

        @media ${device.sm} {
            height: 32px;
            padding: 8px 12px;
            gap: 4px;
        }

        span {
            width: 4px;
            background: linear-gradient(to top, #c4ff00, #a8d600);
            border-radius: 2px;
            animation: visualize 0.8s ease-in-out infinite;

            @media ${device.sm} {
                width: 3px;
            }

            &:nth-child(1) {
                animation-delay: 0s;
            }
            &:nth-child(2) {
                animation-delay: 0.1s;
            }
            &:nth-child(3) {
                animation-delay: 0.2s;
            }
            &:nth-child(4) {
                animation-delay: 0.3s;
            }
            &:nth-child(5) {
                animation-delay: 0.4s;
            }
        }

        @keyframes visualize {
            0%, 100% {
                height: 8px;
            }
            50% {
                height: 32px;
            }
        }

        @media ${device.sm} {
            @keyframes visualize {
                0%, 100% {
                    height: 6px;
                }
                50% {
                    height: 24px;
                }
            }
        }
    }
`
