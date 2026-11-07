import { css, RuleSet } from 'styled-components'
import { device } from './Breakpoints'
// this allows to reset selection
export function selection(fill: boolean = false, color?: string): RuleSet {
    
    const filledSelection = css`
        &::selection {
            color: ${color ? color : 'var(--white)'};
            -webkit-text-stroke: transparent;
        }
    `
    const emptySelection = css`
        &::selection {
            /* color: transparent; */
            -webkit-text-stroke: 1px ${color ? color : 'var(--color-1)'};
           /* text-stroke: 1px ${color ? color : 'var(--color-2)'}; */
        }
    `

    return fill? filledSelection : emptySelection
}
export function padding(): RuleSet {

    // Horizontal page gutters only: never touches vertical padding, so sections keep
    // their --section-space rhythm at every breakpoint
    return css`
        padding-left: 150px;
        padding-right: 150px;
        @media (max-width: 1061px) {
            padding-left: 80px;
            padding-right: 80px;
        }
        @media ${device.sm} {
            padding-left: 40px;
            padding-right: 40px;
        }
        @media (max-width: 450px) {
            padding-left: 20px;
            padding-right: 20px;
        }
    `
}
export function titleFont(primary: boolean = true): RuleSet {

    return css`
        ${primary
            ? css`
                  font-size: clamp(30px, 7vw, 80px);
                  @media (max-width: 350px) {
                      font-size: clamp(25px, 4vw, 40px);
                  }
              `
            : css`
                  font-size: clamp(25px, 8vw, 40px);
              `}
        font-weight: 900;
    `
}
export function titleLine(n: number): RuleSet {

    return css`
        &::after {
            content: '';
            width: calc(100% - ${n}ch);
            height: 0.5px;
            background-color: var(--c2);
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 0;
            opacity: 0.2;
        }
    `
}
export function resposiveParagraph(): RuleSet {

    return css`
        @media ${device.xs} {
            font-size: 0.9rem;
            line-height: 2rem;
            
        }
    `
}