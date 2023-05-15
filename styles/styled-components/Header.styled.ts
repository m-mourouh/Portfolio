"use client"
import styled from "styled-components"
import { device } from "./Breakpoints"

export const StyledHeader = styled.header`
    padding: 0 50px;
    width: 100%;
    height: var(--nav-height);
    /* margin-top: 10px;
    position: sticky;
    top: 0; */
    @media ${device.sm} {
        height: 80px;
    }
    display: flex;
    align-items: center;
    transition: 0.25s ease-in-out;
    /* media queries */
    @media ${device.sm} {
        padding: 0 20px;
    }
`