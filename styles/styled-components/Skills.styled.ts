'use client'
import styled from 'styled-components'
import { device } from './Breakpoints'
import { padding } from './Helpers'

export const StyledSkills = styled.section`
    ${padding()}
    position: relative;
    width: 100%;
    padding-top: var(--section-space);
    padding-bottom: var(--section-space);

    .skills-header {
        text-align: center;
        margin-bottom: var(--sp-8);

        @media ${device.sm} {
            margin-bottom: var(--sp-6);
        }

        h2 {
            font-family: var(--font-general-sans);
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 400;
            color: var(--white);
            margin-bottom: 20px;

            .secondary-text {
                color: #888;
                font-weight: 300;
            }
        }

        .subtitle {
            font-family: var(--font-general-sans);
            font-size: clamp(1rem, 2vw, 1.25rem);
            color: var(--c-text-muted);
            font-weight: 300;
        }
    }
`
