'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { StyledAbout } from '@/styles/styled-components/About.styled'
import data from '@/data/user.json'
import { useLanguage } from '@/contexts/LanguageContext'
import SectionIndex from './SectionIndex'
import { counts } from '@/lib/expertise'
import AboutIntro from './about/AboutIntro'
import CareerPath from './about/CareerPath'
import Portrait from '@/public/images/mohamed_mourouh.jpeg'

/**
 * About: asymmetric editorial layout. Portrait (real photo, duotone, technical frame) beside the
 * headline and an interactive paragraph; then the career as a system path and a facts strip.
 * Every figure is computed from the repo's data.
 */
export default function About() {
    const { t, language } = useLanguage()
    const lang = (['en', 'fr', 'ar'].includes(language) ? language : 'en') as 'en' | 'fr' | 'ar'

    // facts, computed from data (no hard-coded numbers)
    const years = new Date().getFullYear() - data.user.startedAt
    const technologyCount = counts.technologies
    const certificationCount = counts.certifications

    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const section = sectionRef.current
        if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        gsap.registerPlugin(ScrollTrigger)
        const ctx = gsap.context(() => {
            const ease = 'expo.out' // same easing as the hero entrance
            // portrait: mask reveal from the bottom, the image settles inside it
            gsap.fromTo('.portrait-frame', { clipPath: 'inset(100% 0% 0% 0%)' }, {
                clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease,
                scrollTrigger: { trigger: '.portrait', start: 'top 80%', once: true },
            })
            gsap.fromTo('.portrait-frame img', { scale: 1.15 }, {
                scale: 1, duration: 1.8, ease,
                scrollTrigger: { trigger: '.portrait', start: 'top 80%', once: true },
            })
            // staggered text reveal
            gsap.fromTo('.about__text > *', { y: 28, opacity: 0 }, {
                y: 0, opacity: 1, duration: 1.1, ease, stagger: 0.09,
                scrollTrigger: { trigger: '.about__text', start: 'top 80%', once: true },
            })
            gsap.fromTo('.facts li', { y: 12, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.8, ease, stagger: 0.06,
                scrollTrigger: { trigger: '.facts', start: 'top 92%', once: true },
            })
        }, section)
        return () => ctx.revert()
    }, [])

    return (
        <StyledAbout className="about" id="about" ref={sectionRef}>
            <div className="about__grid">
                <figure className="portrait">
                    <div className="portrait-frame">
                        <Image
                            src={Portrait}
                            alt={t('about.portraitAlt')}
                            fill
                            sizes="(max-width: 768px) 92vw, (max-width: 1280px) 40vw, 520px"
                            placeholder="blur"
                            quality={70}
                        />
                        <span className="tint" aria-hidden="true" />
                        <span className="grid" aria-hidden="true" />
                        <span className="corner tl" aria-hidden="true" />
                        <span className="corner tr" aria-hidden="true" />
                        <span className="corner bl" aria-hidden="true" />
                        <span className="corner br" aria-hidden="true" />
                    </div>
                    <figcaption>CASABLANCA · 33.57°N 7.59°W</figcaption>
                </figure>

                <div className="about__text">
                    <SectionIndex n={1} label={t('nav.about')} />
                    <h2 className="about__heading" dangerouslySetInnerHTML={{ __html: t('about.heading') }} />
                    <AboutIntro
                        html={t('about.introduction')}
                        lang={lang}
                        t={t}
                        labels={{ open: t('about.terms.open'), expertise: t('about.terms.expertise'), usedIn: t('about.terms.usedIn'), close: t('about.terms.close') }}
                    />
                </div>
            </div>

            <CareerPath lang={lang} labels={{ title: t('about.career.title'), present: t('about.career.present'), list: t('about.career.list') }} />

            <div className="about__foot">
                <ul className="facts" aria-label={t('about.facts.label')}>
                    <li>
                        {years}+ {t('about.facts.years')}
                    </li>
                    <li>Java / Spring Boot</li>
                    <li>React / Angular / Vue</li>
                    <li>
                        {certificationCount} {t('about.facts.certs')}
                    </li>
                    <li>
                        {technologyCount} {t('about.facts.techs')}
                    </li>
                </ul>
            </div>
        </StyledAbout>
    )
}
