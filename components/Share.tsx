'use client'

import data from '@/data/properties.json'
import { StyledDiv } from '@/styles/styled-components/Share.styled'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { IoMdHeart } from 'react-icons/io'
import { FaFacebook, FaLinkedinIn } from 'react-icons/fa'
import { SlSocialTwitter } from 'react-icons/sl'
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
} from 'next-share'

import { roboto_mono } from '@/fonts/fonts'
import { gsap } from 'gsap'
export default function Share({ orientation }: { orientation: string }) {
    const [toggle, setToggle] = useState(false)
    const conatiner = useRef<HTMLDivElement>(null)
    const tl = useRef<GSAPTimeline>()
    useEffect(() => {
        let ctx = gsap.context(() => {
            if (toggle) {
                tl.current = gsap
                    .timeline()
                    .from('.share-icon', {
                        opacity: 0,
                        x: -100,
                        duration: 0.1,
                        delay: 0,
                    })
                    .to('.share-icon', {
                        opacity: 1,
                        x: 0,
                        stagger: 0.1,
                        duration: 0.1,
                        ease: 'bounce.easeOut',
                        delay: 0,
                    })
            } else {
                tl.current = gsap.timeline().to('.share-icon', {
                    opacity: 0,
                    xPercent: -100,
                    duration: 0.1,
                    stagger: 0.1,
                    delay: 0,
                })
            }
        }, conatiner)

        return () => ctx.revert()
    }, [toggle])

    useEffect(() => {
        let ctx = gsap.context(() => {
            tl.current = gsap
                .timeline()
                .from('.share-block', {
                    opacity: 0,
                    yPercent: 100,
                    delay: 3.4,
                    ease: 'Slow.ease',
                })
                .to('.share-block', {
                    opacity: 1,
                    yPercent: 0,
                })
        }, conatiner)

        return () => ctx.revert()
    }, [])
    // functions
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        setToggle((prevState) => !prevState)
    }
    const handleBlur = (e: React.FocusEvent) => {
        e.preventDefault()
        setToggle(false)
    }
    return (
        <div ref={conatiner}>
            <StyledDiv
                className={roboto_mono.variable + ' share-block ' + orientation}
            >
                <Link
                    href=""
                    className="shareBtn"
                    onClick={(e) => handleClick(e)}
                    onBlur={(e) => handleBlur(e)}
                >
                    <p>{data.shareButtonText}</p>
                    <IoMdHeart className="icon" />
                </Link>
                <div className="platforms">
                    <ul>
                        <li>
                            <LinkedinShareButton
                                url={
                                    process.env.NEXT_PUBLIC_APP_URL?.toString()!
                                }
                                windowWidth={800}
                                windowHeight={700}
                            >
                                <Link href={''} className="icon share-icon">
                                    <FaLinkedinIn />
                                </Link>
                            </LinkedinShareButton>
                        </li>
                        <li>
                            <TwitterShareButton
                                url={
                                    process.env.NEXT_PUBLIC_APP_URL?.toString()!
                                }
                                windowWidth={800}
                                windowHeight={700}
                                title={"Mohamed Mourouh's Portfolio: "}
                                hashtags={['portfolio', 'Mohamed_Mourouh']}
                            >
                                <Link href={''} className="icon share-icon">
                                    <SlSocialTwitter />
                                </Link>
                            </TwitterShareButton>
                        </li>
                        <li>
                            <FacebookShareButton
                                url={
                                    process.env.NEXT_PUBLIC_APP_URL?.toString()!
                                }
                                quote={'Mohamed Mourouh portfolio'}
                                windowWidth={800}
                                windowHeight={700}
                                title={"Mohamed Mourouh's Portfolio: "}
                                hashtag={'#Portfolio'}
                            >
                                <Link href={''} className="icon share-icon">
                                    <FaFacebook />
                                </Link>
                            </FacebookShareButton>
                        </li>
                    </ul>
                </div>
            </StyledDiv>
        </div>
    )
}
