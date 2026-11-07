'use client'
import { useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import styled from 'styled-components'
import { FiArrowUpRight, FiCopy, FiCheck, FiRotateCw } from 'react-icons/fi'
import { sendContactForm, SendError } from '@/lib/api'
import userData from '@/data/user.json'
import { useLanguage } from '@/contexts/LanguageContext'
import { device } from '@/styles/styled-components/Breakpoints'

/**
 * Contact form. "sentence": the fields read as one sentence (Contact section); "stacked": a
 * standard labelled form (drawer, very narrow screens, or no CSS). Either way every input has
 * a real <label>, so screen readers get a normal form. Success is shown ONLY when the server
 * confirms the mail was accepted; otherwise the real failure is shown and the input is kept.
 */

const TYPES = ['web', 'ai', 'ui', 'consulting', 'other'] as const
const FIELD_ORDER = ['name', 'company', 'email', 'message'] as const
const STATUS_TEXT: Record<number, string> = { 200: 'OK', 400: 'Bad Request', 429: 'Too Many Requests', 502: 'Bad Gateway', 503: 'Service Unavailable', 500: 'Internal Server Error' }
const LAYERS = ['UI', 'API', 'SERVICES', 'DATA', 'AI']

type Status = { state: 'idle' } | { state: 'sending' } | { state: 'success' } | { state: 'error'; error: SendError; code: number | null }

export default function ContactForm({ onSent, variant = 'sentence' }: { onSent?: () => void; variant?: 'sentence' | 'stacked' }) {
    const { t } = useLanguage()
    const [status, setStatus] = useState<Status>({ state: 'idle' })
    const [copied, setCopied] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)
    const successRef = useRef<HTMLDivElement>(null)
    const id = (f: string) => `cf-${variant}-${f}`

    const schema = Yup.object({
        name: Yup.string().trim().required(t('contact.v.nameRequired')).min(2, t('contact.v.nameMin')).max(60, t('contact.v.nameMax')),
        company: Yup.string().trim().max(80, t('contact.v.companyMax')),
        email: Yup.string().trim().required(t('contact.v.emailRequired')).email(t('contact.v.emailInvalid')),
        message: Yup.string().trim().required(t('contact.v.messageRequired')).min(5, t('contact.v.messageMin')).max(5000, t('contact.v.messageMax')),
    })

    const formik = useFormik({
        initialValues: { name: '', company: '', projectTypes: [] as string[], email: '', message: '', website: '' },
        validationSchema: schema,
        // errors only show once a field was left (or after a submit), but they are re-checked as
        // the visitor types: a fixed field clears its message right away, so nothing above the
        // Send button disappears (and moves the button) in the middle of the click
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, { resetForm }) => {
            setStatus({ state: 'sending' })
            const res = await sendContactForm(values)
            if (res.ok) {
                resetForm()
                setStatus({ state: 'success' })
                onSent?.()
            } else {
                setStatus({ state: 'error', error: res.error, code: res.status })
            }
        },
    })

    // on a failed submit, move focus to the first invalid field (once validation has finished)
    const pendingFocus = useRef(false)
    useEffect(() => {
        if (formik.submitCount > 0) pendingFocus.current = true
    }, [formik.submitCount])
    useEffect(() => {
        if (!pendingFocus.current || formik.isValidating || formik.isSubmitting) return
        pendingFocus.current = false
        const first = FIELD_ORDER.find((f) => formik.errors[f])
        if (first) formRef.current?.querySelector<HTMLElement>(`#${id(first)}`)?.focus()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formik.errors, formik.isValidating, formik.isSubmitting, formik.submitCount])

    // success: focus the confirmation (it is also announced by its live region)
    useEffect(() => {
        if (status.state === 'success') successRef.current?.focus()
    }, [status.state])

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(userData.user.email)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            window.location.href = `mailto:${userData.user.email}`
        }
    }

    const err = (f: (typeof FIELD_ORDER)[number]) => (formik.touched[f] || formik.submitCount > 0 ? formik.errors[f] : undefined)
    const field = (f: (typeof FIELD_ORDER)[number], label: string, ph: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
        <span className={`field f-${f}${err(f) ? ' has-error' : ''}`}>
            <label htmlFor={id(f)} className="lbl">
                {label}
            </label>
            <input
                id={id(f)}
                {...formik.getFieldProps(f)}
                placeholder={ph}
                aria-invalid={!!err(f)}
                aria-describedby={err(f) ? id(`${f}-err`) : undefined}
                {...extra}
            />
            {err(f) && (
                <span className="err" id={id(`${f}-err`)}>
                    {err(f)}
                </span>
            )}
        </span>
    )
    const sending = status.state === 'sending'
    const code = status.state === 'error' ? status.code : null

    return (
        <Form ref={formRef} className={`cf ${variant}`} noValidate onSubmit={formik.handleSubmit} aria-busy={sending}>
            {/* honeypot: hidden from people and assistive tech, bots fill it */}
            <div className="hp" aria-hidden="true">
                <label htmlFor={id('website')}>Website</label>
                <input id={id('website')} tabIndex={-1} autoComplete="off" {...formik.getFieldProps('website')} />
            </div>

            <p className="sentence">
                <span className="frag" aria-hidden="true">
                    {t('contact.hi')}
                </span>{' '}
                {field('name', t('contact.label.name'), t('contact.ph.name'), { autoComplete: 'name', required: true })}{' '}
                <span className="frag" aria-hidden="true">
                    {t('contact.from')}
                </span>{' '}
                {field('company', t('contact.label.company'), t('contact.ph.company'), { autoComplete: 'organization' })}
                <span className="frag" aria-hidden="true">
                    . {t('contact.build')}
                </span>
            </p>

            <fieldset className="types">
                <legend className="lbl">{t('contact.label.types')}</legend>
                {TYPES.map((k) => {
                    const checked = formik.values.projectTypes.includes(k)
                    return (
                        <label key={k} className={`chip${checked ? ' is-on' : ''}`}>
                            <input
                                type="checkbox"
                                name="projectTypes"
                                value={k}
                                checked={checked}
                                onChange={() =>
                                    formik.setFieldValue('projectTypes', checked ? formik.values.projectTypes.filter((x) => x !== k) : [...formik.values.projectTypes, k])
                                }
                            />
                            {t(`contact.types.${k}`)}
                        </label>
                    )
                })}
            </fieldset>

            <p className="sentence">
                <span className="frag" aria-hidden="true">
                    {t('contact.reach')}
                </span>{' '}
                {field('email', t('contact.label.email'), t('contact.ph.email'), { type: 'email', autoComplete: 'email', inputMode: 'email', required: true })}
                <span className="frag" aria-hidden="true">
                    .
                </span>
            </p>

            <div className={`field f-message${err('message') ? ' has-error' : ''}`}>
                <label htmlFor={id('message')} className="lbl-visible">
                    {t('contact.more')}
                </label>
                <textarea
                    id={id('message')}
                    rows={4}
                    {...formik.getFieldProps('message')}
                    placeholder={t('contact.ph.message')}
                    aria-invalid={!!err('message')}
                    aria-describedby={err('message') ? id('message-err') : undefined}
                    required
                />
                {err('message') && (
                    <span className="err" id={id('message-err')}>
                        {err('message')}
                    </span>
                )}
            </div>

            <button type="submit" className="send" disabled={sending}>
                {sending ? t('contact.state.sending') : t('contact.send')} <FiArrowUpRight aria-hidden="true" />
            </button>

            {/* the request, while it is really in flight */}
            <div className="status" role="status" aria-live="polite">
                {sending && (
                    <div className="sending">
                        <span className="readout">POST /contact …</span>
                        <span className="layers" aria-hidden="true">
                            {LAYERS.map((l) => (
                                <span key={l}>{l}</span>
                            ))}
                            <i className="pulse" />
                        </span>
                        <progress className="bar" aria-label={t('contact.state.sending')} />
                    </div>
                )}
                {status.state === 'success' && !onSent && (
                    <div className="ok" ref={successRef} tabIndex={-1}>
                        <span className="readout">POST /contact → 200 OK</span>
                        <p>{t('contact.state.ok')}</p>
                    </div>
                )}
            </div>
            {status.state === 'error' && (
                <div className="fail" role="alert">
                    <span className="readout">
                        POST /contact → {code ? `${code} ${STATUS_TEXT[code] || ''}` : 'network error'}
                    </span>
                    <p>
                        {t(`contact.state.${status.error}`)} {t('contact.state.keep')}
                    </p>
                    <div className="fail-actions">
                        <button type="button" onClick={copyEmail}>
                            {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />} {copied ? t('contact.copied') : t('contact.copyEmail')}
                        </button>
                        <button type="button" onClick={() => formik.submitForm()}>
                            <FiRotateCw aria-hidden="true" /> {t('contact.tryAgain')}
                        </button>
                    </div>
                </div>
            )}
        </Form>
    )
}

const mono = `font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;`
const srOnly = `position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;`
const stackedRules = `
    .sentence { display: grid; gap: 16px; font-size: 16px; }
    .frag { display: none; }
    .field { display: grid; gap: 6px; width: 100%; }
    .lbl { position: static; width: auto; height: auto; margin: 0; clip: auto; overflow: visible; white-space: normal; font-size: 14px; color: var(--c-text-muted); }
    .field input { width: 100%; min-width: 0; font-size: 16px; padding: 12px 14px; border: 1px solid var(--c-line-strong); border-radius: 10px; background: #1a1a1a; }
    .types legend { font-size: 14px; }
`

const Form = styled.form`
    display: grid;
    gap: 22px;
    color: var(--c-text);

    .hp {
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    }
    .lbl {
        ${srOnly}
    }

    /* ---------- the sentence ---------- */
    .sentence {
        margin: 0;
        font-size: clamp(1.5rem, 2.6vw, 2.25rem);
        line-height: 1.6;
        letter-spacing: -0.01em;
        color: var(--c-text);
    }
    .frag {
        color: var(--c-text-muted);
    }
    .field {
        position: relative;
        display: inline-block;
        vertical-align: baseline;
    }
    .field input {
        width: 9.5em;
        max-width: 100%;
        padding: 0 2px 2px;
        border: 0;
        border-bottom: 2px solid var(--c-line-strong);
        border-radius: 0;
        background: transparent;
        font: inherit;
        color: var(--c-text);
        transition: border-color 0.2s;

        &::placeholder {
            color: #6f6f6f;
        }
        &:focus {
            outline: none;
            border-bottom-color: var(--c-accent);
        }
        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: 4px;
        }
    }
    .f-email input {
        width: 12em;
    }
    .has-error input,
    .has-error textarea {
        border-color: #ff8a7a !important;
    }
    .err {
        display: block;
        margin-top: 6px;
        font-size: 15px;
        line-height: 1.4;
        letter-spacing: 0;
        color: #ff9d8f;
    }

    /* ---------- project types ---------- */
    .types {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 0;
        padding: 0;
        border: 0;
    }
    .chip {
        position: relative;
        display: inline-flex;
        align-items: center;
        min-height: 44px;
        padding: 0 18px;
        border-radius: 999px;
        border: 1px solid var(--c-line-strong);
        font-size: 15px;
        color: var(--c-text-muted);
        cursor: pointer;
        transition: color 0.2s, background 0.2s, border-color 0.2s;

        input {
            position: absolute;
            opacity: 0;
            inset: 0;
            margin: 0;
            cursor: pointer;
        }
        &:hover {
            color: var(--c-text);
        }
        &.is-on {
            background: var(--c-accent);
            border-color: var(--c-accent);
            color: #111;
        }
        &:has(input:focus-visible) {
            outline: 2px solid var(--c-accent);
            outline-offset: 2px;
        }
    }

    /* ---------- message ---------- */
    .f-message {
        display: grid;
        gap: 10px;
    }
    .lbl-visible {
        font-size: 15px;
        color: var(--c-text-muted);
    }
    textarea {
        width: 100%;
        min-height: 130px;
        padding: 14px 16px;
        border: 1px solid var(--c-line-strong);
        border-radius: 12px;
        background: #191919;
        font: inherit;
        font-size: 16px;
        line-height: 1.55;
        color: var(--c-text);
        resize: vertical;

        &::placeholder {
            color: #7a7a7a;
        }
        &:focus-visible {
            outline: 2px solid var(--c-accent);
            outline-offset: 2px;
        }
    }

    .send {
        justify-self: start;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        min-height: 52px;
        padding: 0 28px;
        border: 0;
        border-radius: 999px;
        background: var(--c-accent);
        color: #111;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;

        &:disabled {
            cursor: progress;
            background: rgb(44, 44, 44);
            color: #d0d0d0;
            box-shadow: inset 0 0 0 1px rgb(70, 70, 70);
        }
        &:focus-visible {
            outline: 2px solid var(--c-text);
            outline-offset: 3px;
        }
    }

    /* ---------- request states ---------- */
    .readout {
        ${mono}
        display: block;
        font-size: 14px;
        letter-spacing: 0.04em;
        color: var(--c-accent);
    }
    .sending {
        display: grid;
        gap: 12px;
    }
    .layers {
        position: relative;
        display: flex;
        justify-content: space-between;
        padding-top: 14px;
        ${mono}
        font-size: 12px;
        letter-spacing: 0.1em;
        color: var(--c-text-muted);

        &::before {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            top: 4px;
            height: 1px;
            background: var(--c-line-strong);
        }
        .pulse {
            position: absolute;
            top: 0;
            left: 0;
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: #d9ff40;
            box-shadow: 0 0 12px 3px rgba(196, 255, 0, 0.6);
            animation: cf-pulse 1.6s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
    }
    @keyframes cf-pulse {
        0% {
            left: 0;
            opacity: 0;
        }
        10%,
        90% {
            opacity: 1;
        }
        100% {
            left: calc(100% - 9px);
            opacity: 0;
        }
    }
    .bar {
        display: none;
        width: 100%;
        height: 4px;
        accent-color: var(--c-accent);
    }
    .ok,
    .fail {
        display: grid;
        gap: 8px;
        padding: 18px 20px;
        border-radius: 12px;
        border: 1px solid rgba(196, 255, 0, 0.45);
        background: rgba(196, 255, 0, 0.05);
        outline: none;

        p {
            margin: 0;
            font-size: 16px;
            line-height: 1.5;
        }
    }
    .fail {
        border-color: rgba(255, 138, 122, 0.5);
        background: rgba(255, 138, 122, 0.06);

        .readout {
            color: #ff9d8f;
        }
    }
    .fail-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 4px;

        button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            min-height: 44px;
            padding: 0 16px;
            border-radius: 999px;
            border: 1px solid var(--c-line-strong);
            background: none;
            color: var(--c-text);
            font-size: 15px;
            cursor: pointer;

            &:focus-visible {
                outline: 2px solid var(--c-accent);
                outline-offset: 2px;
            }
        }
    }

    /* ---------- phones: the sentence wraps, fields take the full line ---------- */
    @media ${device.sm} {
        .sentence {
            font-size: 1.375rem;
            line-height: 1.7;
        }
        .field {
            display: block;
            margin: 4px 0 6px;
        }
        .field input,
        .f-email input {
            width: 100%;
            font-size: 18px;
            padding: 6px 2px;
        }
        .send {
            justify-self: stretch;
        }
    }

    /* the plain stacked form: drawer, very narrow screens */
    &.stacked {
        ${stackedRules}
        .send {
            justify-self: stretch;
        }
    }
    @media (max-width: 359px) {
        ${stackedRules}
    }

    /* reduced motion: a simple progress bar instead of the travelling pulse */
    @media (prefers-reduced-motion: reduce) {
        .layers {
            display: none;
        }
        .bar {
            display: block;
        }
    }
`
