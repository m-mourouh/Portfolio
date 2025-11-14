'use client'
import styled, { css } from 'styled-components'
import { selection } from './Helpers'

type ButtonProps = {
    width?: number
    radius?: number
    contact?: boolean
    outline?: boolean
    primary?: boolean
}
export const StyledButton = styled.button<ButtonProps>`
    outline: none;
    background-color: ${({ outline, primary }) =>
        outline ? 'var(--bg-secondary)' :
        primary ? '#c4ff00' :
        'var(--bg-secondary)'
    };
    border: 1px solid ${({ outline, primary }) =>
        outline ? 'var(--border-color)' :
        primary ? '#c4ff00' :
        'var(--border-color)'
    };
    color: ${({ primary }) => primary ? '#000' : 'var(--text-primary)'};
    cursor: pointer;
    border-radius: 12px;
    font-family: var(--font-general-sans);
    padding: 14px 32px;
    text-align: center;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 500;
    opacity: 1;
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

    transition: all 0.25s ease-in-out;
    &:not(:disabled):hover {
        background-color: ${({ outline, primary }) =>
            outline ? 'var(--card-bg-hover, var(--bg-tertiary))' :
            primary ? '#a8d600' :
            'var(--card-bg-hover, var(--bg-tertiary))'
        };
        border-color: ${({ outline, primary }) =>
            outline ? '#c4ff00' :
            primary ? '#a8d600' :
            '#c4ff00'
        };
        color: ${({ primary }) => primary ? '#000' : 'var(--text-primary)'};
        opacity: 1;
    }
    &:disabled {
        opacity: 0.3;
    }
`
