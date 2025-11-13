import styled from "styled-components";
import { device } from "./Breakpoints";

export const StyledBox = styled.div`
    &.notification-box {
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        position: fixed;
        inset: 0;
        transition: all 0.3s ease-in-out;
        z-index: 99999;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 120px;

        @media ${device.sm} {
            padding-top: 100px;
        }

        .notification {
            position: relative;
            background-color: rgb(28, 28, 28);
            border: 1px solid #c4ff00;
            border-radius: 16px;
            padding: 20px 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 14px;
            color: var(--white);
            font-family: var(--font-general-sans);
            font-size: 1rem;
            font-weight: 500;
            box-shadow: 0 10px 40px rgba(196, 255, 0, 0.2);
            max-width: 90%;

            @media ${device.sm} {
                padding: 16px 24px;
                font-size: 0.95rem;
                gap: 12px;
            }

            .icon {
                color: #c4ff00;
                font-size: 1.5rem;
                flex-shrink: 0;

                @media ${device.sm} {
                    font-size: 1.3rem;
                }
            }

            span {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;

                @media ${device.sm} {
                    white-space: normal;
                }
            }
        }
    }
`