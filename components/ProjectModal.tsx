'use client'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { gsap } from 'gsap'
import { useTranslation } from 'react-i18next'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Keyboard, A11y } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { IoClose } from 'react-icons/io5'
import { HiOutlineExternalLink } from 'react-icons/hi'
import { VscGithubAlt } from 'react-icons/vsc'
import Modal from './ui/Modal'
import { StyledButton } from '@/styles/styled-components/Button.styled'
import { device } from '@/styles/styled-components/Breakpoints'
import { useLanguage } from '@/contexts/LanguageContext'
import { getProjectKey } from './ProjectCard'

export type ModalProject = {
    name: string
    stack: string[]
    links: { github: string; website: string }
    image: string
    gallery?: string[]
}

type Props = {
    project: ModalProject
    /** The card image the popup grows out of (and shrinks back into). */
    originEl: HTMLElement | null
    onClose: () => void
}

const loadImage = (file: string) => require(`../public/images/${file || 'default-image.jpg'}`)

// Shared-element transition: a temporary copy of the image ("flyer") animates its real
// position and size between the card and the popup. Unlike scaling, this never stretches
// the picture, and object-fit: cover crops it exactly like the card does, so it lands seamlessly.
const createFlyer = (src: string, rect: DOMRect, radius: string) => {
    const flyer = document.createElement('div')
    Object.assign(flyer.style, {
        position: 'fixed',
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        borderRadius: radius,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: '100000000', // same layer as the popup, appended after it so it's on top
        background: 'rgb(20, 20, 20)',
    })
    const img = document.createElement('img')
    img.src = src
    img.alt = ''
    Object.assign(img.style, { width: '100%', height: '100%', objectFit: 'cover', display: 'block' })
    flyer.appendChild(img)
    document.body.appendChild(flyer)
    return flyer
}

const boxOf = (rect: DOMRect) => ({ left: rect.left, top: rect.top, width: rect.width, height: rect.height })

// Card image only has rounded top corners (the card clips it)
const cardImageRadius = (cardImage: HTMLElement) => {
    const r = getComputedStyle(cardImage.closest('.project-card') || cardImage).borderTopLeftRadius
    return `${r} ${r} 0 0`
}

const imageSrc = (container: Element | null) => {
    const img =
        container?.querySelector<HTMLImageElement>('.swiper-slide-active img') ||
        container?.querySelector<HTMLImageElement>('img')
    return img?.currentSrc || img?.src || ''
}

export default function ProjectModal({ project, originEl, onClose }: Props) {
    const { t } = useLanguage()
    const { i18n } = useTranslation()
    const key = getProjectKey(project.name)
    const images = project.gallery?.length ? project.gallery : [project.image]
    // Projects with only the placeholder image get a text-only popup
    const hasMedia = (project.gallery?.length ?? 0) > 0 || (!!project.image && project.image !== 'default-image.jpg')
    const role = i18n.exists(`projects.details.${key}.role`) ? t(`projects.details.${key}.role`) : null
    const highlights = i18n.exists(`projects.details.${key}.highlights`)
        ? (i18n.t(`projects.details.${key}.highlights`, { returnObjects: true }) as string[])
        : []

    // Remove any flyer left behind if an animation is interrupted (or on unmount)
    const flyers = useRef(new Set<HTMLElement>())
    useEffect(() => {
        const set = flyers.current
        return () => {
            set.forEach((f) => f.remove())
            set.clear()
        }
    }, [])
    const fly = (tl: gsap.core.Timeline, src: string, from: DOMRect, fromRadius: string, to: DOMRect, toRadius: string, vars: gsap.TweenVars, at: number) => {
        const flyer = createFlyer(src, from, fromRadius)
        flyers.current.add(flyer)
        tl.to(flyer, { ...boxOf(to), borderRadius: toRadius, ...vars }, at)
        tl.call(() => {
            flyer.remove()
            flyers.current.delete(flyer)
        })
    }

    const enter = (tl: gsap.core.Timeline, panel: HTMLElement) => {
        const media = panel.querySelector<HTMLElement>('.pm-media')
        const body = panel.querySelectorAll<HTMLElement>('.pm-reveal')
        const closeBtn = panel.querySelector<HTMLElement>('.pm-close')
        tl.fromTo(
            panel,
            { backgroundColor: 'rgba(24,24,24,0)', borderColor: 'rgba(45,45,45,0)' },
            { backgroundColor: 'rgba(24,24,24,1)', borderColor: 'rgba(45,45,45,1)', duration: 0.45 },
            0.15
        )
        const src = imageSrc(originEl)
        if (media && originEl && src) {
            // Popup image stays hidden until the flyer lands on it
            tl.set(media, { opacity: 0 }, 0)
            fly(
                tl,
                src,
                originEl.getBoundingClientRect(),
                cardImageRadius(originEl),
                media.getBoundingClientRect(),
                getComputedStyle(media).borderRadius,
                { duration: 0.7, ease: 'expo.out' },
                0
            )
            tl.set(media, { opacity: 1 }, 0.7)
        } else if (media) {
            tl.fromTo(media, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 }, 0)
        }
        tl.fromTo(
            body,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' },
            0.3
        )
        if (closeBtn) tl.fromTo(closeBtn, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, 0.45)
    }

    const exit = (tl: gsap.core.Timeline, panel: HTMLElement) => {
        const media = panel.querySelector<HTMLElement>('.pm-media')
        const body = panel.querySelectorAll<HTMLElement>('.pm-reveal')
        const closeBtn = panel.querySelector<HTMLElement>('.pm-close')
        // Hide the close button immediately so it doesn't linger while the image flies back
        if (closeBtn) tl.to(closeBtn, { opacity: 0, scale: 0.8, duration: 0.12, ease: 'power2.in' }, 0)
        tl.to(body, { opacity: 0, y: 12, duration: 0.2, ease: 'power2.in' }, 0)
        // Only fly back if the card is still on screen
        const r = originEl?.getBoundingClientRect()
        const visible = r && r.bottom > 0 && r.top < window.innerHeight
        const src = imageSrc(media)
        if (media && originEl && visible && src) {
            tl.set(media, { opacity: 0 }, 0)
            tl.to(panel, { backgroundColor: 'rgba(24,24,24,0)', borderColor: 'rgba(45,45,45,0)', duration: 0.3 }, 0.05)
            fly(
                tl,
                src,
                media.getBoundingClientRect(),
                getComputedStyle(media).borderRadius,
                originEl.getBoundingClientRect(),
                cardImageRadius(originEl),
                { duration: 0.5, ease: 'power3.inOut' },
                0
            )
        } else {
            tl.to(panel, { opacity: 0, y: 30, duration: 0.3, ease: 'power2.in' }, 0)
        }
    }

    return (
        <Modal
            labelledBy="project-modal-title"
            onClose={onClose}
            enter={enter}
            exit={exit}
            customPanelAnimation
        >
            {(close) => (
                <Content>
                    <button
                        className="pm-close"
                        onClick={close}
                        aria-label={t('projects.close')}
                        data-autofocus
                    >
                        <IoClose />
                    </button>

                    {hasMedia && (
                    <div className="pm-media">
                        {images.length > 1 ? (
                            <Swiper
                                modules={[Navigation, Pagination, Keyboard, A11y]}
                                navigation
                                pagination={{ clickable: true }}
                                keyboard={{ enabled: true }}
                                loop
                            >
                                {images.map((img) => (
                                    <SwiperSlide key={img}>
                                        <div className="pm-image">
                                            <Image src={loadImage(img)} alt={project.name} fill sizes="(max-width: 960px) 100vw, 960px" />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="pm-image">
                                <Image src={loadImage(images[0])} alt={project.name} fill sizes="(max-width: 960px) 100vw, 960px" priority />
                            </div>
                        )}
                    </div>
                    )}

                    <div className={`pm-body${hasMedia ? '' : ' no-media'}`}>
                        <h2 id="project-modal-title" className="pm-reveal">
                            {project.name}
                        </h2>
                        <p className="pm-description pm-reveal">{t(`projects.descriptions.${key}`)}</p>

                        {role && (
                            <div className="pm-block pm-reveal">
                                <h3>{t('projects.role')}</h3>
                                <p>{role}</p>
                            </div>
                        )}

                        {highlights.length > 0 && (
                            <div className="pm-block pm-reveal">
                                <h3>{t('projects.highlights')}</h3>
                                <ul>
                                    {highlights.map((h) => (
                                        <li key={h}>{h}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="pm-block pm-reveal">
                            <h3>{t('projects.techStack')}</h3>
                            <div className="pm-tags">
                                {project.stack.map((tech) => (
                                    <span key={tech}>{tech}</span>
                                ))}
                            </div>
                        </div>

                        {(project.links.website || project.links.github) && (
                            <div className="pm-actions pm-reveal">
                                {project.links.website && (
                                    <StyledButton as="a" href={project.links.website} target="_blank" rel="noopener noreferrer" $primary>
                                        {t('projects.liveDemo')} <HiOutlineExternalLink />
                                    </StyledButton>
                                )}
                                {project.links.github && (
                                    <StyledButton as="a" href={project.links.github} target="_blank" rel="noopener noreferrer" $outline>
                                        <VscGithubAlt /> {t('projects.sourceCode')}
                                    </StyledButton>
                                )}
                            </div>
                        )}
                    </div>
                </Content>
            )}
        </Modal>
    )
}

const Content = styled.div`
    position: relative;

    .pm-close {
        position: absolute;
        top: 16px;
        right: 16px;
        z-index: 5;
        width: 44px;
        height: 44px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.15);
        background: rgba(20, 20, 20, 0.7);
        backdrop-filter: blur(6px);
        color: var(--white);
        font-size: 1.4rem;
        cursor: pointer;
        transition: background-color 0.2s ease, border-color 0.2s ease;

        &:hover,
        &:focus-visible {
            background: rgba(40, 40, 40, 0.9);
            border-color: #c4ff00;
            outline: none;
        }
    }

    .pm-media {
        position: relative;
        border-radius: 24px 24px 0 0;
        overflow: hidden;
        background: rgb(20, 20, 20);
        will-change: transform;

        @media ${device.sm} {
            border-radius: 20px 20px 0 0;
        }
    }

    .pm-image {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;

        img {
            object-fit: cover;
        }
    }

    .swiper-button-prev,
    .swiper-button-next {
        color: #c4ff00;
        &::after {
            font-size: 22px;
        }
    }
    .swiper-pagination-bullet {
        background: #fff;
    }
    .swiper-pagination-bullet-active {
        background: #c4ff00;
    }

    .pm-body.no-media {
        padding-top: 76px;
    }

    .pm-body {
        padding: 36px 44px 44px;
        display: flex;
        flex-direction: column;
        gap: 24px;

        @media ${device.sm} {
            padding: 24px 20px 32px;
            gap: 20px;
        }
    }

    h2 {
        font-size: clamp(1.8rem, 4vw, 2.6rem);
        font-weight: 500;
        line-height: 1.15;
    }

    .pm-description {
        color: #b5b5b5;
        font-size: 1.05rem;
        line-height: 1.7;
        max-width: 70ch;
    }

    .pm-block {
        h3 {
            font-size: 0.8rem;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #c4ff00;
            margin-bottom: 12px;
        }
        p,
        li {
            color: #b5b5b5;
            line-height: 1.7;
        }
        ul {
            padding-left: 20px;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
    }

    .pm-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        span {
            padding: 6px 14px;
            border-radius: 999px;
            border: 1px solid rgb(57, 57, 57);
            background: rgb(32, 32, 32);
            font-size: 0.875rem;
            color: #ddd;
        }
    }

    .pm-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;

        a {
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
    }
`
