'use client'
import { StyledDiv } from '@/styles/styled-components/Cursor.styled'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
export default function Cursor() {
    const conatiner = useRef<HTMLDivElement>(null)
    const tl = useRef<GSAPTimeline>()

    useEffect(() => {
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

        window.document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX
            mouseY = e.clientY
        })
        // 
        
        return () => ctx.revert()
    }, [])

    return (
        <StyledDiv ref={conatiner}>
            <div className="cursor"></div>
            <div className="cursor-follower"></div>
        </StyledDiv>
    )
}
