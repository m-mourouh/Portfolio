'use client'
import { useState } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'
import { FaLinkedinIn, FaGithub, FaMedium, FaXTwitter } from 'react-icons/fa6'
import { roboto } from '@/fonts/fonts'
import { StyledSection } from '@/styles/styled-components/Contact.styled'
import ContactForm from './ContactForm'
import { useLanguage } from '@/contexts/LanguageContext'
import { useLocalTime } from '@/lib/useLocalTime'
import userData from '@/data/user.json'
import profiles from '@/data/profiles.json'
import SectionIndex from './SectionIndex'

/** Contact: direct details on the left (email, availability, local time, socials), the form on the right. */
export default function Contact() {
    const { t, language } = useLanguage()
    const time = useLocalTime(language)
    const [copied, setCopied] = useState(false)
    const email = userData.user.email

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(email)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            window.location.href = `mailto:${email}`
        }
    }
    const socials = [
        { href: profiles.data.linkedin, label: 'LinkedIn', icon: <FaLinkedinIn /> },
        { href: profiles.data.github, label: 'GitHub', icon: <FaGithub /> },
        { href: profiles.data.medium, label: 'Medium', icon: <FaMedium /> },
        { href: profiles.data.x, label: 'X', icon: <FaXTwitter /> },
    ].filter((s) => s.href)

    return (
        <StyledSection id="contact" aria-labelledby="contact-title">
            <div className="contact-header">
                <SectionIndex n={5} label={t('nav.contact')} center />
                <h2 id="contact-title" className={roboto.variable} dangerouslySetInnerHTML={{ __html: t('contact.title') }} />
                <p className="subtitle">{t('contact.subtitle')}</p>
            </div>

            <div className="contact-grid">
                <aside className="info">
                    <div className="mail">
                        <a href={`mailto:${email}`} className="mail-link">
                            {email}
                        </a>
                        <button type="button" className="copy" onClick={copy} aria-label={t('nav.copyEmail')}>
                            {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
                        </button>
                        <span className="copied" role="status">
                            {copied ? t('nav.copied') : ''}
                        </span>
                    </div>
                    <dl className="facts">
                        <div>
                            <dt className="sr-only">Status</dt>
                            <dd className="avail">
                                <span className="dot" aria-hidden="true" /> {t('contact.available')}
                            </dd>
                        </div>
                        <div>
                            <dt>{t('contact.localTime')}</dt>
                            <dd>{time ? <time>{time}</time> : '—'} · GMT+1</dd>
                        </div>
                    </dl>
                    <div className="elsewhere">
                        <p>{t('contact.elsewhere')}</p>
                        <ul>
                            {socials.map((s) => (
                                <li key={s.label}>
                                    <a href={s.href} target="_blank" rel="noopener noreferrer">
                                        {s.icon} <span>{s.label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
                <ContactForm />
            </div>
        </StyledSection>
    )
}
