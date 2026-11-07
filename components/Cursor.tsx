'use client'
import { StyledDiv } from '@/styles/styled-components/Cursor.styled'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
export default function Cursor() {
    const conatiner = useRef<HTMLDivElement>(null)
    const tl = useRef<GSAPTimeline | null>(null)

    useEffect(() => {
        // touch / coarse pointers: no custom cursor at all
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
        let cursor = document.querySelector('.cursor')
        let follower = document.querySelector('.cursor-follower')
        let posX = 0,
            posY = 0

        let mouseX = 0,
            mouseY = 0

        let ctx = gsap.context(() => {
            tl.current = gsap.timeline().to({}, 0.016, {
                repeat: -1,
                onRepeat: function () {
                    posX += (mouseX - posX) / 9
                    posY += (mouseY - posY) / 9

                    gsap.set(follower, {
                        css: {
                            left: posX - 12,
                            top: posY - 12,
                        },
                    })

                    gsap.set(cursor, {
                        css: {
                            left: mouseX,
                            top: mouseY,
                        },
                    })
                },
            })
        }, conatiner)

        const onMove = (e: MouseEvent) => {
            mouseX = e.clientX
            mouseY = e.clientY
        }
        // Feedback: the ring grows (lime) over interactive things, steps aside over text fields
        const root = conatiner.current
        const onOver = (e: MouseEvent) => {
            const el = e.target as Element | null
            const field = !!el?.closest('input, textarea, select, [contenteditable="true"]')
            const interactive = !field && !!el?.closest('a, button, [role="button"], label, .project-card, .article-card, .row')
            root?.classList.toggle('is-hover', interactive)
            root?.classList.toggle('is-field', field)
        }
        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseover', onOver)

        return () => {
            document.removeEventListener('mousemove', onMove)
            document.removeEventListener('mouseover', onOver)
            ctx.revert()
        }
    }, [])

    return (
        <StyledDiv ref={conatiner}>
            <div className="cursor"></div>
            <div className="cursor-follower"></div>
        </StyledDiv>
    )
}
