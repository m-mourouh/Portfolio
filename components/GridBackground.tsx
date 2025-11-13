'use client'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

const GridContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
`

const GridCanvas = styled.canvas`
    width: 100%;
    height: 100%;
`

export default function GridBackground() {
    const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null)

    useEffect(() => {
        if (!canvasRef) return

        const canvas = canvasRef
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size to match display size
        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        ctx.scale(dpr, dpr)

        const squareSize = 50
        const cols = Math.ceil(rect.width / squareSize)
        const rows = Math.ceil(rect.height / squareSize)

        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
        ctx.lineWidth = 1

        for (let i = 0; i <= cols; i++) {
            ctx.beginPath()
            ctx.moveTo(i * squareSize, 0)
            ctx.lineTo(i * squareSize, rect.height)
            ctx.stroke()
        }

        for (let i = 0; i <= rows; i++) {
            ctx.beginPath()
            ctx.moveTo(0, i * squareSize)
            ctx.lineTo(rect.width, i * squareSize)
            ctx.stroke()
        }

        // Fill random squares
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'
        const fillProbability = 0.05 // 5% of squares will be filled

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (Math.random() < fillProbability) {
                    ctx.fillRect(
                        col * squareSize,
                        row * squareSize,
                        squareSize,
                        squareSize
                    )
                }
            }
        }

        // Handle window resize
        const handleResize = () => {
            const rect = canvas.getBoundingClientRect()
            canvas.width = rect.width * dpr
            canvas.height = rect.height * dpr
            ctx.scale(dpr, dpr)

            // Redraw everything
            const cols = Math.ceil(rect.width / squareSize)
            const rows = Math.ceil(rect.height / squareSize)

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
            ctx.lineWidth = 1

            for (let i = 0; i <= cols; i++) {
                ctx.beginPath()
                ctx.moveTo(i * squareSize, 0)
                ctx.lineTo(i * squareSize, rect.height)
                ctx.stroke()
            }

            for (let i = 0; i <= rows; i++) {
                ctx.beginPath()
                ctx.moveTo(0, i * squareSize)
                ctx.lineTo(rect.width, i * squareSize)
                ctx.stroke()
            }

            ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    if (Math.random() < fillProbability) {
                        ctx.fillRect(
                            col * squareSize,
                            row * squareSize,
                            squareSize,
                            squareSize
                        )
                    }
                }
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [canvasRef])

    return (
        <GridContainer>
            <GridCanvas ref={setCanvasRef} />
        </GridContainer>
    )
}
