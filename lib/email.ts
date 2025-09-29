import { Resend } from 'resend'

// Initialize Resend client using environment variable
// Set RESEND_API_KEY in your environment (e.g., .env.local)
export const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendEmailParams {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
  replyTo?: string | string[]
}

export async function sendEmail({ to, subject, html, text, from, replyTo }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
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
  return await resend.emails.send(options)
}
