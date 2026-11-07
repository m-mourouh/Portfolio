'use client'
import { roboto } from '@/fonts/fonts'
import { StyledSection } from '@/styles/styled-components/Contact.styled'
import ContactForm from './ContactForm'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Contact() {
    const { t } = useLanguage()

    return (
        <StyledSection id="contact">
            <div className="contact-header">
                <h1 className={roboto.variable} dangerouslySetInnerHTML={{ __html: t('contact.title') }} />
                <p className="subtitle">{t('contact.subtitle')}</p>
            </div>
            <ContactForm />
        </StyledSection>
    )
}
