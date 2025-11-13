'use client'
import { StyledAbout } from '@/styles/styled-components/About.styled'
import data from '@/data/user.json'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
    const currentYear = new Date().getFullYear()
    const yearsOfExperience = currentYear - data.user.startedAt

    const [projectsCount, setProjectsCount] = useState(0)
    const [experienceCount, setExperienceCount] = useState(0)
    const [satisfactionCount, setSatisfactionCount] = useState(0)

    const sectionRef = useRef<HTMLDivElement>(null)
    const headingRef = useRef<HTMLHeadingElement>(null)
    const signatureRef = useRef<HTMLDivElement>(null)
    const statsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const section = sectionRef.current
        const heading = headingRef.current
        const signature = signatureRef.current
        const stats = statsRef.current

        if (!section || !heading || !signature || !stats) return

        // Fade in animation from right to left
        gsap.fromTo(
            heading,
            { opacity: 0, x: 100 },
            {
                opacity: 1,
                x: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    once: true,
                },
            }
        )

        // Signature drawing animation (like Loader)
        const signaturePath = signature?.querySelector('.signature-path') as SVGPathElement

        if (signaturePath) {
            const pathLength = signaturePath.getTotalLength()

            gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    once: true,
                },
            })
            .set(signaturePath, {
                strokeDasharray: pathLength,
            })
            .fromTo(
                signaturePath,
                {
                    strokeDashoffset: pathLength,
                    stroke: '#888888',
                    opacity: 0.5,
                },
                {
                    duration: 2,
                    strokeDashoffset: 0,
                    delay: 0.3,
                }
            )
            .to(signaturePath, {
                duration: 1,
                stroke: 'rgba(136, 136, 136, 0)',
                fill: '#888888',
                opacity: 0.5,
                ease: 'Expo.easeOut',
            })
        }

        // Stats counting animation
        ScrollTrigger.create({
            trigger: stats,
            start: 'top 80%',
            onEnter: () => {
                // Animate projects count
                gsap.to({ val: 0 }, {
                    val: 35,
                    duration: 2,
                    ease: 'power1.out',
                    onUpdate: function() {
                        setProjectsCount(Math.round(this.targets()[0].val))
                    }
                })

                // Animate experience count
                gsap.to({ val: 0 }, {
                    val: yearsOfExperience,
                    duration: 2,
                    ease: 'power1.out',
                    onUpdate: function() {
                        setExperienceCount(Math.round(this.targets()[0].val))
                    }
                })

                // Animate satisfaction count
                gsap.to({ val: 0 }, {
                    val: 100,
                    duration: 2,
                    ease: 'power1.out',
                    onUpdate: function() {
                        setSatisfactionCount(Math.round(this.targets()[0].val))
                    }
                })
            },
            once: true,
        })

        gsap.fromTo(
            stats.children,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: stats,
                    start: 'top 80%',
                    once: true,
                },
            }
        )

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        }
    }, [yearsOfExperience])

    return (
        <StyledAbout className="about" id="about" ref={sectionRef}>
            <div className="about__content">
                <h1 ref={headingRef}>
                    I&apos;m a passionate software engineer based in Morocco. I build creative web apps that are both visually stunning and user-friendly. I&apos;m committed to delivering high-quality solutions that exceed expectations.{' '}
                    <span className="gray-text">
                        With a focus on innovation and problem-solving, I&apos;m dedicated to helping businesses and individuals achieve their digital goals.
                    </span>
                </h1>

                <div title='MOHAMED MOUROUH' className="signature" ref={signatureRef}>
                    <svg
                        version="1.0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="150"
                        height="70"
                        viewBox="0 0 108.000000 53.000000"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <g transform="translate(0.000000,53.000000) scale(0.100000,-0.100000)">
                            <path
                                className="signature-path"
                                d="M560 469 c-186 -16 -386 -84 -446 -150 -40 -44 -13 -118 56 -154 32
                                -17 167 -45 215 -45 34 0 35 -1 29 -28 -10 -42 -10 -44 3 -49 6 -2 14 13 18
                                38 l7 42 139 -6 c76 -3 141 -2 144 3 9 15 -27 20 -151 20 -136 0 -143 4 -103
                                54 24 31 36 32 69 6 44 -34 79 -24 94 28 10 31 -12 29 -24 -3 -11 -30 -24 -31
                                -57 -5 -38 29 -74 26 -106 -11 -15 -17 -27 -40 -27 -50 0 -23 -16 -24 -121 -5
                                -146 26 -205 78 -169 147 24 44 215 114 382 140 76 11 304 7 361 -6 17 -5 27
                                -3 27 3 0 27 -191 45 -340 31z"
                                fill="none"
                                stroke="#888888"
                                strokeWidth="2"
                                opacity="0.5"
                            />
                        </g>
                    </svg>
                </div>

                <div className="stats" ref={statsRef}>
                    <div className="stat-item">
                        <div className="stat-number">
                            {projectsCount}<span className="accent">+</span>
                        </div>
                        <div className="stat-label">PROJECTS DONE</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">
                            {experienceCount}<span className="accent">+</span>
                        </div>
                        <div className="stat-label">YEARS OF EXPERIENCE</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">
                            {satisfactionCount}<span className="accent">%</span>
                        </div>
                        <div className="stat-label">CLIENT SATISFACTION</div>
                    </div>
                </div>
            </div>
        </StyledAbout>
    )
}
