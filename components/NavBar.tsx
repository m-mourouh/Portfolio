'use client'
import { useState } from 'react'
import { StyledNav } from '@/styles/styled-components/NavBar.styled'
import Image from 'next/image'
import Logo from '@/public/images/logo.svg'
import { Link } from 'react-scroll'
import navData  from '@/data/navigation.json'
import userData  from '@/data/user.json'
import { fira_code } from '../fonts/fonts'
import { StyledButton } from '@/styles/styled-components/Button.styled'
export default function NavBar() {
    const [toggle, setToggle] = useState(false)
    // functions
    const toggleMenu = () => {
        setToggle((prevValue) => !prevValue)
    }
    return (
        <StyledNav>
            <div
                className={toggle ? 'overlay active' : 'overlay '}
                onClick={toggleMenu}
            ></div>
            <Link to="/">
                <Image
                    src={Logo}
                    alt={userData.user.name}
                    width={50}
                    height={50}
                />
            </Link>
            <div className={toggle ? 'menu  active' : 'menu'}>
                <ul>
                    {navData.navigation.map((item, index) => (
                        <li key={index}>
                            <Link
                                smooth={true}
                                duration={500}
                                className={fira_code.variable}
                                to={`${item.toLowerCase()}`}
                                onClick={toggleMenu}
                            >
                                {item.toLowerCase()}
                            </Link>
                        </li>
                    ))}
                </ul>
                <StyledButton
                    className={`link ${fira_code.variable}`}
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
