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

  return await resend.emails.send({
    from: fromAddress,
    to,
    subject,
    html,
    text,
    replyTo,
  })
}
