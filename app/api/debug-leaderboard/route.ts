import { NextRequest, NextResponse } from 'next/server'
import { googleSheetsService } from '@/lib/googleSheets'

export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUG LEADERBOARD API ===')
    
    const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_LEADERBOARD_ID
    
    if (!SPREADSHEET_ID) {
      return NextResponse.json({ 
        error: 'Missing GOOGLE_SHEETS_LEADERBOARD_ID',
        env: {
          GOOGLE_PROJECT_ID: !!process.env.GOOGLE_PROJECT_ID,
          GOOGLE_PRIVATE_KEY_ID: !!process.env.GOOGLE_PRIVATE_KEY_ID,
          GOOGLE_PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
          GOOGLE_CLIENT_EMAIL: !!process.env.GOOGLE_CLIENT_EMAIL,
          GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
          GOOGLE_SHEETS_LEADERBOARD_ID: !!process.env.GOOGLE_SHEETS_LEADERBOARD_ID,
        }
      })
    }

    console.log('Making exact same call as leaderboard API...')
    
    // Make the exact same call as the leaderboard API
    const leaderboardData = await googleSheetsService.getLeaderboardData(
      SPREADSHEET_ID,
      'SL', // Use 'SL' sheet name
      'all', // roleFilter
      'ytd'  // timeFilter
    )

    console.log('Success! Data received:', {
      totalRows: leaderboardData.length,
      firstThree: leaderboardData.slice(0, 3)
    })

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      spreadsheetId: SPREADSHEET_ID,
      sheetName: 'SL',
      totalRows: leaderboardData.length,
      sampleData: leaderboardData.slice(0, 5),
      totalStats: {
        totalReps: leaderboardData.length,
        totalTSS: leaderboardData.reduce((sum, entry) => sum + entry.tss, 0),
        totalTSI: leaderboardData.reduce((sum, entry) => sum + entry.tsi, 0),
        avgTSS: Math.round(leaderboardData.reduce((sum, entry) => sum + entry.tss, 0) / leaderboardData.length) || 0
      }
    })

  } catch (error) {
    console.error('=== DEBUG LEADERBOARD ERROR ===')
    console.error('Error:', error)
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      timestamp: new Date().toISOString()
    })
  }
}
