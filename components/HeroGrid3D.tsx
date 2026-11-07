'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { device } from '@/styles/styled-components/Breakpoints'

// WebGL scene: client-only, loaded lazily so it never blocks the first paint
const HeroGridScene = dynamic(() => import('./HeroGridScene'), { ssr: false })

const hasWebGL = () => {
    try {
        const c = document.createElement('canvas')
        return !!(c.getContext('webgl2') || c.getContext('webgl'))
    } catch {
        return false
    }
}

/**
 * Hero background. Desktop with WebGL: the interactive "Systems in Motion" scene.
 * Phones / no WebGL: a static CSS perspective grid; the stack is then an SVG (HeroStackSvg).
 */
export default function HeroGrid3D({ onMode }: { onMode?: (webgl: boolean) => void }) {
    const [webgl, setWebgl] = useState(false)

    useEffect(() => {
        const on = window.matchMedia('(min-width: 769px)').matches && hasWebGL()
        setWebgl(on)
        onMode?.(on)
    }, [onMode])

    return (
        <Layer aria-hidden="true">
            {webgl ? (
                <HeroGridScene />
            ) : (
                <div className="fallback-floor" />
            )}
        </Layer>
    )
}

const Layer = styled.div`
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
    /* hides the page's flat grid behind the hero; fades into the next section */
    background: ${({ theme }) => theme.dark.background};
    -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 78%, transparent 100%);
    mask-image: linear-gradient(to bottom, #000 0%, #000 78%, transparent 100%);

    .fallback-floor {
        position: absolute;
        left: -50%;
        right: -50%;
        bottom: -10%;
        height: 70%;
        background-image: linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
        background-size: 50px 50px;
        transform: perspective(420px) rotateX(62deg);
        transform-origin: center bottom;
        -webkit-mask-image: linear-gradient(to top, #000 10%, transparent 90%);
        mask-image: linear-gradient(to top, #000 10%, transparent 90%);

        @media ${device.sm} {
            height: 55%;
        }
    }
`
