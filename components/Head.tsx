'use client'
import { StyledSelection } from '@/styles/styled-components/Head.styled'
import data from '@/data/user.json'
import profilesData from '@/data/profiles.json'
import { StyledButton } from '@/styles/styled-components/Button.styled'
import { fira_code, roboto, roboto_mono } from '@/fonts/fonts'
import parse from 'html-react-parser'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
export default function Head() {
    const container = useRef<HTMLDivElement>(null)
    const tl = useRef<GSAPTimeline>()
    useEffect(() => {
        const block = document.querySelectorAll('.animate')
        let ctx = gsap.context(() => {
            tl.current = gsap
                .timeline({
                    ease: 'Expo.out',
                })
                .from(block, {
                    opacity: 0,
                    stagger: 0.1,
                    y: 10,

                    delay: 3,
                })
                .to(block, {
                    y: 0,
                    opacity: 1,
                })
    
        }, container)

        return () => ctx.revert()
    }, [])
    return (
        <StyledSelection ref={container} id='head'>
            <div className="bg"></div>
            <div className="wrapper">
                <p className={fira_code.variable + ' animate'}>
                    {data.user['intro-text']}
                </p>
                <h1 className={roboto.variable + ' animate'}>
                    <span>{data.user.name.split(' ')[0]} </span>
                    <span>{data.user.name.split(' ')[1]}</span>.
                </h1>
                <h5 className={roboto.variable + ' animate'}>
                    {parse(data.user.subtitle)}
                </h5>
                <p className={roboto_mono.variable + ' animate'}>
                    {parse(data.user.description)}
                </p>
                <StyledButton
                    className={fira_code.variable + ' animate'}
                    as="a"
                    href={profilesData.data.linkedin}
                    target="_blank"
                    width={180}
                >
                    Hire me
                </StyledButton>
            </div>
        </StyledSelection>
    )
}
