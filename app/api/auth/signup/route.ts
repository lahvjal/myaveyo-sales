import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email'

// POST /api/auth/signup
// body: { email: string, password: string, rep_id: string }
export async function POST(req: NextRequest) {
  try {
    const { email, password, rep_id } = await req.json()
    if (!email || !password || !rep_id) {
      return NextResponse.json({ error: 'Email, password, and rep_id are required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }

    const admin = createClient(supabaseUrl, serviceKey)

    // 1) Validate rep_id exists in sales_reps
    const { data: repRow, error: repErr } = await admin
      .from('sales_reps')
      .select('rep_id, rep_name')
      .eq('rep_id', rep_id)
      .maybeSingle()

    if (repErr) {
      return NextResponse.json({ error: repErr.message }, { status: 400 })
    }
    if (!repRow) {
      return NextResponse.json({ error: 'Rep ID not found. Please contact your admin to verify your Rep ID.' }, { status: 404 })
    }

    // 2) Prevent duplicate or conflicting mappings
    // 2a) If this rep_id is already used by a different email, block
    const { data: existingByRep, error: existRepErr } = await admin
      .from('users')
      .select('email, rep_id')
      .eq('rep_id', rep_id)
      .maybeSingle()
    if (existRepErr) {
      return NextResponse.json({ error: existRepErr.message }, { status: 400 })
    }

    const lowerEmail = String(email).trim().toLowerCase()
    if (existingByRep && existingByRep.email?.toLowerCase() !== lowerEmail) {
      return NextResponse.json({ error: 'This Rep ID is already associated with another account.' }, { status: 409 })
    }

    // 2b) If this email already exists with a different rep_id, block
    const { data: existingByEmail, error: existEmailErr } = await admin
      .from('users')
      .select('email, rep_id')
      .ilike('email', lowerEmail)
      .maybeSingle()
    if (existEmailErr) {
      return NextResponse.json({ error: existEmailErr.message }, { status: 400 })
    }
    if (existingByEmail && existingByEmail.rep_id !== rep_id) {
      return NextResponse.json({ error: 'This email is already registered with a different Rep ID.' }, { status: 409 })
    }

    // 3) Generate a signup confirmation link (lets us send via Resend)
    const redirectTo = 'https://my.aveyosales.com/login?confirmed=1'
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      options: { redirectTo },
    })
    if (linkErr) {
      return NextResponse.json({ error: linkErr.message }, { status: 400 })
    }

    const actionLink = (linkData as any)?.action_link || (linkData as any)?.properties?.action_link
    const userId = linkData?.user?.id
    if (!actionLink || !userId) {
      return NextResponse.json({ error: 'Failed to prepare signup link' }, { status: 400 })
    }

    // 4) Upsert into public.users mapping (email -> rep_id)
    const { error: mapErr } = await admin
      .from('users')
      .upsert({ id: userId, email: lowerEmail, rep_id, role: 'rep' }, { onConflict: 'email' })
    if (mapErr) {
      return NextResponse.json({ error: mapErr.message }, { status: 400 })
    }

    // 5) Populate Auth user metadata (first/last from rep_name if available)
    const repName: string | null = (repRow as any)?.rep_name || null
    const parts = repName ? String(repName).trim().split(/\s+/) : []
    const first_name = parts[0] || null
    const last_name = parts.length > 1 ? parts.slice(1).join(' ') : null

    await admin.auth.admin.updateUserById(userId, {
      user_metadata: {
        sub: userId,
        email: lowerEmail,
        rep_id,
        isAdmin: false,
        first_name,
        last_name,
        email_verified: false,
        phone_verified: false,
      },
    })

    // 6) Send signup email via Resend
    const from = process.env.RESEND_FROM || undefined
    const html = `
      <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111">
        <h2>Confirm your Aveyo Sales account</h2>
        <p>Click the button below to confirm your email and finish creating your account.</p>
        <p><a href="${actionLink}" style="display:inline-block;padding:12px 16px;background:#111;color:#fff;text-decoration:none;border-radius:4px">Confirm account</a></p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break:break-all"><a href="${actionLink}">${actionLink}</a></p>
      </div>
    `
    await sendEmail({ to: lowerEmail, subject: 'Confirm your Aveyo Sales account', html, ...(from ? { from } : {}) })

    return NextResponse.json({ ok: true, message: 'Check your email to confirm your account.' })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}
