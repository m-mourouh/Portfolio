import { EmailType } from '@/types/types'

export type SendError = 'invalid' | 'unavailable' | 'failed' | 'network' | 'rate'
export type SendResult = { ok: true; status: number } | { ok: false; error: SendError; status: number | null }

/** Sends the contact form. `ok` is true only if the server confirms the email was accepted. */
export const sendContactForm = async (data: EmailType): Promise<SendResult> => {
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        })
        const body = await response.json().catch(() => ({}))
        if (response.ok && body.sent === true) return { ok: true, status: response.status }
        const known: SendError[] = ['invalid', 'unavailable', 'rate']
        return { ok: false, error: known.includes(body.error) ? body.error : 'failed', status: response.status }
    } catch {
        return { ok: false, error: 'network', status: null }
    }
}
