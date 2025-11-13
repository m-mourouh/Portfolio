'use client'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

const RadarContainer = styled.div`
    margin-top: 20px;
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    animation: fadeIn 0.8s ease-out 0.3s forwards;

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @media (max-width: 768px) {
        height: 300px;
    }

    .recharts-wrapper {
        font-family: var(--font-general-sans);
        outline: none !important;
    }

    .recharts-surface {
        outline: none !important;
    }

    svg {
        outline: none !important;
    }

    * {
        outline: none !important;
    }

    .recharts-polar-angle-axis-tick-value {
        fill: #888;
        font-size: 12px;
        font-weight: 500;

        @media (max-width: 768px) {
            font-size: 10px;
        }
    }

    .recharts-polar-grid-angle line {
        stroke: rgb(80, 80, 80);
    }

    .recharts-polar-grid-concentric-polygon {
        stroke: rgb(57, 57, 57);
    }

    .recharts-polar-radius-axis-tick-value {
        fill: #888;
        font-size: 9px;
    }
`

interface RadarChartProps {
    labels?: string[]
    values?: number[]
}

export default function RadarChart({ labels, values }: RadarChartProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <RadarContainer style={{ minHeight: '400px' }}></RadarContainer>
    }

    if (!labels || !values) {
        return <RadarContainer>No data available</RadarContainer>
    }

    // Transform data for Recharts
    const data = labels.map((label, index) => ({
        subject: label,
        value: values[index],
        fullMark: 100,
    }))

    return (
        <RadarContainer>
            <ResponsiveContainer width="100%" height={400} style={{ outline: 'none' }}>
                {/* @ts-ignore - Recharts type issue with TypeScript strict mode */}
                <RechartsRadar data={data}>
                    {/* @ts-ignore */}
                    <PolarGrid
                        stroke="rgb(57, 57, 57)"
                        strokeWidth={1}
                    />
                    {/* @ts-ignore */}
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#888', fontSize: 12, fontWeight: 500 }}
                    />
                    {/* @ts-ignore */}
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={false}
                    />
                    {/* @ts-ignore */}
                    <Radar
                        name="Proficiency"
                        dataKey="value"
                        stroke="#c4ff00"
                        fill="rgba(196, 255, 0, 0.25)"
                        fillOpacity={1}
                        strokeWidth={2}
                        dot={{
                            r: 5,
                            fill: '#c4ff00',
                            stroke: 'rgb(28, 28, 28)',
                            strokeWidth: 2,
                        }}
                        animationDuration={1000}
                        animationEasing="ease-out"
                    />
                </RechartsRadar>
            </ResponsiveContainer>
        </RadarContainer>
    )
}
