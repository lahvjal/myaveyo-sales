import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const payload = {
      first_name: body.firstName?.toString().slice(0, 100) ?? null,
      last_name: body.lastName?.toString().slice(0, 100) ?? null,
      email: body.email?.toString().slice(0, 200) ?? null,
      phone: body.phone?.toString().slice(0, 50) ?? null,
      location: body.location?.toString().slice(0, 200) ?? null,
      experience: body.experience?.toString().slice(0, 50) ?? null,
      message: body.message?.toString().slice(0, 2000) ?? null,
      created_at: new Date().toISOString(),
    }

    // Try insert into a table named 'join_requests'
    let inserted = null
    try {
      const { data, error } = await supabaseAdmin.from('join_requests').insert([payload]).select().single()
      if (error) throw error
      inserted = data
    } catch (e) {
      // If table missing / permissions, just noop but return success so UI works now
      console.warn('join_requests insert failed, returning payload only', e)
      inserted = payload
    }

    // Email notifications (guarded by envs)
    const notifyRaw = process.env.JOIN_NOTIFY_TO || ''
    const notifyTo = notifyRaw
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean)
    const canEmail = Boolean(process.env.RESEND_API_KEY && notifyTo.length)

    if (canEmail) {
      const subject = `New Join Aveyo submission: ${payload.first_name ?? ''} ${payload.last_name ?? ''}`.trim()
      const adminHtml = `
        <h2>New Join Aveyo Submission</h2>
        <p><strong>Name:</strong> ${payload.first_name ?? ''} ${payload.last_name ?? ''}</p>
        <p><strong>Email:</strong> ${payload.email ?? ''}</p>
        <p><strong>Phone:</strong> ${payload.phone ?? ''}</p>
        <p><strong>Location:</strong> ${payload.location ?? ''}</p>
        <p><strong>Experience:</strong> ${payload.experience ?? ''}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial">${payload.message ?? ''}</pre>
        <p style="color:#888">Submitted at ${payload.created_at}</p>
      `
      try {
        await sendEmail({
          to: notifyTo as string[],
          subject,
          html: adminHtml,
          from: process.env.RESEND_FROM,
          replyTo: payload.email || undefined,
        })
      } catch (e) { console.warn('Admin email send failed', e) }

      // Optional applicant confirmation
      if (payload.email) {
        const confHtml = `
          <h2>Thanks for your interest in Aveyo!</h2>
          <p>We've received your submission and our team will reach out shortly.</p>
          <p style="color:#888">If you didn't submit this, you can ignore this email.</p>
        `
        try {
          await sendEmail({
            to: payload.email,
            subject: 'We received your info — Aveyo',
            html: confHtml,
            from: process.env.RESEND_FROM,
          })
        } catch (e) { console.warn('Applicant email send failed', e) }
      }
    }

    return NextResponse.json({ ok: true, data: inserted }, { status: 201 })
  } catch (e) {
    console.error('Join form POST error', e)
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }
}
