'use client'
import styled, { css } from 'styled-components'
import { selection } from './Helpers'

type ButtonProps = {
    $width?: number
    $radius?: number
    $contact?: boolean
    $outline?: boolean
    $primary?: boolean
}
export const StyledButton = styled.button<ButtonProps>`
    outline: none;
    background-color: ${({ $outline, $primary }) =>
        $outline ? 'rgb(44, 44, 44)' :
        $primary ? '#c4ff00' :
        'rgb(44, 44, 44)'
    };
    border: 1px solid ${({ $outline, $primary }) =>
        $outline ? 'rgb(57, 57, 57)' :
        $primary ? '#c4ff00' :
        'rgb(57, 57, 57)'
    };
    color: ${({ $primary }) => $primary ? '#000' : 'var(--white)'};
    cursor: pointer;
    border-radius: 12px;
    font-family: var(--font-general-sans);
    padding: 14px 32px;
    text-align: center;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 500;
    opacity: 1;
    ${({ $width }) =>
        $width &&
        css`
            max-width: ${$width}px;
            width: ${$width}px;
        `}
    ${({ $contact }) =>
        $contact &&
        css`
            &:disabled {
                border: 1px solid var(--c1);
                color: var(--c1);
            }
        `}

    transition: all 0.25s ease-in-out;
    &:not(:disabled):hover {
        background-color: ${({ $outline, $primary }) =>
            $outline ? 'rgb(57, 57, 57)' :
            $primary ? '#a8d600' :
            'rgb(57, 57, 57)'
        };
        border-color: ${({ $outline, $primary }) =>
            $outline ? 'rgb(80, 80, 80)' :
            $primary ? '#a8d600' :
            'rgb(80, 80, 80)'
        };
        color: ${({ $primary }) => $primary ? '#000' : 'var(--white)'};
        opacity: 1;
    }
    &:disabled {
        opacity: 0.3;
    }
`
