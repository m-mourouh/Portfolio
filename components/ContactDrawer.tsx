'use client'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { IoClose } from 'react-icons/io5'
import { FiCopy, FiCheck, FiMail } from 'react-icons/fi'
import { FaLinkedinIn, FaGithub } from 'react-icons/fa'
import Modal from './ui/Modal'
import ContactForm from './ContactForm'
import { device } from '@/styles/styled-components/Breakpoints'
import { onOpenContactDrawer } from '@/lib/contactDrawer'
import { useLanguage } from '@/contexts/LanguageContext'
import userData from '@/data/user.json'
import profilesData from '@/data/profiles.json'

/** Slide-in contact panel, opened from "Hire Me" / "Contact Me" via openContactDrawer(). */
export default function ContactDrawer() {
    const { t } = useLanguage()
    const [open, setOpen] = useState(false)
    const [sent, setSent] = useState(false)
    const [copied, setCopied] = useState(false)
    const email = userData.user.email

    useEffect(
        () =>
            onOpenContactDrawer(() => {
                setSent(false)
                setOpen(true)
            }),
        []
    )

    useEffect(() => {
        if (!copied) return
        const timer = setTimeout(() => setCopied(false), 2000)
        return () => clearTimeout(timer)
    }, [copied])

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(email)
            setCopied(true)
        } catch {
            window.location.href = `mailto:${email}`
        }
    }

    if (!open) return null

    return (
        <Modal variant="drawer" labelledBy="contact-drawer-title" onClose={() => setOpen(false)}>
            {(close) => (
                <Panel>
                    <div className="cd-top">
                        <span className="cd-status">
                            <span className="dot" /> {t('hero.available')}
                        </span>
                        <button className="cd-close" onClick={close} aria-label={t('contactDrawer.close')}>
                            <IoClose />
                        </button>
                    </div>

                    <h2 id="contact-drawer-title">{t('contactDrawer.title')}</h2>
                    <p className="cd-subtitle">{t('contactDrawer.subtitle')}</p>

                    <div className="cd-email">
                        <a href={`mailto:${email}`} className="cd-email-link" data-autofocus>
                            <FiMail /> {email}
                        </a>
                        <button className="cd-copy" onClick={copyEmail} aria-live="polite">
                            {copied ? <FiCheck /> : <FiCopy />}
                            {copied ? t('contactDrawer.copied') : t('contactDrawer.copy')}
                        </button>
                    </div>

                    <div className="cd-socials">
                        {profilesData.data.linkedin && (
                            <a href={profilesData.data.linkedin} target="_blank" rel="noopener noreferrer">
                                <FaLinkedinIn /> LinkedIn
                            </a>
                        )}
                        {profilesData.data.github && (
                            <a href={profilesData.data.github} target="_blank" rel="noopener noreferrer">
                                <FaGithub /> GitHub
                            </a>
                        )}
                    </div>

                    <div className="cd-divider">
                        <span>{t('contactDrawer.orMessage')}</span>
                    </div>

                    {sent ? (
                        <div className="cd-sent" role="status">
                            <FiCheck className="cd-sent-icon" />
                            <h3>{t('contactDrawer.sentTitle')}</h3>
                            <p>{t('contactDrawer.sentText')}</p>
                            <button className="cd-sent-close" onClick={close}>
                                {t('contactDrawer.close')}
                            </button>
                        </div>
                    ) : (
                        <ContactForm variant="stacked" onSent={() => setSent(true)} />
                    )}
                </Panel>
            )}
        </Modal>
    )
}

const Panel = styled.div`
    padding: 28px 32px 40px;
    display: flex;
    flex-direction: column;
    min-height: 100%;

    @media (max-width: 600px) {
        padding: 20px 20px 32px;
    }

    .cd-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 28px;
    }

    .cd-status {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #ddd;

        .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #c4ff00;
            box-shadow: 0 0 0 4px rgba(196, 255, 0, 0.15);
        }
    }

    .cd-close {
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        border: 1px solid rgb(57, 57, 57);
        background: rgb(32, 32, 32);
        color: var(--white);
        font-size: 1.3rem;
        cursor: pointer;
        transition: border-color 0.2s ease;

        &:hover,
        &:focus-visible {
            border-color: #c4ff00;
            outline: none;
        }
    }

    h2 {
        font-size: clamp(1.8rem, 4vw, 2.4rem);
        font-weight: 500;
        line-height: 1.15;
        margin-bottom: 10px;
    }

    .cd-subtitle {
        color: #999;
        line-height: 1.6;
        margin-bottom: 28px;
    }

    .cd-email {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 10px 10px 10px 18px;
        border-radius: 14px;
        border: 1px solid rgb(45, 45, 45);
        background: rgb(30, 30, 30);

        .cd-email-link {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            min-width: 0;
            color: var(--white);
            text-decoration: none;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            &:focus-visible {
                outline: 1px solid #c4ff00;
                outline-offset: 4px;
                border-radius: 4px;
            }
        }
    }

    .cd-copy {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 10px 14px;
        border-radius: 10px;
        border: none;
        background: #c4ff00;
        color: #000;
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover {
            background: #a8d600;
        }
    }

    .cd-socials {
        display: flex;
        gap: 10px;
        margin-top: 12px;

        a {
            flex: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px;
            border-radius: 12px;
            border: 1px solid rgb(45, 45, 45);
            color: #ddd;
            text-decoration: none;
            font-size: 0.95rem;
            transition: border-color 0.2s ease, color 0.2s ease;

            &:hover,
            &:focus-visible {
                border-color: rgb(90, 90, 90);
                color: var(--white);
                outline: none;
            }
        }
    }

    .cd-divider {
        display: flex;
        align-items: center;
        gap: 14px;
        margin: 28px 0 20px;
        color: #777;
        font-size: 0.85rem;

        &::before,
        &::after {
            content: '';
            flex: 1;
            height: 1px;
            background: rgb(45, 45, 45);
        }
    }

    .cd-sent {
        text-align: center;
        padding: 32px 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;

        .cd-sent-icon {
            font-size: 2.4rem;
            color: #000;
            background: #c4ff00;
            border-radius: 50%;
            padding: 10px;
            width: 56px;
            height: 56px;
            margin-bottom: 8px;
        }

        p {
            color: #999;
        }

        .cd-sent-close {
            margin-top: 12px;
            padding: 12px 28px;
            border-radius: 12px;
            border: 1px solid rgb(57, 57, 57);
            background: rgb(32, 32, 32);
            color: var(--white);
            cursor: pointer;
        }
    }
`
