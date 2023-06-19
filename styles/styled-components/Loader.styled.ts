'use client'
import Styled from 'styled-components'
import Img from '@/public/images/loader.svg'
export const StyledSection = Styled.section`
    position: fixed;
    inset: 0;
    background-color: ${({ theme }) => theme.dark.background};
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    overflow: hidden;
    width: 100%;
    z-index: 99999999999;
    background-image: url(${Img.src});
    background-repeat: no-repeat;
    background-position: center center;

    svg {
        path {
           
        }
    }

`
