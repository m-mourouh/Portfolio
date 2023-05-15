'use client'
import React, { useRef, useState, useEffect } from 'react'
import { roboto, fira_code, roboto_mono } from '@/fonts/fonts'
import data from '@/data/data.json'
import { StyledSkills } from '@/styles/styled-components/Skills.styled'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Mousewheel } from 'swiper'
import { splitArray } from '@/lib/functions'
import { useMediaQuery } from 'react-responsive'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper'
export default function Skills() {
    const [fields, setFields] = useState(data.user.fields)
    const [selectedFieldID, setselectedFieldID] = useState(0)
    const [slides, setSlides] = useState(3)
    const [skills, setSkills] = useState(
        splitArray<string>(data.user.skills[0], slides)
    ) //Default values
    const isTablet = useMediaQuery({ query: '(max-width: 640px)' })
    const isDesktop = useMediaQuery({ query: '(min-width: 650px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 440px)' })
    useEffect(() => {
        console.log(isTablet)
        if (isTablet) {
            setSlides(2)
        }
        if (isDesktop) {
            setSlides(3)
        }
        if (isMobile) {
            setSlides(1)
        }
         setSkills(splitArray<string>(data.user.skills[selectedFieldID], slides))
    }, [isDesktop, isMobile, isTablet, selectedFieldID, slides])

    const activate = (
        e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
        idx: number
    ) => {
        setFields((prevFields) =>
            prevFields.map((field, id) =>
                id !== idx ? { ...field, on: false } : { ...field, on: true }
            )
        )
        setselectedFieldID(idx)
        setSkills(splitArray<string>(data.user.skills[idx], slides))
    }

    return (
        <StyledSkills id="skills">
            <h1 className={roboto.variable}>My Skills.</h1>

            <div className="inner-wrapper">
                <div className="fields">
                    <Swiper
                        direction={'horizontal'}
                        breakpoints={{
                            // when window width is >= 640px
                            976: {
                                direction: 'vertical',
                                slidesPerView: 6
                            },
                            640: {
                                direction: 'horizontal',
                                slidesPerView: 4
                            },
                            510: {
                                slidesPerView: 3
                            },
                            300: {
                                slidesPerView: 2
                            },
                            100: {
                                slidesPerView: 1
                            },
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        mousewheel={true}
                        spaceBetween={20}
                        slidesPerView={3}
                        modules={[Mousewheel]}
                        className={`${roboto_mono.variable} mySwiper2`}
                    >
                        {fields.map((f, idx) => (
                            <SwiperSlide
                                onClick={(e) => activate(e, idx)}
                                className={`field ${roboto_mono.variable} ${
                                    f.on && 'active'
                                }`}
                                key={idx}
                            >
                                {f.title}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <Swiper
                    direction={'vertical'}
                    pagination={{
                        clickable: true,
                    }}
                    mousewheel={true}
                    spaceBetween={20}
                    slidesPerView={3}
                    modules={[Pagination, Mousewheel]}
                    className={`${roboto_mono.variable} mySwiper`}
                >
                    {skills.map((grp, idx) => (
                        <SwiperSlide key={idx}>
                            {grp.map((sk, id) => (
                                <div className="skill" key={id}>
                                    <p>
                                        {sk.split('.')[0]}
                                        {sk.split('.')[1] && (
                                            <span className="extension">
                                                {'.' + sk.split('.')[1]}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            ))}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* <div className="skills">
                {blocks.map((block, idx) => (
                    <>
                        <h6 className={roboto_mono.variable}>{block}:</h6>
                        <div className="technologies">
                            {data.user.skills[idx].map((skill, idx) => (
                                <span
                                    className={roboto_mono.variable}
                                    key={idx}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </>
                ))}
            </div> */}
        </StyledSkills>
    )
}
