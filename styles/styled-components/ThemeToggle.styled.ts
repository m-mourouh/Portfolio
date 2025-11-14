'use client'
import styled from 'styled-components'
import { device } from './Breakpoints'

export const StyledThemeToggle = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .toggle-track {
        width: 60px;
        height: 32px;
        background-color: var(--card-bg);
        backdrop-filter: blur(10px);
        border: 1px solid var(--border-color);
        border-radius: 50px;
        padding: 3px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        display: flex;
        align-items: center;

        &:hover {
            border-color: rgba(196, 255, 0, 0.5);
            box-shadow: 0 4px 20px rgba(196, 255, 0, 0.2);
        }

        @media ${device.sm} {
            width: 50px;
            height: 26px;
        }
    }

    .toggle-thumb {
        width: 26px;
        height: 26px;
        background: linear-gradient(135deg, #c4ff00, #a8d600);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        color: #000;
        font-size: 14px;

        @media ${device.sm} {
            width: 20px;
            height: 20px;
            font-size: 12px;
        }

        svg {
            width: 14px;
            height: 14px;

            @media ${device.sm} {
                width: 12px;
                height: 12px;
            }
        }
    }

    .toggle-track.dark .toggle-thumb {
        transform: translateX(0);
    }

    .toggle-track.light .toggle-thumb {
        transform: translateX(28px);

        @media ${device.sm} {
            transform: translateX(24px);
        }
    }
`
