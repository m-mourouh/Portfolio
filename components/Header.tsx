'use client'
import { StyledHeader } from '@/styles/styled-components/Header.styled'
import NavBar from './NavBar'
import { useEffect, useState } from 'react'

const Header = () => {
    const [isScroll, setIsScroll] = useState(false)
    useEffect(() => {
        const handleScrollEvent = () => {
            const isScrolling = window.scrollY > 0 ? true : false
            setIsScroll(isScrolling)
        }

        window.addEventListener('scroll', handleScrollEvent)

        // cleanup the listener when component unmout
        return () => window.removeEventListener('scroll', handleScrollEvent)
    }, [])
    return (
        <StyledHeader className={isScroll ? 'scrolling' : ''}>
            <NavBar />
        </StyledHeader>
    )
}

export default Header
