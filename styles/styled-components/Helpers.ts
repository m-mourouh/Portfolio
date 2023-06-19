import { FlattenSimpleInterpolation, css } from 'styled-components'
import { device } from './Breakpoints'
// this allows to reset selection
export function selection(fill: boolean = false, color?: string): FlattenSimpleInterpolation {
    
    const filledSelection = css`
        &::selection {
            color: ${color ? color : 'var(--orchid)'};
            -webkit-text-stroke: transparent;
        }
    `
    const emptySelection = css`
        
        &::selection {
            color: transparent;
            -webkit-text-stroke: 1px ${color ? color : 'var(--orchid)'};
        }
    `

    return fill? filledSelection : emptySelection
}
export function padding(): FlattenSimpleInterpolation {

    return css`
        padding: 0 150px;
        @media (max-width: 1061px) {
            padding: 0px 80px;
        }
        @media ${device.sm} {
            padding: 0 40px;
        }
        @media (max-width: 450px) {
            padding: 0 20px;
        }
    `
}
export function titleFont(primary: boolean = true): FlattenSimpleInterpolation {

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
export function titleLine(n: number): FlattenSimpleInterpolation {

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
export function resposiveParagraph(): FlattenSimpleInterpolation {

    return css`
        @media ${device.xs} {
            font-size: 0.9rem;
            line-height: 2rem;
            
        }
    `
}