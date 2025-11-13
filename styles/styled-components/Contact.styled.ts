'use client'
import styled from 'styled-components'
import { device } from './Breakpoints'
import { padding, selection, titleFont, titleLine } from './Helpers'

export const StyledSection = styled.section`
    ${padding()}
    padding-top: 120px;
    padding-bottom: 100px;
    position: relative;
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media ${device.sm} {
        padding-top: 80px;
        padding-bottom: 80px;
    }

    .contact-header {
        text-align: center;
        margin-bottom: 60px;

        @media ${device.sm} {
            margin-bottom: 40px;
        }

        h1 {
            font-family: var(--font-general-sans);
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 400;
            line-height: 1.2;
            color: var(--white);
            margin: 0 0 20px 0;
            ${selection(true, '#fff')}

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
            line-height: 1.6;
            max-width: 600px;
            margin: 0 auto;
        }
    }
    form {
        max-width: 700px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-self: center;
        gap: 24px;
        margin: 0 auto;
        background-color: rgb(28, 28, 28);
        border: 1px solid rgb(41, 41, 41);
        border-radius: 24px;
        padding: 48px;

        @media ${device.sm} {
            padding: 32px 24px;
            gap: 20px;
        }

        .error {
            padding-left: 10px;
            color: #ff6b6b;
            margin-top: 8px;
            transition: all 0.25s ease-in-out;
            font-family: var(--font-general-sans);
            font-size: 0.875rem;

            small {
                display: flex;
                align-items: center;
                gap: 6px;
            }
        }

        input {
            width: 100%;
            background-color: rgb(20, 20, 20);
            outline: none;
            border: 1px solid rgb(41, 41, 41);
            color: var(--white);
            border-radius: 12px;
            padding: 16px 20px;
            font-family: var(--font-general-sans);
            font-size: 1rem;
            transition: all 0.3s ease;

            &::placeholder {
                color: #888;
            }

            &:focus {
                border-color: #c4ff00;
                background-color: rgb(28, 28, 28);

                &::placeholder {
                    color: #aaa;
                }
            }

            &:-webkit-autofill,
            &:-webkit-autofill:hover,
            &:-webkit-autofill:focus {
                -webkit-text-fill-color: var(--white);
                -webkit-box-shadow: 0 0 0px 1000px rgb(20, 20, 20) inset;
                transition: background-color 5000s ease-in-out 0s;
            }

            @media ${device.sm} {
                padding: 14px 18px;
                font-size: 0.95rem;
            }
        }

        textarea {
            width: 100%;
            background-color: rgb(20, 20, 20);
            outline: none;
            border: 1px solid rgb(41, 41, 41);
            color: var(--white);
            border-radius: 12px;
            padding: 16px 20px;
            font-family: var(--font-general-sans);
            font-size: 1rem;
            transition: all 0.3s ease;
            resize: vertical;
            min-height: 160px;

            &::placeholder {
                color: #888;
            }

            &:focus {
                border-color: #c4ff00;
                background-color: rgb(28, 28, 28);

                &::placeholder {
                    color: #aaa;
                }
            }

            &:-webkit-autofill,
            &:-webkit-autofill:hover,
            &:-webkit-autofill:focus {
                -webkit-text-fill-color: var(--white);
                -webkit-box-shadow: 0 0 0px 1000px rgb(20, 20, 20) inset;
                transition: background-color 5000s ease-in-out 0s;
            }

            @media ${device.sm} {
                padding: 14px 18px;
                font-size: 0.95rem;
                min-height: 140px;
            }
        }

        button {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-top: 8px;
            padding: 16px 32px;
            font-size: 1rem;
            font-weight: 500;
            border: none;
            border-radius: 12px;
            background-color: #c4ff00;
            color: #000;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: var(--font-general-sans);

            .icon {
                font-size: 1.2rem;
            }

            &:hover:not(:disabled) {
                background-color: #b3e600;
                transform: translateY(-2px);
            }

            &:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                background-color: rgb(57, 57, 57);
                color: #888;
            }

            @media ${device.sm} {
                padding: 14px 28px;
                font-size: 0.95rem;
            }
        }
    }
`
