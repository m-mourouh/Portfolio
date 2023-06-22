'use client'
import styled from 'styled-components'
import { device } from './Breakpoints'

export const StyledDiv = styled.div`
    .cursor {
        position: fixed;
        background-color: #fff;
        width: 6px;
        height: 6px;
        border-radius: 100%;
        z-index: 9999999999999999999999999999999;
        transition: 0.3s cubic-bezier(0.75, -1.27, 0.3, 2.33) transform,
            0.2s cubic-bezier(0.75, -0.27, 0.3, 1.33) opacity;
        user-select: none;
        pointer-events: none;
        transform: scale(1);
        @media ${device.sm} {
            display: none;
        }
    }
    .cursor-follower {
        position: fixed;
        background-color: rgba(255, 255, 255, 0.3);
        width: 20px;
        height: 20px;
        border-radius: 100%;
        z-index: 99999999999999999999999999999;
        transition: 0.6s cubic-bezier(0.75, -1.27, 0.3, 2.33) transform,
            0.2s cubic-bezier(0.75, -0.27, 0.3, 1.33) opacity;
        user-select: none;
        pointer-events: none;
        transform: translate(5px, 5px);
        @media ${device.sm} {
            display: none;
        }
    }
`
