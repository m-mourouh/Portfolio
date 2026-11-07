'use client'
import dynamic from 'next/dynamic'
import styled from 'styled-components'

// WebGL scene is client-only and loaded lazily so it never blocks first paint
const HeroGridScene = dynamic(() => import('./HeroGridScene'), { ssr: false })

// Occupies only the lower part of the hero so the horizon sits below the headline.
// Its solid background hides the flat 2D grid behind it, so only one grid shows there.
const Layer = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 55%;
    bottom: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
    background: ${({ theme }) => theme.dark.background};
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 30%, #000 50%, transparent 100%);
    mask-image: linear-gradient(to bottom, transparent 0%, #000 30%, #000 50%, transparent 100%);
`

export default function HeroGrid3D() {
    return (
        <Layer aria-hidden="true">
            <HeroGridScene />
        </Layer>
    )
}
