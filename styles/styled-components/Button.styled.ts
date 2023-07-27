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
    background-color: #2f2f2f;
    /* border: 1px solid var(--white); */
    color: var(--white);
    cursor: pointer;
    border-radius: ${({ radius = 8 }) => `${radius}px`};
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
        background-color: #2b2a2a;
        color: var(--white);
        opacity: 1;
    }
    &:disabled {
        opacity: 0.3;
    }
`
