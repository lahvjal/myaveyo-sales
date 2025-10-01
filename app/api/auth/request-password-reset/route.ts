import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email'

// POST /api/auth/request-password-reset
// body: { email: string }
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }

    const admin = createClient(supabaseUrl, serviceKey)

    // Generate recovery link that redirects to our custom reset page
    const { data, error } = await admin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        // Supabase appends the code as a query param to this redirect
        redirectTo: `https://my.aveyosales.com/reset-password`,
      },
    })
    const actionLink = (data as any)?.action_link || (data as any)?.properties?.action_link
    if (error || !actionLink) {
      return NextResponse.json({ error: error?.message || 'Failed to generate link' }, { status: 400 })
    }


    // Compose email via Resend
    // Use RESEND_FROM if provided; otherwise let lib/email.ts default to onboarding@resend.dev
    const from = process.env.RESEND_FROM || undefined
    const html = `
      <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111">
        <h2>Reset your Aveyo Sales password</h2>
        <p>Click the button below to reset your password.</p>
        <p><a href="${actionLink}" style="display:inline-block;padding:12px 16px;background:#111;color:#fff;text-decoration:none;border-radius:4px">Reset password</a></p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break:break-all"><a href="${actionLink}">${actionLink}</a></p>
      </div>
    `
    await sendEmail({ to: email, subject: 'Reset your Aveyo Sales password', html, ...(from ? { from } : {}) })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}
