import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check which environment variables are available
    const envCheck = {
      GOOGLE_PROJECT_ID: !!process.env.GOOGLE_PROJECT_ID,
      GOOGLE_PRIVATE_KEY_ID: !!process.env.GOOGLE_PRIVATE_KEY_ID,
      GOOGLE_PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
      GOOGLE_CLIENT_EMAIL: !!process.env.GOOGLE_CLIENT_EMAIL,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_SHEETS_LEADERBOARD_ID: !!process.env.GOOGLE_SHEETS_LEADERBOARD_ID,
      GOOGLE_SHEETS_GID: !!process.env.GOOGLE_SHEETS_GID,
      GOOGLE_SHEETS_RANGE: !!process.env.GOOGLE_SHEETS_RANGE,
    }

    // Check private key format (first and last 50 chars for debugging)
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
    const privateKeyInfo = privateKey ? {
      hasBeginMarker: privateKey.includes('-----BEGIN PRIVATE KEY-----'),
      hasEndMarker: privateKey.includes('-----END PRIVATE KEY-----'),
      length: privateKey.length,
      firstChars: privateKey.substring(0, 50),
      lastChars: privateKey.substring(privateKey.length - 50),
      hasNewlines: privateKey.includes('\n'),
      hasEscapedNewlines: privateKey.includes('\\n')
    } : null

    return NextResponse.json({
      environment: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      envVariables: envCheck,
      privateKeyInfo,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
