import { NextResponse } from 'next/server'
import * as Yup from 'yup'
import { transporter, mailOptions } from '@/config/nodemailer'

export const runtime = 'nodejs'

const PROJECT_TYPES = ['web', 'ai', 'ui', 'consulting', 'other'] as const
const TYPE_LABELS: Record<(typeof PROJECT_TYPES)[number], string> = {
    web: 'Web platform',
    ai: 'AI product',
    ui: 'Front-end / UI',
    consulting: 'Consulting',
    other: 'Something else',
}

const schema = Yup.object({
    name: Yup.string().trim().min(2).max(60).required(),
    company: Yup.string().trim().max(80).default(''),
    projectTypes: Yup.array(Yup.string().oneOf([...PROJECT_TYPES]).required()).max(PROJECT_TYPES.length).default([]),
    email: Yup.string().trim().email().max(200).required(),
    message: Yup.string().trim().min(5).max(5000).required(),
    /** honeypot: humans never see or fill it */
    website: Yup.string().max(0, 'bot'),
})

// Basic rate limit: 5 messages per IP per 10 minutes (per server instance)
const WINDOW = 10 * 60 * 1000
const LIMIT = 5
const hits = new Map<string, number[]>()
const limited = (ip: string) => {
    const now = Date.now()
    const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW)
    recent.push(now)
    hits.set(ip, recent)
    if (hits.size > 5000) hits.clear() // never grow without bound
    return recent.length > LIMIT
}

// Visitor input goes into an HTML email: escape it so nobody can inject markup or links
const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

/**
 * Sends the contact form by email. Responds { sent: true } only when the mail server accepted
 * the message; otherwise an error status with { sent: false, error }.
 */
export async function POST(request: Request) {
    const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
    if (limited(ip)) return NextResponse.json({ sent: false, error: 'rate' }, { status: 429 })

    let data: Yup.InferType<typeof schema>
    try {
        data = await schema.validate(await request.json(), { stripUnknown: true })
    } catch {
        // includes a filled honeypot: rejected, nothing is sent
        return NextResponse.json({ sent: false, error: 'invalid' }, { status: 400 })
    }

    if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
        console.error('Contact form: EMAIL / EMAIL_PASS are not configured')
        return NextResponse.json({ sent: false, error: 'unavailable' }, { status: 503 })
    }

    const types = data.projectTypes.map((t) => TYPE_LABELS[t as keyof typeof TYPE_LABELS]).join(', ')
    const lines = [
        `From: ${data.name}${data.company ? ` (${data.company})` : ''} <${data.email}>`,
        ...(types ? [`Wants to build: ${types}`] : []),
        '',
        data.message,
    ]
    try {
        await transporter.sendMail({
            ...mailOptions,
            replyTo: `"${data.name.replace(/"/g, '')}" <${data.email}>`,
            subject: `Portfolio message from ${data.name}${data.company ? `, ${data.company}` : ''}`,
            text: lines.join('\n'),
            html: `
                <p><b style="color:#5a7a00;">Name:</b> ${escapeHtml(data.name)}</p>
                ${data.company ? `<p><b style="color:#5a7a00;">Company:</b> ${escapeHtml(data.company)}</p>` : ''}
                <p><b style="color:#5a7a00;">Email:</b> ${escapeHtml(data.email)}</p>
                ${types ? `<p><b style="color:#5a7a00;">Wants to build:</b> ${escapeHtml(types)}</p>` : ''}
                <p><b style="color:#5a7a00;">Message:</b></p>
                <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
            `,
        })
        return NextResponse.json({ sent: true })
    } catch (err) {
        console.error('Contact form: sending failed', err)
        return NextResponse.json({ sent: false, error: 'failed' }, { status: 502 })
    }
}
