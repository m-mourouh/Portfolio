'use client'
import styled, { css } from 'styled-components'
import { selection } from './Helpers'

type ButtonProps = {
    width?: number
    radius?: number
}
export const StyledButton = styled.button<ButtonProps>`
    outline: none;
    background: none;
    border: 1px solid var(--orchid);
    color: var(--orchid);
    cursor: pointer;
    border-radius: ${({ radius = 50 }) => `${radius}px`};
    font-family: var(--font-fira-code);
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;

    ${({ width }) =>
        width &&
        css`
            max-width: ${width}px;
        `}
    transition: all 0.2s ease-in-out;
    &:hover {
        background-color: rgba(63, 24, 90, 0.5);
        color: var(--white);
        opacity: 1;
    }
`
