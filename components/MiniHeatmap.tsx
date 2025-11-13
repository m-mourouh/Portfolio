'use client'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { gsap } from 'gsap'

const HeatmapContainer = styled.div`
    margin-top: auto;
    padding-top: 24px;
    width: 100%;

    .grid-heatmap {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 3px;
        width: 100%;

        .cell {
            aspect-ratio: 1;
            background-color: rgb(44, 44, 44);
            border-radius: 2px;
            transition: all 0.2s ease;
            opacity: 0;

            &[data-level="1"] {
                background-color: rgba(196, 255, 0, 0.2);
            }

            &[data-level="2"] {
                background-color: rgba(196, 255, 0, 0.4);
            }

            &[data-level="3"] {
                background-color: rgba(196, 255, 0, 0.6);
            }

            &[data-level="4"] {
                background-color: rgba(196, 255, 0, 0.8);
            }

            &[data-level="5"] {
                background-color: #c4ff00;
            }

            &:hover {
                transform: scale(1.2);
                box-shadow: 0 0 8px rgba(196, 255, 0, 0.4);
            }
        }
    }

    .circular-heatmap {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 80px;
        position: relative;

        .ring {
            position: absolute;
            border-radius: 50%;
            border: 3px solid;
            opacity: 0;
            transition: all 0.3s ease;

            &:hover {
                transform: scale(1.05);
                box-shadow: 0 0 15px rgba(196, 255, 0, 0.3);
            }

            &:nth-child(1) {
                width: 70px;
                height: 70px;
                border-color: rgba(196, 255, 0, 0.3);
            }

            &:nth-child(2) {
                width: 55px;
                height: 55px;
                border-color: rgba(196, 255, 0, 0.5);
            }

            &:nth-child(3) {
                width: 40px;
                height: 40px;
                border-color: rgba(196, 255, 0, 0.7);
            }

            &:nth-child(4) {
                width: 25px;
                height: 25px;
                border-color: #c4ff00;
                background-color: rgba(196, 255, 0, 0.2);
            }
        }
    }

    .wave-heatmap {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 4px;
        height: 50px;
        width: 100%;

        .wave-bar {
            flex: 1;
            background: linear-gradient(to top, rgba(196, 255, 0, 0.6), rgba(196, 255, 0, 0.2));
            border-radius: 3px 3px 0 0;
            transition: all 0.3s ease;
            opacity: 0;
            transform-origin: bottom;

            &:hover {
                background: linear-gradient(to top, #c4ff00, rgba(196, 255, 0, 0.4));
                box-shadow: 0 0 10px rgba(196, 255, 0, 0.3);
            }
        }
    }

    .dots-heatmap {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        gap: 6px;
        width: 100%;
        padding: 10px 0;

        .dot {
            aspect-ratio: 1;
            border-radius: 50%;
            background-color: rgb(44, 44, 44);
            transition: all 0.3s ease;
            opacity: 0;

            &[data-level="1"] {
                background-color: rgba(196, 255, 0, 0.2);
            }

            &[data-level="2"] {
                background-color: rgba(196, 255, 0, 0.4);
            }

            &[data-level="3"] {
                background-color: rgba(196, 255, 0, 0.6);
            }

            &[data-level="4"] {
                background-color: rgba(196, 255, 0, 0.8);
            }

            &[data-level="5"] {
                background-color: #c4ff00;
                box-shadow: 0 0 8px rgba(196, 255, 0, 0.4);
            }

            &:hover {
                transform: scale(1.3);
                box-shadow: 0 0 12px rgba(196, 255, 0, 0.5);
            }
        }
    }
`

type HeatmapType = 'grid' | 'circular' | 'wave' | 'dots'

interface MiniHeatmapProps {
    type: HeatmapType
}

export default function MiniHeatmap({ type }: MiniHeatmapProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [gridData, setGridData] = useState<number[]>([])
    const [waveData, setWaveData] = useState<number[]>([])
    const [dotsData, setDotsData] = useState<number[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // Generate data only on client side
        setGridData(Array.from({ length: 36 }, () => Math.floor(Math.random() * 6)))
        setWaveData(Array.from({ length: 15 }, () => Math.random() * 60 + 20))
        setDotsData(Array.from({ length: 30 }, () => Math.floor(Math.random() * 6)))
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!containerRef.current || !mounted) return

        // No animations - just set opacity to 1
        if (type === 'grid') {
            const cells = containerRef.current.querySelectorAll('.cell')
            cells.forEach(cell => {
                (cell as HTMLElement).style.opacity = '1'
            })
        } else if (type === 'circular') {
            const rings = containerRef.current.querySelectorAll('.ring')
            rings.forEach(ring => {
                (ring as HTMLElement).style.opacity = '1'
            })
        } else if (type === 'wave') {
            const bars = containerRef.current.querySelectorAll('.wave-bar')
            bars.forEach(bar => {
                (bar as HTMLElement).style.opacity = '1'
            })
        } else if (type === 'dots') {
            const dots = containerRef.current.querySelectorAll('.dot')
            dots.forEach(dot => {
                (dot as HTMLElement).style.opacity = '1'
            })
        }
    }, [type, mounted])

    if (!mounted) {
        // Return placeholder during SSR
        return <HeatmapContainer ref={containerRef}></HeatmapContainer>
    }

    return (
        <HeatmapContainer ref={containerRef}>
            {type === 'grid' && (
                <div className="grid-heatmap">
                    {gridData.map((level, idx) => (
                        <div key={idx} className="cell" data-level={level} />
                    ))}
                </div>
            )}

            {type === 'circular' && (
                <div className="circular-heatmap">
                    <div className="ring" />
                    <div className="ring" />
                    <div className="ring" />
                    <div className="ring" />
                </div>
            )}

            {type === 'wave' && (
                <div className="wave-heatmap">
                    {waveData.map((height, idx) => (
                        <div
                            key={idx}
                            className="wave-bar"
                            style={{ height: `${height}%` }}
                        />
                    ))}
                </div>
            )}

            {type === 'dots' && (
                <div className="dots-heatmap">
                    {dotsData.map((level, idx) => (
                        <div key={idx} className="dot" data-level={level} />
                    ))}
                </div>
            )}
        </HeatmapContainer>
    )
}
