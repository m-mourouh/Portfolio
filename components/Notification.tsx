'use client'
import { StyledBox } from '@/styles/styled-components/Notification.styled'
import { NotificationType } from '@/types/types'
import { MdMarkEmailRead } from 'react-icons/md'
import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

export default function Notification({ message }: NotificationType) {
    const container = useRef<HTMLDivElement>(null)
    const tl = useRef<GSAPTimeline | null>(null)

    useEffect(() => {
        let ctx = gsap.context(() => {
            tl.current = gsap
                .timeline()
                .from('.notification', {
                    y: -100,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power3.out',
                })
                .to('.notification', {
                    y: -100,
                    opacity: 0,
                    duration: 0.4,
                    delay: 2.5,
                    ease: 'power3.in',
                })
                .to('.notification-box', {
                    opacity: 0,
                    duration: 0.2,
                })
        }, container)

        return () => ctx.revert()
    }, [])

    return (
        <StyledBox ref={container} className='notification-box'>
            <div className='notification'>
                <MdMarkEmailRead className="icon" />
                <span>{message}</span>
            </div>
        </StyledBox>
    )
}
