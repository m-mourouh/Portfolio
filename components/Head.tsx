'use client'
import { StyledSelection } from '@/styles/styled-components/Head.styled'
import data from '@/data/user.json'
import profilesData from '@/data/profiles.json'
import { StyledButton } from '@/styles/styled-components/Button.styled'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import GalaxyEffect from './GalaxyEffect'
import { Link } from 'react-scroll'
import Image from 'next/image'
import ProfilePic from '@/public/images/mohamed_mourouh.png'

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

    const scrollDown = () => {
        const aboutSection = document.getElementById('about')
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <StyledSelection ref={container} id='head'>
            <GalaxyEffect />
            <div className="wrapper">
                <div className="status animate">
                    <div className="status-image">
                        <Image
                            src={ProfilePic}
                            alt={data.user.name}
                            width={60}
                            height={60}
                            className="profile-pic"
                        />
                    </div>
                    <div className="status-text">
                        <span className="status-dot"></span>
                        AVAILABLE FOR WORK
                    </div>
                </div>
                <h1 className="animate">
                    {data.user.name} Is An Experienced Software Engineer Who{' '}
                    <span className="secondary-text">Creates High-Performing & Beautiful Websites.</span>
                </h1>
                <div className="buttons-wrapper animate">
                    <StyledButton
                        as="a"
                        href={profilesData.data.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        primary
                    >
                        Hire Me
                    </StyledButton>
                    <StyledButton
                        as="button"
                        onClick={scrollDown}
                        outline
                    >
                        Scroll Down ↓
                    </StyledButton>
                </div>
            </div>
        </StyledSelection>
    )
}
