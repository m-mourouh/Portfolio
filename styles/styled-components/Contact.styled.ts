'use client'
import styled from 'styled-components'
import { device } from './Breakpoints'
import { padding, selection, titleFont, titleLine } from './Helpers'

export const StyledSection = styled.section`
    ${padding()}
    @media ${device.sm} {
        margin-top: 100px;
    }
    position: relative;
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    h1 {
        text-transform: capitalize;
        font-family: var(--font-roboto);
        margin-bottom: 55px;
        position: relative;
        /* features */
        color: transparent;
        -webkit-text-stroke: 1px var(--white);
        ${selection(true, '#fff')}
        ${titleFont(false)}
                ${titleLine(10)}
    }
    form {
        max-width: 800px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-self: center;
        grid-gap: 20px;
        margin: 100px auto;
        .error {
            padding-left: 10px;
            color: var(--orchid);
            margin-top: 5px;
            transition: all 0.25s ease-in-out;
            font-family: var(--font-roboto-mono);
            small {
                display: flex;
                align-items: center;
                grid-gap: 5px;
            }
        }
        input {
            transition: all 0.25s ease-in-out;
            width: 100%;
            background: none !important;
            outline: none;
            border: 1px solid var(--orchid);
            opacity: 0.5;
            color: var(--c1);
            border-radius: 50px;
            padding: 12px 20px;
            font-family: var(--font-roboto-mono);
            font-size: 1rem;
            transition: all 0.2s ease-in-out;
            &:focus {
                opacity: 1;
                border: 1px solid var(--orchid);
                color: var(--orchid);
                &::placeholder {
                    color: var(--orchid);
                }
            }
            &:-webkit-autofill,
            &:-webkit-autofill:hover,
            &:-webkit-autofill:focus {
                -webkit-text-fill-color: var(--orchid);
                -webkit-box-shadow: 0 0 0px 1000px
                    ${({ theme }) => theme.dark.background} inset;
                transition: background-color 5000s ease-in-out 0s;
            }

            &:valid {
                opacity: 1;
                color: var(--orchid);
                border-color: var(--orchid);
            }
        }
        textarea {
            width: 100%;
            background: transparent;
            outline: none;
            border: 1px solid var(--orchid);

            color: var(--c1);
            border-radius: 10px;
            padding: 12px 20px;
            font-family: var(--font-roboto-mono);
            font-size: 1rem;
            transition: all 0.2s ease-in-out;
            resize: none;
            opacity: 0.5;
            &:focus {
                border: 1px solid var(--orchid);
                opacity: 1;
                &::placeholder {
                    color: var(--orchid);
                }
                color: var(--orchid);
                background: none;
            }
            &:valid {
                opacity: 1;
                color: var(--orchid);
                border-color: var(--orchid);
            }
            &:-webkit-autofill,
            &:-webkit-autofill:hover,
            &:-webkit-autofill:focus {
                -webkit-text-fill-color: var(--orchid);
                -webkit-box-shadow: 0 0 0px 1000px
                    ${({ theme }) => theme.dark.background} inset;
                transition: background-color 5000s ease-in-out 0s;
            }
        }
        button {
            display: flex;
            align-items: center;
            justify-content: center;
            grid-gap: 20px;
            &:not(:disabled):hover {
                opacity: 1;
            }
        }
        @media (max-width: 1078px) {
            margin: 0 auto;
        }
    }
`
