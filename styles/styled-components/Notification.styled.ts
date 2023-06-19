import styled from "styled-components";
import { device } from "./Breakpoints";


export const StyledBox = styled.div`
    &.notification-box {
        width: 100%;
        height: 100vh;
        background: ${({ theme }) => theme.dark.lightBackground};
        position: fixed;
        inset: 0;
        transition: all 0.2s ease-in-out;
        z-index: 99999;
        small {
            position: fixed;
            top: 150px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 999999999;
            color: var(--white);
            background-color: ${({ theme }) => theme.dark.background};
            padding: 12px 20px;
            /* text-transform: capitalize; */
            border: 1px solid var(--orchid);
            border-radius: 50px;
            /* border-right: none; */
            display: flex;
            align-items: center;
            justify-content: center;
            width: max-content;
            grid-gap: 10px;
            font-family: var(--font-roboto-mono);
            box-shadow: 0 0 5px 0 var(--orchid);
            .icon {
                color: var(--orchid);
                font-size: 1.5rem;
            }
            @media ${device.sm} {
                top: 80px;
            }
        }
    }
`