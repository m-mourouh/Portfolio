'use client'
import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { FaReact, FaJava, FaVuejs, FaPython, FaHtml5, FaCss3Alt, FaJs, FaNetworkWired, FaExternalLinkAlt } from 'react-icons/fa'
import { SiSpring, SiCisco } from 'react-icons/si'
import { CertContainer } from '@/styles/styled-components/Skills.styled'
import { useLanguage } from '@/contexts/LanguageContext'

interface Certification {
    nameKey: string
    issuer: string
    year: string
    icon: React.ReactNode
    url: string
}

export default function Certifications() {
    const { t } = useLanguage()
    const containerRef = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)

    // Certifications data - from LinkedIn
    const certifications: Certification[] = [
        {
            nameKey: 'certifications.advancedReact',
            issuer: 'Meta',
            year: '',
            icon: <FaReact />,
            url: 'https://www.coursera.org/account/accomplishments/verify/2J393YWKG8AA'
        },
        {
            nameKey: 'certifications.javaMicroservices',
            issuer: 'Google',
            year: '',
            icon: <FaJava />,
            url: 'https://www.coursera.org/account/accomplishments/verify/G2CLPCRBY5ZY'
        },
        {
            nameKey: 'certifications.dataStructuresBackend',
            issuer: 'Board Infinity',
            year: '',
            icon: <FaJava />,
            url: 'https://www.coursera.org/account/accomplishments/verify/2J3BFV8ZLKWF'
        },
        {
            nameKey: 'certifications.springMvcBoot',
            issuer: 'LearnQuest',
            year: '',
            icon: <SiSpring />,
            url: 'https://www.coursera.org/account/accomplishments/verify/TCMC6PRGQJ52'
        },
        {
            nameKey: 'certifications.vueStorefront',
            issuer: 'Alokai',
            year: '',
            icon: <FaVuejs />,
            url: 'https://academy.alokai.com/certificates/ip9bna7zxl'
        },
        {
            nameKey: 'certifications.responsiveWebsite',
            issuer: 'University of London',
            year: '',
            icon: <FaHtml5 />,
            url: 'https://www.coursera.org/account/accomplishments/verify/85Z74A87DWK7'
        },
        {
            nameKey: 'certifications.introductionIot',
            issuer: 'Cisco',
            year: '',
            icon: <SiCisco />,
            url: 'https://www.credly.com/badges/3e91fc07-e8c1-4e21-9923-ee5746382401'
        },
        {
            nameKey: 'certifications.pythonDataScience',
            issuer: 'IBM',
            year: '',
            icon: <FaPython />,
            url: 'https://www.credly.com/badges/9abc7d66-b198-4d9a-8c4c-7a6d3616fd72/public_url'
        },
        {
            nameKey: 'certifications.javaProgramming',
            issuer: 'OpenClassrooms',
            year: '',
            icon: <FaJava />,
            url: 'https://openclassrooms.com/fr/course-certificates/6073370022'
        },
        {
            nameKey: 'certifications.jquery',
            issuer: 'OpenClassrooms',
            year: '',
            icon: <FaJs />,
            url: 'https://openclassrooms.com/fr/course-certificates/3046679991'
        },
        {
            nameKey: 'certifications.jsProgramming',
            issuer: 'OpenClassrooms',
            year: '',
            icon: <FaJs />,
            url: 'https://openclassrooms.com/fr/course-certificates/2402166741'
        },
    ]

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted || !containerRef.current) return

        const items = containerRef.current.querySelectorAll('.cert-item')

        gsap.fromTo(
            items,
            { opacity: 0, x: -20 },
            {
                opacity: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out',
            }
        )
    }, [mounted])

    if (!mounted) {
        return <CertContainer ref={containerRef}></CertContainer>
    }

    return (
        <CertContainer ref={containerRef}>
            {certifications.map((cert, index) => (
                <a
                    key={index}
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-item"
                >
                    <div className="cert-icon">
                        {cert.icon}
                    </div>
                    <div className="cert-content">
                        <div className="cert-name">{t(cert.nameKey)}</div>
                        <div className="cert-issuer">{cert.issuer}</div>
                    </div>
                    <div className="cert-year">{cert.year}</div>
                    <FaExternalLinkAlt className="external-icon" />
                </a>
            ))}
        </CertContainer>
    )
}
