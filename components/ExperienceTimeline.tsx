'use client'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { gsap } from 'gsap'

const TimelineContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 8px 0;
    width: 100%;

    .timeline-item {
        display: flex;
        align-items: center;
        gap: 16px;
        opacity: 0;

        .tech-info {
            min-width: 120px;
            display: flex;
            flex-direction: column;
            gap: 4px;

            @media (max-width: 768px) {
                min-width: 100px;
            }

            .tech-name {
                font-family: var(--font-general-sans);
                font-size: 0.95rem;
                font-weight: 500;
                color: var(--white);

                @media (max-width: 768px) {
                    font-size: 0.85rem;
                }
            }

            .tech-years {
                font-family: var(--font-general-sans);
                font-size: 0.75rem;
                color: #888;
                font-weight: 400;
            }
        }

        .bar-container {
            flex: 1;
            height: 24px;
            background-color: rgb(44, 44, 44);
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid rgb(57, 57, 57);
            position: relative;

            .bar-fill {
                height: 100%;
                background: linear-gradient(90deg, rgba(196, 255, 0, 0.3), rgba(196, 255, 0, 0.6));
                border-radius: 12px;
                position: relative;
                transform-origin: left;
                transform: scaleX(0);
                transition: all 0.3s ease;

                &::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    width: 4px;
                    background-color: #c4ff00;
                    box-shadow: 0 0 8px rgba(196, 255, 0, 0.5);
                }

                &:hover {
                    background: linear-gradient(90deg, rgba(196, 255, 0, 0.4), rgba(196, 255, 0, 0.7));
                }
            }
        }

        .experience-label {
            min-width: 60px;
            text-align: right;
            font-family: var(--font-general-sans);
            font-size: 0.85rem;
            font-weight: 600;
            color: #c4ff00;

            @media (max-width: 768px) {
                min-width: 50px;
                font-size: 0.75rem;
            }
        }
    }
`

interface TimelineItem {
    tech: string
    years: number
}

export default function ExperienceTimeline() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)

    // Experience data - customize these values
    const experiences: TimelineItem[] = [
        { tech: 'React.js', years: 5 },
        { tech: 'Node.js', years: 4 },
        { tech: 'TypeScript', years: 4 },
        { tech: 'Python', years: 3 },
        { tech: 'MongoDB', years: 3 },
        { tech: 'Next.js', years: 2 },
    ]

    const maxYears = Math.max(...experiences.map(e => e.years))

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted || !containerRef.current) return

        const items = containerRef.current.querySelectorAll('.timeline-item')
        const bars = containerRef.current.querySelectorAll('.bar-fill')

        // Animate items appearing
        gsap.fromTo(
            items,
            { opacity: 0, x: -30 },
            {
                opacity: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out',
            }
        )

        // Animate bars filling
        gsap.to(bars, {
            scaleX: 1,
            duration: 1,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.3,
        })
    }, [mounted])

    if (!mounted) {
        return <TimelineContainer ref={containerRef}></TimelineContainer>
    }

    return (
        <TimelineContainer ref={containerRef}>
            {experiences.map((item, index) => {
                const percentage = (item.years / maxYears) * 100

                return (
                    <div key={index} className="timeline-item">
                        <div className="tech-info">
                            <div className="tech-name">{item.tech}</div>
                            <div className="tech-years">
                                {item.years} {item.years === 1 ? 'year' : 'years'}
                            </div>
                        </div>
                        <div className="bar-container">
                            <div
                                className="bar-fill"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        <div className="experience-label">{item.years}y</div>
                    </div>
                )
            })}
        </TimelineContainer>
    )
}
