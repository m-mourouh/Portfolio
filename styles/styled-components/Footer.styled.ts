"use client"
import styled from "styled-components";


export const StyledFooter = styled.footer`
    width: 100%;
    text-align: center;
    margin-top: 100px;
    padding: 15px;
    font-family: var(--font-roboto-mono);

    p {
        font-size: 0.9rem;
        &:last-of-type {
            margin-top: 20px;
            opacity: 0.5;
        }
        a {
            text-decoration: none;
            color: var(--c2);
            transition: all 0.25s ease-in-out;
            display: flex;
            justify-content: center;
            align-items: center;
            grid-gap: 5px;
            &:hover {
                color: var(--orchid);
            }
        }
    }


`