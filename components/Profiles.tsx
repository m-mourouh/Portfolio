'use client'
import { StyledDiv } from '@/styles/styled-components/Profiles.styled'
import profilesData from '@/data/profiles.json'
import Link from 'next/link'
import { TbBrandGithub } from 'react-icons/tb'
import { FaLinkedinIn, FaDev, FaFacebook } from 'react-icons/fa'
import { BsInstagram } from 'react-icons/bs'
import { RiTwitterXLine } from "react-icons/ri";
import { AiOutlineYoutube } from 'react-icons/ai'
import { roboto_mono } from '@/fonts/fonts'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
export default function SocialMedia({ option }: { option: boolean }) {
    // hooks
    const conatiner = useRef<HTMLDivElement>(null)
    const tl = useRef<GSAPTimeline>()
    useEffect(() => {
        const mediaIcons = document.querySelectorAll('.media')
        let ctx = gsap.context(() => {
            tl.current = gsap
                .timeline()
                .from(mediaIcons, {
                    opacity: 0,
                    y: -100,
                    delay: 2.5,
                })
                .to(mediaIcons, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    ease: 'Slow.ease',
                })
        }, conatiner)

        return () => ctx.revert()
    }, [])
    return (
        <StyledDiv ref={conatiner}>
            {option ? (
                <div className="icons">
                    <Link
                        href={profilesData.data.github}
                        className="icon"
                        target="_blank"
                    >
                        <TbBrandGithub />
                    </Link>
                    <Link
                        href={profilesData.data.linkedin}
                        className="icon"
                        target="_blank"
                    >
                        <FaLinkedinIn />
                    </Link>
                    <Link
                        href={profilesData.data.instagram}
                        className="icon"
                        target="_blank"
                    >
                        <BsInstagram />
                    </Link>
                    <Link
                        href={profilesData.data.x}
                        className="icon"
                        target="_blank"
                    >
                        <RiTwitterXLine />
                    </Link>
                    <Link
                        href={profilesData.data.facebook}
                        className="icon"
                        target="_blank"
                    >
                        <FaFacebook />
                    </Link>

                    <Link
                        href={profilesData.data.devto}
                        className="icon"
                        target="_blank"
                    >
                        <FaDev />
                    </Link>
                    <Link
                        href={profilesData.data.youtube}
                        className="icon"
                        target="_blank"
                    >
                        <AiOutlineYoutube />
                    </Link>
                </div>
            ) : (
                <div className={`links ${roboto_mono.variable} `}>
                    <Link
                        href={profilesData.data.linkedin}
                        className="icon media"
                        target="_blank"
                    >
                        Li
                        <span className="tooltiptext">LinkedIn</span>
                    </Link>
                    <Link
                        href={profilesData.data.instagram}
                        className="icon media"
                        target="_blank"
                    >
                        In
                        <span className="tooltiptext">Instagram</span>
                    </Link>
                    <Link
                        href={profilesData.data.x}
                        className="icon media"
                        target="_blank"
                    >
                        X
                        <span className="tooltiptext">X</span>
                    </Link>
                    <Link
                        href={profilesData.data.facebook}
                        className="icon media"
                        target="_blank"
                    >
                        FB
                        <span className="tooltiptext">Facebook</span>
                    </Link>
                    <Link
                        href={profilesData.data.github}
                        className="icon media"
                        target="_blank"
                    >
                        Gi
                        <span className="tooltiptext">Github</span>
                    </Link>
                    <Link
                        href={profilesData.data.devto}
                        className="icon media"
                        target="_blank"
                    >
                        De
                        <span className="tooltiptext">DevTo</span>
                    </Link>
                    <Link
                        href={profilesData.data.youtube}
                        className="icon media"
                        target="_blank"
                    >
                        Yo
                        <span className="tooltiptext">Youtube</span>
                    </Link>
                </div>
            )}
        </StyledDiv>
    )
}
