'use client'
import { fira_code, roboto, roboto_mono } from '@/fonts/fonts'
import { StyledButton } from '@/styles/styled-components/Button.styled'
import { StyledSection } from '@/styles/styled-components/Contact.styled'
import React, { ChangeEvent, useRef, useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup' // Great form validation library
import { BiErrorAlt } from 'react-icons/bi'
import { AiOutlineSend } from 'react-icons/ai'
import { sendContactForm } from '@/lib/api'
import Notification from './Notification'
export default function Contact() {
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
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            message: '',
        },
        validationSchema: Yup.object({
            firstName: Yup.string()
                .trim()
                .min(3, 'First name must be at least 3 characters')
                .max(20, 'First name must be at most 20 characters')
                .required('First name is required'),
            lastName: Yup.string()
                .trim()
                .min(3, 'Last name must be at least 3 characters')
                .max(20, 'Last name must be at most 15 characters ')
                .required('Last name is required'),
            email: Yup.string()
                .email('Invalid Email address')
                .required('Email is required'),
            message: Yup.string()
                .trim()
                .min(5, 'Message must be at least 5 characters')
                .required('Message is required'),
        }),
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

            <h1 className={roboto.variable}>Contact me.</h1>
            <form
                className={roboto_mono.variable}
                onSubmit={formik.handleSubmit}
                autoComplete="off"
                spellCheck="false"
                ref={form}
            >
                <span>
                    <input
                        type="text"
                        placeholder="First Name"
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
                        placeholder="Last Name"
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
                        placeholder="E-mail"
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
                        placeholder="Message"
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
                <StyledButton
                    className={fira_code.variable + ' showBtn'}
                    width={150}
                    type="submit"
                    disabled={!isValid}
                    contact={true}
                >
                    Send
                    <AiOutlineSend className='icon'/>
                </StyledButton>
            </form>
        </StyledSection>
    )
}
