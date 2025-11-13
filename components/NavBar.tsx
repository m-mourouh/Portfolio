'use client'
import { useEffect, useRef, useState } from 'react'
import { StyledNav } from '@/styles/styled-components/NavBar.styled'
import { Link } from 'react-scroll'
import navData from '@/data/navigation.json'
import userData from '@/data/user.json'
import { StyledButton } from '@/styles/styled-components/Button.styled'
import { gsap } from 'gsap'
import Image from 'next/image'
import Logo from '@/public/images/logo.svg'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'
export default function NavBar() {
    const { t } = useLanguage()
    const [toggle, setToggle] = useState(false)
    const container = useRef<HTMLDivElement>(null)
    const tl = useRef<GSAPTimeline | null>(null)
    useEffect(() => {
        const navLogo = document.querySelector('.nav-logo')
        const navLink = document.querySelectorAll('.nav-link')
        const navBtn = document.querySelector('.nav-btn')
        let ctx = gsap.context(() => {
            tl.current = gsap
                .timeline({
                    ease: 'Slow.easeIn',
                })
                .from(navLogo, {
                    opacity: 0,
                    delay: 2,
                })
                .to(navLogo, {
                    opacity: 1,
                    delay: 0,
                })
                .from(navLink, {
                    opacity: 0,
                    y: -5,
                    delay: 0,
                })
                .to(navLink, {
                    y: 0,
                    stagger: 0.1,
                    opacity: 1,
                    delay: 0,
                })
                .from(navBtn, {
                    opacity: 0,
                    y: -5,
                    delay: 0,
                })
                .to(navBtn, {
                    y: 0,
                    opacity: 1,
                })
        }, container)

        return () => ctx.revert()
    }, [])
    // functions
    const toggleMenu = () => {
        setToggle((prevValue) => !prevValue)
    }
    return (
        <StyledNav ref={container}>
            <div
                className={toggle ? 'overlay active' : 'overlay '}
                onClick={toggleMenu}
            ></div>
            <Link to="head" smooth={true} duration={500}>
                <Image
                    src={Logo}
                    alt={userData.user.name}
                    width={50}
                    height={50}
                    className="nav-logo"
                />
            </Link>
            <div className={toggle ? 'menu  active' : 'menu'}>
                <ul>
                    {navData.navigation.map((item, index) => {
                        const target = item.toLowerCase() === 'home' ? 'head' : item.toLowerCase() === 'work' ? 'projects' : item.toLowerCase()
                        const translationKey = `nav.${item.toLowerCase()}`
                        return (
                            <li key={index}>
                                <Link
                                    smooth={true}
                                    duration={500}
                                    className="nav-link"
                                    to={target}
                                    onClick={toggleMenu}
                                >
                                    {t(translationKey)}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
                <div className="mobile-language-switcher">
                    <LanguageSwitcher isMobile={true} />
                </div>
                <StyledButton
                    className="link mobile-btn nav-btn"
                    onClick={toggleMenu}
                    as="a"
                    href={`mailto:${userData.user.email}`}
                    $outline
                >
                    {t('nav.contactMe')}
                </StyledButton>
            </div>
            <div className="nav-button-wrapper">
                <LanguageSwitcher />
                <StyledButton
                    className="link nav-btn"
                    as="a"
                    href={`mailto:${userData.user.email}`}
                    $outline
                >
                    {t('nav.contactMe')}
                </StyledButton>
            </div>
            <div
                className={toggle ? 'menu-icon active' : 'menu-icon '}
                onClick={toggleMenu}
            >
                <div>
                    <span className={toggle ? 'active' : ''}></span>
                    <span className={toggle ? 'active' : ''}></span>
                </div>
            </div>
        </StyledNav>
    )
}
