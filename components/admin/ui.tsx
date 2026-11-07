'use client'
import styled, { createGlobalStyle, css } from 'styled-components'

// Shared building blocks for the admin dashboard (same dark look and accent as the site).
export const AdminGlobalStyle = createGlobalStyle`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
        background: #141414;
        color: #f2f2f2;
        cursor: auto;
        font-family: var(--font-space-grotesk), system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
    }
    a { color: inherit; }
    button, input, textarea, select { font: inherit; color: inherit; }
`

export const Button = styled.button<{ $primary?: boolean; $danger?: boolean; $small?: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: ${({ $small }) => ($small ? '6px 12px' : '11px 20px')};
    border-radius: 10px;
    border: 1px solid #3a3a3a;
    background: #262626;
    color: #f2f2f2;
    font-weight: 500;
    font-size: ${({ $small }) => ($small ? '0.85rem' : '0.95rem')};
    cursor: pointer;
    white-space: nowrap;
    transition: background-color 0.2s, border-color 0.2s, opacity 0.2s;

    &:hover:not(:disabled) {
        border-color: #555;
        background: #2e2e2e;
    }
    &:focus-visible {
        outline: 2px solid #c4ff00;
        outline-offset: 2px;
    }
    &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }

    ${({ $primary }) =>
        $primary &&
        css`
            background: #c4ff00;
            border-color: #c4ff00;
            color: #111;
            &:hover:not(:disabled) {
                background: #b0e600;
                border-color: #b0e600;
            }
        `}
    ${({ $danger }) =>
        $danger &&
        css`
            color: #ff8c8c;
            border-color: rgba(255, 107, 107, 0.4);
            background: transparent;
            &:hover:not(:disabled) {
                background: rgba(255, 107, 107, 0.1);
                border-color: #ff6b6b;
            }
        `}
`

export const Card = styled.section`
    background: #1c1c1c;
    border: 1px solid #2d2d2d;
    border-radius: 16px;
    padding: 24px;
`

export const Field = styled.label`
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.85rem;
    color: #aaa;

    .hint {
        font-size: 0.78rem;
        color: #777;
    }
`

const control = css`
    width: 100%;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid #333;
    background: #141414;
    color: #f2f2f2;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
        border-color: #c4ff00;
    }
    &[aria-invalid='true'] {
        border-color: #ff6b6b;
    }
`

export const Input = styled.input`
    ${control}
`

export const Textarea = styled.textarea`
    ${control}
    resize: vertical;
    min-height: 90px;
    line-height: 1.5;
`

export const Badge = styled.span<{ $tone?: 'accent' | 'muted' }>`
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    ${({ $tone }) =>
        $tone === 'accent'
            ? css`
                  background: rgba(196, 255, 0, 0.12);
                  color: #c4ff00;
              `
            : css`
                  background: #2a2a2a;
                  color: #999;
              `}
`

export const Notice = styled.div<{ $tone: 'success' | 'error' | 'info' }>`
    padding: 12px 14px;
    border-radius: 12px;
    font-size: 0.9rem;
    line-height: 1.5;
    border: 1px solid;
    ${({ $tone }) =>
        $tone === 'success'
            ? css`
                  background: rgba(196, 255, 0, 0.08);
                  border-color: rgba(196, 255, 0, 0.35);
                  color: #d9ff66;
              `
            : $tone === 'error'
            ? css`
                  background: rgba(255, 107, 107, 0.08);
                  border-color: rgba(255, 107, 107, 0.35);
                  color: #ff8c8c;
              `
            : css`
                  background: #1f1f1f;
                  border-color: #333;
                  color: #aaa;
              `}

    a {
        color: inherit;
        font-weight: 600;
    }
`
