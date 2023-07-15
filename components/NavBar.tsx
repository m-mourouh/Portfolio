'use client'
import { useEffect, useRef, useState } from 'react'
import { StyledNav } from '@/styles/styled-components/NavBar.styled'
import Image from 'next/image'
import Logo from '@/public/images/logo.svg'
import { Link } from 'react-scroll'
import navData from '@/data/navigation.json'
import userData from '@/data/user.json'
import { fira_code } from '../fonts/fonts'
import { StyledButton } from '@/styles/styled-components/Button.styled'
import { gsap } from 'gsap'
export default function NavBar() {
    const [toggle, setToggle] = useState(false)
    const container = useRef<HTMLDivElement>(null)
    const tl = useRef<GSAPTimeline>()
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
                    {navData.navigation.map((item, index) => (
                        <li key={index}>
                            <Link
                                smooth={true}
                                duration={500}
                                className={fira_code.variable + ' nav-link'}
                                to={`${item.toLowerCase()}`}
                                onClick={toggleMenu}
                            >
                                {item.toLowerCase()}
                            </Link>
                        </li>
                    ))}
                </ul>
                <StyledButton
                    className={`link ${fira_code.variable} nav-btn`}
                    onClick={toggleMenu}
                    as="a"
                    href={`mailto:${userData.user.email}`}
                >
                    Let&#39;s talk
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
