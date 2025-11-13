'use client'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { gsap } from 'gsap'

const HeatmapContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 8px;

    .heatmap-title {
        font-family: var(--font-general-sans);
        font-size: 0.875rem;
        color: #888;
        font-weight: 400;
        margin-bottom: 8px;
    }

    .heatmap-grid {
        display: grid;
        grid-template-columns: repeat(20, 1fr);
        gap: 4px;
        width: 100%;

        @media (max-width: 768px) {
            grid-template-columns: repeat(15, 1fr);
        }

        @media (max-width: 480px) {
            grid-template-columns: repeat(10, 1fr);
        }
    }

    .heatmap-cell {
        aspect-ratio: 1;
        background-color: rgb(44, 44, 44);
        border: 1px solid rgb(57, 57, 57);
        border-radius: 3px;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;

        &[data-level="1"] {
            background-color: rgba(196, 255, 0, 0.2);
            border-color: rgba(196, 255, 0, 0.3);
        }

        &[data-level="2"] {
            background-color: rgba(196, 255, 0, 0.4);
            border-color: rgba(196, 255, 0, 0.5);
        }

        &[data-level="3"] {
            background-color: rgba(196, 255, 0, 0.6);
            border-color: rgba(196, 255, 0, 0.7);
        }

        &[data-level="4"] {
            background-color: rgba(196, 255, 0, 0.8);
            border-color: #c4ff00;
        }

        &[data-level="5"] {
            background-color: #c4ff00;
            border-color: #c4ff00;
            box-shadow: 0 0 10px rgba(196, 255, 0, 0.3);
        }

        &:hover {
            transform: scale(1.2);
            z-index: 10;
            box-shadow: 0 0 15px rgba(196, 255, 0, 0.5);
        }
    }

    .heatmap-legend {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 16px;
        font-family: var(--font-general-sans);
        font-size: 0.75rem;
        color: #888;

        .legend-label {
            margin-right: 8px;
        }

        .legend-colors {
            display: flex;
            gap: 4px;
        }

        .legend-cell {
            width: 12px;
            height: 12px;
            border-radius: 2px;
            border: 1px solid rgb(57, 57, 57);
        }
    }

    .activity-stats {
        display: flex;
        gap: 20px;
        margin-top: 16px;
        font-family: var(--font-general-sans);

        .stat-item {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .stat-value {
                font-size: 1.5rem;
                font-weight: 600;
                color: #c4ff00;
            }

            .stat-label {
                font-size: 0.75rem;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
        }
    }

    .tooltip {
        position: fixed;
        background-color: rgb(28, 28, 28);
        border: 1px solid #c4ff00;
        border-radius: 6px;
        padding: 8px 12px;
        font-family: var(--font-general-sans);
        font-size: 0.75rem;
        color: var(--white);
        pointer-events: none;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.2s ease;
        white-space: nowrap;

        &.visible {
            opacity: 1;
        }
    }
`

export default function SkillsHeatmap() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' })
    const [activityData, setActivityData] = useState<number[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // Generate random activity data only on client side (140 cells for ~7 months of activity)
        setActivityData(Array.from({ length: 140 }, () => Math.floor(Math.random() * 6)))
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return
        const cells = containerRef.current?.querySelectorAll('.heatmap-cell')
        if (!cells) return

        gsap.fromTo(
            cells,
            { opacity: 0, scale: 0 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                stagger: 0.005,
                ease: 'back.out(1.7)',
            }
        )
    }, [mounted])

    const handleCellHover = (e: React.MouseEvent, level: number, index: number) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const activities = ['No activity', 'Low activity', 'Moderate activity', 'High activity', 'Very high activity', 'Peak activity']
        setTooltip({
            visible: true,
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
            content: `${activities[level]} • Day ${index + 1}`
        })
    }

    const handleCellLeave = () => {
        setTooltip({ visible: false, x: 0, y: 0, content: '' })
    }

    // Calculate stats
    const totalContributions = activityData.filter(level => level > 0).length
    const currentStreak = activityData.slice(-30).filter(level => level > 0).length

    if (!mounted) {
        // Return placeholder during SSR
        return (
            <HeatmapContainer ref={containerRef}>
                <div className="heatmap-title">Coding Activity Heatmap</div>
                <div className="activity-stats">
                    <div className="stat-item">
                        <div className="stat-value">0</div>
                        <div className="stat-label">Active Days</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">0</div>
                        <div className="stat-label">This Month</div>
                    </div>
                </div>
            </HeatmapContainer>
        )
    }

    return (
        <HeatmapContainer ref={containerRef}>
            <div className="heatmap-title">Coding Activity Heatmap</div>

            <div className="activity-stats">
                <div className="stat-item">
                    <div className="stat-value">{totalContributions}</div>
                    <div className="stat-label">Active Days</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">{currentStreak}</div>
                    <div className="stat-label">This Month</div>
                </div>
            </div>

            <div className="heatmap-grid">
                {activityData.map((level, index) => (
                    <div
                        key={index}
                        className="heatmap-cell"
                        data-level={level}
                        onMouseEnter={(e) => handleCellHover(e, level, index)}
                        onMouseLeave={handleCellLeave}
                    />
                ))}
            </div>

            <div className="heatmap-legend">
                <span className="legend-label">Less</span>
                <div className="legend-colors">
                    {[0, 1, 2, 3, 4, 5].map((level) => (
                        <div
                            key={level}
                            className="legend-cell"
                            data-level={level}
                            style={{
                                backgroundColor: level === 0 ? 'rgb(44, 44, 44)' :
                                    level === 1 ? 'rgba(196, 255, 0, 0.2)' :
                                    level === 2 ? 'rgba(196, 255, 0, 0.4)' :
                                    level === 3 ? 'rgba(196, 255, 0, 0.6)' :
                                    level === 4 ? 'rgba(196, 255, 0, 0.8)' : '#c4ff00'
                            }}
                        />
                    ))}
                </div>
                <span className="legend-label">More</span>
            </div>

            {tooltip.visible && (
                <div
                    className="tooltip visible"
                    style={{
                        left: `${tooltip.x}px`,
                        top: `${tooltip.y}px`,
                        transform: 'translate(-50%, -100%)'
                    }}
                >
                    {tooltip.content}
                </div>
            )}
        </HeatmapContainer>
    )
}
