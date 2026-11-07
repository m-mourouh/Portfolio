'use client'
import { StyledSelection } from '@/styles/styled-components/Head.styled'
import data from '@/data/user.json'
import { StyledButton } from '@/styles/styled-components/Button.styled'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import HeroGrid3D from './HeroGrid3D'
import { Link } from 'react-scroll'
import Image from 'next/image'
import ProfilePic from '@/public/images/mohamed_mourouh.jpeg'
import { useLanguage } from '@/contexts/LanguageContext'
import { openContactDrawer } from '@/lib/contactDrawer'

export default function Head() {
    const { t } = useLanguage()
    const container = useRef<HTMLDivElement>(null)
    const tl = useRef<GSAPTimeline | null>(null)

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
                    delay: 1.9,
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
            <HeroGrid3D />
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
                        {t('hero.available').toUpperCase()}
                    </div>
                </div>
                <h1 className="animate" dangerouslySetInnerHTML={{ __html: t('hero.subtitle') }} />
                <div className="buttons-wrapper animate">
                    <StyledButton
                        as="button"
                        onClick={openContactDrawer}
                        aria-haspopup="dialog"
                        $primary
                    >
                        {t('hero.viewWork')}
                    </StyledButton>
                    <StyledButton
                        as="button"
                        onClick={scrollDown}
                        $outline
                    >
                        {t('hero.contactMe')}
                    </StyledButton>
                </div>
            </div>
        </StyledSelection>
    )
}
