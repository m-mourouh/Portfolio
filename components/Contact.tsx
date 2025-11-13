'use client'
import { roboto } from '@/fonts/fonts'
import { StyledSection } from '@/styles/styled-components/Contact.styled'
import React, { ChangeEvent, useRef, useState, useEffect, useMemo } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { BiErrorAlt } from 'react-icons/bi'
import { AiOutlineSend } from 'react-icons/ai'
import { sendContactForm } from '@/lib/api'
import Notification from './Notification'
import { useLanguage } from '@/contexts/LanguageContext'
export default function Contact() {
    const { t, language } = useLanguage()
    const form = useRef<HTMLFormElement>(null)
    const [isValid, setIsValid] = useState(false)
    const [MessageIsSent, setMessageIsSent] = useState(false)
    useEffect(() => {
            const timer = setTimeout(() => {
                if (MessageIsSent) {
                    setMessageIsSent(false)
                }
            }, 3000)

             return () => clearTimeout(timer)
    }, [MessageIsSent])

    const validationSchema = useMemo(() => Yup.object({
        firstName: Yup.string()
            .trim()
            .min(3, t('contact.errors.firstNameMin'))
            .max(20, t('contact.errors.firstNameMax'))
            .required(t('contact.errors.firstNameRequired')),
        lastName: Yup.string()
            .trim()
            .min(3, t('contact.errors.lastNameMin'))
            .max(20, t('contact.errors.lastNameMax'))
            .required(t('contact.errors.lastNameRequired')),
        email: Yup.string()
            .email(t('contact.errors.emailInvalid'))
            .required(t('contact.errors.emailRequired')),
        message: Yup.string()
            .trim()
            .min(5, t('contact.errors.messageMin'))
            .required(t('contact.errors.messageRequired')),
    }), [t])

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            message: '',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values): Promise<any> => {
            const isSent = await sendContactForm(values)
            setMessageIsSent(isSent)
            if (isSent) {
                formik.resetForm()
                setIsValid(false)
                console.log('form was reset successfully')
            }
        },
    })

    // Re-validate form when language changes
    useEffect(() => {
        if (formik.touched.firstName || formik.touched.lastName || formik.touched.email || formik.touched.message) {
            formik.validateForm()
        }
    }, [language])

    // functions
    const handleChange = (e: ChangeEvent) => {
        formik.handleChange(e)
        setIsValid(false)
        if (
            Object.keys(formik.errors).length === 0 &&
            Object.values(formik.values).filter((v) => v !== '').length === 4
        ) {
            setIsValid(true)
        }
    }

    return (
        <StyledSection id="contact">
            {MessageIsSent ? <Notification message="Your Message has been received" /> : null}

            <div className="contact-header">
                <h1 className={roboto.variable} dangerouslySetInnerHTML={{ __html: t('contact.title') }} />
                <p className="subtitle">{t('contact.subtitle')}</p>
            </div>

            <form
                onSubmit={formik.handleSubmit}
                autoComplete="off"
                spellCheck="false"
                ref={form}
            >
                <span>
                    <input
                        type="text"
                        placeholder={t('contact.name')}
                        value={formik.values.firstName}
                        onChange={(e) => handleChange(e)}
                        name="firstName"
                        onBlur={formik.handleBlur}
                        required
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                        <p className="error">
                            <small>
                                <BiErrorAlt />
                                {formik.errors.firstName}
                            </small>
                        </p>
                    )}
                </span>
                <span>
                    <input
                        type="text"
                        placeholder={t('contact.lastName')}
                        value={formik.values.lastName}
                        onChange={(e) => handleChange(e)}
                        name="lastName"
                        onBlur={formik.handleBlur}
                        required
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                        <p className="error">
                            <small>
                                <BiErrorAlt />
                                {formik.errors.lastName}
                            </small>
                        </p>
                    )}
                </span>
                <span>
                    <input
                        type="email"
                        placeholder={t('contact.email')}
                        value={formik.values.email}
                        onChange={(e) => handleChange(e)}
                        name="email"
                        onBlur={formik.handleBlur}
                        required
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="error">
                            <small>
                                <BiErrorAlt />
                                {formik.errors.email}
                            </small>
                        </p>
                    )}
                </span>
                <span>
                    <textarea
                        rows={10}
                        cols={50}
                        placeholder={t('contact.message')}
                        value={formik.values.message}
                        onChange={(e) => handleChange(e)}
                        name="message"
                        onBlur={formik.handleBlur}
                        minLength={5}
                        required
                    ></textarea>
                    {formik.touched.message && formik.errors.message && (
                        <p className="error">
                            <small>
                                <BiErrorAlt />
                                {formik.errors.message}
                            </small>
                        </p>
                    )}
                </span>
                <button
                    type="submit"
                    disabled={!isValid}
                >
                    {formik.isSubmitting ? t('contact.sending') : t('contact.send')}
                    <AiOutlineSend className='icon'/>
                </button>
            </form>
        </StyledSection>
    )
}
