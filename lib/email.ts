import { Resend } from 'resend'

// Lazily initialize Resend so builds don't crash if key is missing at build time
let _resend: Resend | null = null
export function getResend(): Resend | null {
  if (_resend) return _resend
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  _resend = new Resend(key)
  return _resend
}

export interface SendEmailParams {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
  replyTo?: string | string[]
}

export async function sendEmail({ to, subject, html, text, from, replyTo }: SendEmailParams) {
  const client = getResend()
  if (!client) {
    console.warn('RESEND_API_KEY is not set; skipping email send')
    return { id: null }
  }

  const fromAddress = from || process.env.RESEND_FROM || 'onboarding@resend.dev'

  // Some versions of the Resend SDK ship types that incorrectly require `react`.
  // Our usage with raw `html`/`text` is valid at runtime; cast to any to satisfy TS.
  const options: any = {
    from: fromAddress,
    to,
    subject,
    ...(html ? { html } : {}),
    ...(text ? { text } : {}),
    ...(replyTo ? { replyTo } : {}),
  }
  return await client.emails.send(options)
}
