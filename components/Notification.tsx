'use client'
import { roboto_mono } from '@/fonts/fonts'
import { StyledBox } from '@/styles/styled-components/Notification.styled'
import { NotificationType } from '@/types/types'
import { MdMarkEmailRead } from 'react-icons/md'
import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

export default function Notification({ message }: NotificationType) {
    const conatiner = useRef<HTMLDivElement>(null)
    const tl = useRef<GSAPTimeline>()
    useEffect(() => {
        let ctx = gsap.context(() => {
            tl.current = gsap
                .timeline()
                .from('.notification', {
                    yPercent: -50,
                    opacity: 0,
                    duration: 0.5,
                })
                .to('.notification', {
                    yPercent: -50,
                    opacity: 0,
                    duration: 0.5,
                    delay: 2,
                })
                .to('.notification-box', {
                    opacity: 0,
                    duration: 0.5,
                })
        }, conatiner)

        return () => ctx.revert()
    }, [])
    return (
        <StyledBox ref={conatiner} className='notification-box'>
            <small
                className={`${roboto_mono.variable} notification`}
            >
                <MdMarkEmailRead className="icon" />
                {message}
            </small>
        </StyledBox>
    )
}
