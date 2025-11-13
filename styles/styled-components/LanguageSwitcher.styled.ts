'use client'
import styled from 'styled-components'

export const StyledLanguageSwitcher = styled.div<{ $isMobile?: boolean }>`
    position: relative;
    display: inline-block;

    .language-button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 14px 20px;
        background-color: rgb(44, 44, 44);
        border: 1px solid rgb(57, 57, 57);
        border-radius: 12px;
        color: var(--white);
        font-family: var(--font-general-sans);
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        white-space: nowrap;

        &:hover {
            background-color: rgb(57, 57, 57);
            border-color: #c4ff00;
        }

        .globe-icon {
            font-size: 1.2rem;
            color: #c4ff00;
        }

        .current-lang {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .chevron {
            font-size: 1rem;
            transition: transform 0.3s ease;

            &.open {
                transform: rotate(180deg);
            }
        }
    }

    .dropdown {
        position: absolute;
        ${({ $isMobile }) => $isMobile ? `
            bottom: calc(100% + 8px);
            animation: slideUp 0.2s ease;
        ` : `
            top: calc(100% + 8px);
            animation: slideDown 0.2s ease;
        `}
        right: 0;
        min-width: 180px;
        max-height: 300px;
        overflow-y: auto;
        background-color: rgb(28, 28, 28);
        border: 1px solid rgb(57, 57, 57);
        border-radius: 12px;
        z-index: 1000;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Smooth scrollbar */
        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-track {
            background: rgb(41, 41, 41);
            border-radius: 6px;
        }

        &::-webkit-scrollbar-thumb {
            background: rgb(80, 80, 80);
            border-radius: 6px;

            &:hover {
                background: rgb(100, 100, 100);
            }
        }

        .dropdown-item {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: none;
            border: none;
            color: var(--white);
            font-family: var(--font-general-sans);
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: left;

            .flag {
                font-size: 1.2rem;
            }

            .label {
                flex: 1;
            }

            &:hover {
                background-color: rgb(44, 44, 44);
            }

            &.active {
                background-color: rgba(196, 255, 0, 0.1);
                color: #c4ff00;
                border-left: 3px solid #c4ff00;
            }

            &:not(:last-child) {
                border-bottom: 1px solid rgb(41, 41, 41);
            }
        }
    }
`
