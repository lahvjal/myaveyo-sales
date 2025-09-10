import { NextResponse } from 'next/server'
import { googleSheetsService } from '@/lib/googleSheets'

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    tests: {}
  }

  try {
    // Test 1: Check environment variables
    results.tests.environmentVariables = {
      GOOGLE_PROJECT_ID: !!process.env.GOOGLE_PROJECT_ID,
      GOOGLE_PRIVATE_KEY_ID: !!process.env.GOOGLE_PRIVATE_KEY_ID,
      GOOGLE_PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
      GOOGLE_CLIENT_EMAIL: !!process.env.GOOGLE_CLIENT_EMAIL,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_SHEETS_LEADERBOARD_ID: !!process.env.GOOGLE_SHEETS_LEADERBOARD_ID,
      GOOGLE_SHEETS_GID: !!process.env.GOOGLE_SHEETS_GID,
      privateKeyLength: process.env.GOOGLE_PRIVATE_KEY?.length || 0,
      privateKeyFormat: {
        hasBeginMarker: process.env.GOOGLE_PRIVATE_KEY?.includes('-----BEGIN PRIVATE KEY-----') || false,
        hasEndMarker: process.env.GOOGLE_PRIVATE_KEY?.includes('-----END PRIVATE KEY-----') || false,
        hasNewlines: process.env.GOOGLE_PRIVATE_KEY?.includes('\n') || false,
        hasEscapedNewlines: process.env.GOOGLE_PRIVATE_KEY?.includes('\\n') || false,
        firstChars: process.env.GOOGLE_PRIVATE_KEY?.substring(0, 50) || 'N/A'
      }
    }

    // Test 2: Test Google Sheets authentication
    try {
      const spreadsheetId = process.env.GOOGLE_SHEETS_LEADERBOARD_ID!
      const sheetInfo = await googleSheetsService.getSheetInfo(spreadsheetId)
      results.tests.authentication = {
        success: true,
        spreadsheetTitle: sheetInfo.title,
        sheets: sheetInfo.sheets
      }

      // Test 3: Test data fetch from SL sheet specifically
      try {
        const leaderboardData = await googleSheetsService.getLeaderboardData(
          spreadsheetId,
          'SL', // Test SL sheet specifically
          'all',
          'ytd'
        )
        results.tests.dataFetchSL = {
          success: true,
          rowCount: leaderboardData.length,
          sampleData: leaderboardData.slice(0, 3),
          sheetUsed: 'SL'
        }
      } catch (fetchError) {
        results.tests.dataFetchSL = {
          success: false,
          error: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error',
          stack: fetchError instanceof Error ? fetchError.stack : 'No stack trace',
          sheetUsed: 'SL'
        }
      }

      // Test 4: Test data fetch from default sheet for comparison
      try {
        const leaderboardData = await googleSheetsService.getLeaderboardData(
          spreadsheetId,
          undefined, // Default sheet
          'all',
          'ytd'
        )
        results.tests.dataFetchDefault = {
          success: true,
          rowCount: leaderboardData.length,
          sampleData: leaderboardData.slice(0, 3),
          sheetUsed: 'default'
        }
      } catch (fetchError) {
        results.tests.dataFetchDefault = {
          success: false,
          error: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error',
          stack: fetchError instanceof Error ? fetchError.stack : 'No stack trace',
          sheetUsed: 'default'
        }
      }

    } catch (authError) {
      results.tests.authentication = {
        success: false,
        error: authError instanceof Error ? authError.message : 'Unknown auth error',
        stack: authError instanceof Error ? authError.stack : 'No stack trace'
      }
    }

  } catch (generalError) {
    results.error = {
      message: generalError instanceof Error ? generalError.message : 'Unknown error',
      stack: generalError instanceof Error ? generalError.stack : 'No stack trace'
    }
  }

  return NextResponse.json(results, { 
    headers: { 'Content-Type': 'application/json' }
  })
}
