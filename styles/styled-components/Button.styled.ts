'use client'
import styled, { css } from 'styled-components'
import { selection } from './Helpers'

type ButtonProps = {
    width?: number
    radius?: number
    contact?: boolean
}
export const StyledButton = styled.button<ButtonProps>`
    outline: none;
    background: none;
    border: 1px solid var(--orchid);
    color: var(--orchid);
    cursor: pointer;
    border-radius: ${({ radius = 50 }) => `${radius}px`};
    font-family: var(--font-fira-code);
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    font-size: 1rem;
    font-weight: normal;
    ${({ width }) =>
        width &&
        css`
            max-width: ${width}px;
            width: ${width}px;
        `}
    ${({ contact }) =>
        contact &&
        css`
            &:disabled {
                border: 1px solid var(--c1);
                color: var(--c1);
            }
        `}

    /* transition: all 0.15s ease-in-out; */
    &:not(:disabled):hover {
        background-color: rgba(63, 24, 90, 0.5);
        color: var(--white);
        opacity: 1;
    }
    &:disabled {
        opacity: 0.3;
    }
`
