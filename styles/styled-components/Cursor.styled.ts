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
        transition: 0.45s cubic-bezier(0.22, 1, 0.36, 1) transform,
            0.2s cubic-bezier(0.75, -0.27, 0.3, 1.33) opacity, 0.3s ease background-color, 0.3s ease box-shadow;
        user-select: none;
        pointer-events: none;
        transform: translate(5px, 5px);
        @media ${device.sm} {
            display: none;
        }
    }

    /* over links / buttons / cards: a larger lime ring */
    &.is-hover .cursor-follower {
        transform: translate(5px, 5px) scale(2.2);
        background-color: rgba(196, 255, 0, 0.08);
        box-shadow: inset 0 0 0 1px rgba(196, 255, 0, 0.85);
    }
    &.is-hover .cursor {
        background-color: #c4ff00;
    }
    /* over text fields: get out of the way of the caret */
    &.is-field .cursor,
    &.is-field .cursor-follower {
        opacity: 0;
    }

    /* no custom cursor on touch / coarse-pointer devices */
    @media (hover: none), (pointer: coarse) {
        .cursor,
        .cursor-follower {
            display: none;
        }
    }
`
