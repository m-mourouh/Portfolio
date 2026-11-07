'use client'
import styled from 'styled-components'
import {
    padding,
    resposiveParagraph,
    selection,
    titleFont,
    titleLine,
} from './Helpers'
import { device } from './Breakpoints'

export const StyledProjects = styled.section`
    ${padding()}
    padding-top: var(--section-space);
    padding-bottom: var(--section-space);
    font-family: var(--font-roboto-mono);
    color: var(--white);
    display: flex;
    flex-direction: column;
    justify-content: center;



    .projects-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 60px;

        @media ${device.sm} {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
            margin-bottom: 40px;
        }

        h1,
        h2 {
            font-family: var(--font-general-sans);
            margin: 0;
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 400;
            line-height: 1.2;
            color: var(--white);
            ${selection(true, '#fff')}

            .secondary-text {
                color: #888;
                font-weight: 300;
            }
        }

        .view-all-btn {
            background-color: #c4ff00;
            color: #000;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: var(--font-general-sans);
            font-size: 0.95rem;
            font-weight: 500;
            text-decoration: none;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;

            &:hover {
                background-color: #b3e600;
                transform: translateX(4px);
            }

            @media ${device.sm} {
                padding: 10px 20px;
                font-size: 0.875rem;
            }
        }
    }

    /* image preview following the cursor over the project index (desktop) */
    .list-preview {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 50;
        width: 300px;
        aspect-ratio: 16 / 10;
        border-radius: var(--radius-m);
        overflow: hidden;
        pointer-events: none;
        background: var(--c-surface);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        opacity: 0;
        transform-origin: left center;
        scale: 0.92;
        transition: opacity 0.3s ease, scale 0.4s cubic-bezier(0.22, 1, 0.36, 1);

        &.show {
            opacity: 1;
            scale: 1;
        }
        img {
            object-fit: cover;
        }
        @media (hover: none), (pointer: coarse) {
            display: none;
        }
    }

    /* "View All Projects": compact list of the remaining projects */
    .more-projects {
        list-style: none;
        margin: 40px 0 0;
        padding: 0;
        border-top: 1px solid rgb(41, 41, 41);
    }

    .more-row {
        width: 100%;
        display: grid;
        grid-template-columns: 44px minmax(180px, 1.1fr) 2fr minmax(140px, 1fr) 24px;
        gap: 24px;
        align-items: center;
        padding: 22px 12px;
        background: none;
        border: none;
        border-bottom: 1px solid rgb(41, 41, 41);
        color: inherit;
        text-align: start;
        cursor: pointer;
        font-family: var(--font-general-sans);
        transition: background-color 0.25s ease;

        .more-num {
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 13px;
            color: var(--c-accent);
        }

        .more-name {
            font-size: 1.25rem;
            font-weight: 500;
            color: var(--white);
            transition: color 0.25s ease;
        }

        .more-desc {
            color: #888;
            font-size: 0.95rem;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .more-stack {
            color: var(--c-text-muted);
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .more-arrow {
            font-size: 1.2rem;
            color: var(--c-text-muted);
            transition: color 0.25s ease, transform 0.25s ease;
        }

        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: -2px;
        }
        &:hover,
        &:focus-visible {
            background-color: rgb(26, 26, 26);

            .more-name,
            .more-arrow {
                color: #c4ff00;
            }

            .more-arrow {
                transform: translate(2px, -2px);
            }
        }

        @media ${device.sm} {
            grid-template-columns: 32px 1fr 24px;
            gap: 6px 12px;
            padding: 18px 4px;

            .more-desc,
            .more-stack {
                grid-column: 2 / 3;
            }

            .more-arrow {
                grid-row: 1;
                grid-column: 3;
            }
        }
    }

    .view-all-wrap {
        display: flex;
        justify-content: center;
        margin-top: 48px;
    }

    .view-all-toggle {
        padding: 14px 28px;
        border-radius: 12px;
        border: 1px solid rgb(57, 57, 57);
        background: rgb(32, 32, 32);
        color: var(--white);
        font-family: var(--font-general-sans);
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: border-color 0.25s ease, background-color 0.25s ease;

        &:hover,
        &:focus-visible {
            border-color: #c4ff00;
            background: rgb(40, 40, 40);
            outline: none;
        }
    }

    .projects-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;

        @media ${device.sm} {
            grid-template-columns: 1fr;
            gap: 20px;
        }

        .project-card {
            display: flex;
            flex-direction: column;
            background-color: rgb(28, 28, 28);
            border: 1px solid rgb(41, 41, 41);
            border-radius: 16px;
            overflow: hidden;
            cursor: pointer;
            transition: border-color 0.3s ease;

            &:hover,
            &:focus-visible {
                border-color: rgb(70, 70, 70);
                outline: none;
            }

            &:focus-visible {
                border-color: #c4ff00;
            }

            /* "View details" hint shown on hover */
            .view-details {
                position: absolute;
                left: 20px;
                bottom: 20px;
                padding: 8px 16px;
                border-radius: 999px;
                background: rgba(20, 20, 20, 0.85);
                border: 1px solid rgba(196, 255, 0, 0.4);
                color: #c4ff00;
                font-size: 0.9rem;
                font-weight: 500;
                opacity: 0;
                transform: translateY(10px);
                transition: opacity 0.3s ease, transform 0.3s ease;
                pointer-events: none;

                @media ${device.sm} {
                    left: 16px;
                    bottom: 16px;
                }
            }

            .card-link {
                display: block;
                text-decoration: none;
            }

            .project-image {
                position: relative;
                width: 100%;
                height: 400px;
                overflow: hidden;
                background-color: rgb(20, 20, 20);

                @media ${device.sm} {
                    height: 240px;
                }

                /* "Built on the grid": duotone at rest (dark + lime), color is redrawn on hover */
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    filter: grayscale(1) contrast(1.2) brightness(0.52);
                }

                .duotone-tint {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(160deg, #b5e61a 0%, #4f6112 100%);
                    mix-blend-mode: multiply;
                    opacity: 0.42;
                    pointer-events: none;
                }

                .grid-reveal {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }

                .image-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    /* no dark veil: it would dull the color reveal */
                    background: none;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    display: flex;
                    align-items: flex-start;
                    justify-content: flex-end;
                    padding: 20px;

                    @media ${device.sm} {
                        padding: 16px;
                    }

                    .card-links {
                        display: flex;
                        gap: 12px;

                        @media ${device.sm} {
                            gap: 10px;
                        }

                        .link-icon {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 44px;
                            height: 44px;
                            background-color: rgba(255, 255, 255, 0.95);
                            border-radius: 50%;
                            color: #000;
                            font-size: 1.2rem;
                            text-decoration: none;
                            transition: all 0.3s ease;
                            transform: translateY(-10px);
                            opacity: 0;

                            &:hover {
                                background-color: #c4ff00;
                                transform: translateY(0) scale(1.1);
                            }

                            @media ${device.sm} {
                                width: 40px;
                                height: 40px;
                                font-size: 1.1rem;
                            }
                        }
                    }
                }
            }

            &:hover {
                .project-title {
                    color: #c4ff00;
                }
                .card-meta .card-arrow {
                    color: #c4ff00;
                    transform: translate(2px, -2px);
                }

                .project-image {
                    .image-overlay {
                        opacity: 1;

                        .view-details {
                            opacity: 1;
                            transform: translateY(0);
                        }

                        .link-icon {
                            opacity: 1;
                            transform: translateY(0);
                            transition-delay: 0.1s;

                            &:nth-child(2) {
                                transition-delay: 0.15s;
                            }
                        }
                    }
                }
            }

            .card-info {
                padding: 24px;
                display: flex;
                flex-direction: column;
                gap: 16px;
                flex: 1;

                @media ${device.sm} {
                    padding: 20px;
                    gap: 14px;
                }

                .card-meta {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-family: var(--font-general-sans);
                    font-size: 0.85rem;
                    color: var(--c-text-muted);

                    span + span::before {
                        content: '·';
                        margin-inline-end: 10px;
                        color: #555;
                    }

                    .card-index {
                        color: #c4ff00;
                        font-weight: 600;
                        letter-spacing: 0.04em;
                        font-variant-numeric: tabular-nums;
                    }

                    .card-arrow {
                        margin-inline-start: auto;
                        font-size: 1.2rem;
                        color: #666;
                        transition: color 0.3s ease, transform 0.3s ease;
                    }
                }

                .card-open {
                    all: unset;
                    cursor: pointer;
                    &:focus-visible {
                        outline: 2px solid var(--c-accent);
                        outline-offset: 4px;
                        border-radius: 4px;
                    }
                }

                .project-title {
                    font-family: var(--font-general-sans);
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: var(--white);
                    margin: 0;
                    transition: color 0.3s ease;

                    @media ${device.sm} {
                        font-size: 1.25rem;
                    }
                }

                .project-description {
                    font-family: var(--font-general-sans);
                    font-size: 0.95rem;
                    color: #888;
                    line-height: 1.6;
                    margin: 0;
                    font-weight: 300;

                    @media ${device.sm} {
                        font-size: 0.875rem;
                    }
                }

                .tech-stack {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;

                    .tech-tag {
                        padding: 6px 12px;
                        background-color: rgb(41, 41, 41);
                        border-radius: 6px;
                        font-family: var(--font-general-sans);
                        font-size: 0.75rem;
                        color: var(--c-text-muted); /* 4.5:1+ on the tag background */
                        font-weight: 400;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;

                        @media ${device.sm} {
                            font-size: 0.7rem;
                            padding: 5px 10px;
                        }
                    }
                }
            }
        }
    }

    /* ======================================================================
       V3 — editorial project compositions: each project gets its own layout
       01 full-width feature · 02 wide left · 03 tall right (offset) · 04 split
       ====================================================================== */
    .projects-list {
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: var(--sp-12) var(--sp-4);

        @media ${device.sm} {
            grid-template-columns: 1fr;
            gap: var(--sp-8);
        }

        > .project-card {
            grid-column: 1 / -1;
            background: none;
            border: none;
            border-radius: 0;
            overflow: visible;

            &:hover,
            &:focus-within {
                border: none;
            }

            .project-image {
                height: auto;
                aspect-ratio: 16 / 10;
                border-radius: var(--radius-m);
                background: var(--c-surface);
                /* clip the parallax media and the reveal wipe to the rounded frame */
                isolation: isolate;
            }

            /* media is taller than the frame so the parallax never shows an edge */
            .media {
                position: absolute;
                left: 0;
                right: 0;
                top: -6%;
                bottom: -6%;
                will-change: transform;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: filter 0.8s ease;
                }
                .duotone-tint {
                    transition: opacity 0.8s ease;
                }
            }

            /* touch screens: full color while the project is in the middle of the screen */
            &.in-color .media img {
                filter: none;
            }
            &.in-color .media .duotone-tint {
                opacity: 0;
            }

            .card-info {
                padding: var(--sp-3) 0 0;
                gap: 12px;
            }

            .project-description {
                max-width: 52ch;
            }
        }

        /* 01 — full-bleed cinematic feature: the image spans the whole viewport width
           (negative margins equal to the page gutters); its text stays on the grid */
        > .project-card:nth-child(1) {
            .project-image {
                aspect-ratio: 21 / 9;
                /* width: auto lets both negative margins apply (100% only shifted it left) */
                width: auto;
                margin-left: -150px;
                margin-right: -150px;
                border-radius: 0;

                @media (max-width: 1061px) {
                    margin-left: -80px;
                    margin-right: -80px;
                }
                @media ${device.sm} {
                    margin-left: -40px;
                    margin-right: -40px;
                }
                @media (max-width: 450px) {
                    margin-left: -20px;
                    margin-right: -20px;
                }
            }
            .card-info {
                display: grid;
                grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                grid-template-areas: 'meta desc' 'title desc' 'title tags';
                column-gap: var(--sp-8);
                align-items: start;
            }
            .card-meta {
                grid-area: meta;
            }
            .project-title {
                grid-area: title;
                font-size: clamp(2.2rem, 4.6vw, 4.5rem);
                font-weight: 500;
                letter-spacing: -0.03em;
                line-height: 1;
            }
            .project-description {
                grid-area: desc;
                font-size: var(--fs-lead);
            }
            .tech-stack {
                grid-area: tags;
            }
        }

        /* 02 — wide landscape, left */
        > .project-card:nth-child(2) {
            grid-column: 1 / span 7;
            .project-image {
                aspect-ratio: 4 / 3;
            }
        }

        /* 03 — tall portrait, right, offset lower: an asymmetric spread with 02 */
        > .project-card:nth-child(3) {
            grid-column: 9 / span 4;
            margin-top: var(--sp-16);
            .project-image {
                aspect-ratio: 4 / 5;
            }
        }

        /* 04 — split: text left, image right */
        > .project-card:nth-child(4) {
            display: grid;
            grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
            column-gap: var(--sp-8);
            align-items: end;
            .card-info {
                order: -1;
                padding: 0 0 var(--sp-3);
            }
            .project-title {
                font-size: clamp(1.9rem, 3.4vw, 3.2rem);
                font-weight: 500;
                letter-spacing: -0.025em;
            }
        }

        /* titles grow with the editorial layouts */
        > .project-card .project-title {
            font-size: clamp(1.5rem, 2.2vw, 2.1rem);
            letter-spacing: -0.02em;
        }

        @media ${device.md} {
            > .project-card:nth-child(n) {
                grid-column: 1 / -1;
                margin-top: 0;
            }
            > .project-card:nth-child(4) {
                display: block;
                .card-info {
                    padding: var(--sp-3) 0 0;
                }
            }
            > .project-card:nth-child(1) .card-info {
                display: flex;
                flex-direction: column;
                align-items: stretch;
            }
            > .project-card:nth-child(n) .project-image {
                aspect-ratio: 4 / 3;
            }
            > .project-card:nth-child(1) .project-image {
                aspect-ratio: 16 / 10;
            }
        }
    }
`
