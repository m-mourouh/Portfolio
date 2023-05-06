'use client'
import { useState } from 'react'
import { StyledNav } from '@/styles/styled-components/NavBar.styled'
import Image from 'next/image'
import Logo from '@/public/images/logo.svg'
import Link from 'next/link'
import data from '@/data/data.json'
import { fira_code } from '../fonts/fonts'
import { StyledButton } from '@/styles/styled-components/Button.styled'
export default function NavBar() {
    const [toggle, setToggle] = useState(false)
    // functions
    const toggleMenu = () => {
        setToggle((prevValue) => !prevValue)
    }
    return (
        <StyledNav className={fira_code.variable}>
            <div className={toggle ? 'overlay active' : 'overlay '} onClick={toggleMenu}></div>
            <Link href="/">
                <Image src={Logo} alt={data.user.name} width={50} height={50} />
            </Link>
            <div className={toggle ? 'menu  active' : 'menu'}>
                <ul>
                    {data.nav.map((item, index) => (
                        <li key={index}>
                            <Link href={`#${item}`} onClick={toggleMenu}>
                                {item}
                            </Link>
                        </li>
                    ))}
                </ul>
                <StyledButton
                    className={`link ${fira_code.variable}`}
                    onClick={toggleMenu}
                    as="a"
                    width={120}
                >
                    Resume
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
