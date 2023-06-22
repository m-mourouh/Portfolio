'use client'
import React, { useState, useEffect } from 'react'
import { roboto, roboto_mono } from '@/fonts/fonts'
import skillsData from '@/data/skills.json'
import fieldsData from '@/data/fields.json'
import { StyledSkills } from '@/styles/styled-components/Skills.styled'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Mousewheel } from 'swiper'
import { splitArray } from '@/lib/helpers'
import { useMediaQuery } from 'react-responsive'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper'

export default function Skills() {
    const [fields, setFields] = useState(fieldsData.data)
    const [selectedFieldID, setselectedFieldID] = useState(0)
    const [slides, setSlides] = useState(4)
    const [skills, setSkills] = useState(
        splitArray<string>(skillsData.data[0], slides)
    ) //Default values
    const isTablet = useMediaQuery({ query: '(max-width: 640px)' })
    const isDesktop = useMediaQuery({ query: '(min-width: 650px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 440px)' })
    useEffect(() => {
        if (isDesktop) {
            setSlides(4)
        }
        if (isTablet) {
            setSlides(3)
        }
        if (isMobile) {
            setSlides(3)
        }
        setSkills(splitArray<string>(skillsData.data[selectedFieldID], slides))
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
        setSkills(splitArray<string>(skillsData.data[idx], slides))
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
                                slidesPerView: 6,
                            },
                            640: {
                                direction: 'horizontal',
                                slidesPerView: 4,
                            },
                            510: {
                                slidesPerView: 3,
                            },
                            300: {
                                slidesPerView: 2,
                            },
                            100: {
                                slidesPerView: 1,
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
                    breakpoints={{
                        // when window width is >= 640px
                        100: {
                            direction: 'horizontal',
                            slidesPerView: 2,
                        },
                        534: {
                            direction: 'horizontal',
                            slidesPerView: 3,
                        },
                        761: {
                            direction: 'vertical',
                            slidesPerView: 4,
                        },
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    mousewheel={true}
                    spaceBetween={20}
                    slidesPerView={4}
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
        </StyledSkills>
    )
}
