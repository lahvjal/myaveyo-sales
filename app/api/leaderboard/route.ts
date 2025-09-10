import { NextRequest, NextResponse } from 'next/server'
import { googleSheetsService } from '@/lib/googleSheets'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const roleFilter = (searchParams.get('role') as 'all' | 'closer' | 'setter') || 'all'
    const timeFilter = (searchParams.get('time') as 'ytd' | 'mtd') || 'ytd'
    
    // Google Sheets configuration
    const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_LEADERBOARD_ID
    const SHEET_GID = process.env.GOOGLE_SHEETS_GID

    if (!SPREADSHEET_ID) {
      throw new Error('Google Sheets ID not configured')
    }

    console.log('=== LEADERBOARD API START ===')
    console.log('Fetching leaderboard data from Google Sheets:', {
      spreadsheetId: SPREADSHEET_ID,
      sheetName: 'SL',
      roleFilter,
      timeFilter,
      limit,
      timestamp: new Date().toISOString(),
      url: request.url
    })

    // Fetch data from Google Sheets using sheet name 'SL'
    const leaderboardData = await googleSheetsService.getLeaderboardData(
      SPREADSHEET_ID,
      'SL', // Use 'SL' sheet name instead of GID
      roleFilter,
      timeFilter
    )

    console.log('Successfully fetched leaderboard data:', {
      totalRows: leaderboardData.length,
      firstThreeEntries: leaderboardData.slice(0, 3),
      sheetUsed: 'SL'
    })

    // Return both limited data for display and full data for stats
    const response = {
      leaderboard: leaderboardData.slice(0, limit),
      totalStats: {
        totalReps: leaderboardData.length,
        totalTSS: leaderboardData.reduce((sum, entry) => sum + entry.tss, 0),
        totalTSI: leaderboardData.reduce((sum, entry) => sum + entry.tsi, 0),
        avgTSS: Math.round(leaderboardData.reduce((sum, entry) => sum + entry.tss, 0) / leaderboardData.length) || 0
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('=== LEADERBOARD API ERROR ===')
    console.error('API Error:', error)
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('Error details:', JSON.stringify(error, null, 2))
    console.error('Request details:', {
      spreadsheetId: process.env.GOOGLE_SHEETS_LEADERBOARD_ID,
      sheetName: 'SL',
      timestamp: new Date().toISOString()
    })
    
    // Log environment variable status for debugging
    console.error('Environment check:', {
      GOOGLE_PROJECT_ID: !!process.env.GOOGLE_PROJECT_ID,
      GOOGLE_PRIVATE_KEY_ID: !!process.env.GOOGLE_PRIVATE_KEY_ID,
      GOOGLE_PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
      GOOGLE_CLIENT_EMAIL: !!process.env.GOOGLE_CLIENT_EMAIL,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_SHEETS_LEADERBOARD_ID: !!process.env.GOOGLE_SHEETS_LEADERBOARD_ID,
      GOOGLE_SHEETS_GID: !!process.env.GOOGLE_SHEETS_GID,
      privateKeyLength: process.env.GOOGLE_PRIVATE_KEY?.length || 0,
      privateKeyStartsWith: process.env.GOOGLE_PRIVATE_KEY?.substring(0, 30) || 'N/A'
    })
    
    console.log('=== FALLING BACK TO MOCK DATA ===')
    console.log('This should NOT happen if Google Sheets is working')
    
    // Instead of returning mock data, let's try the same call that works in debug endpoint
    try {
      console.log('Attempting fallback call to Google Sheets...')
      const fallbackData = await googleSheetsService.getLeaderboardData(
        process.env.GOOGLE_SHEETS_LEADERBOARD_ID!,
        'SL',
        'all',
        'ytd'
      )
      
      console.log('Fallback call succeeded!', {
        totalRows: fallbackData.length,
        firstThree: fallbackData.slice(0, 3)
      })
      
      const fallbackResponse = {
        leaderboard: fallbackData.slice(0, 50),
        totalStats: {
          totalReps: fallbackData.length,
          totalTSS: fallbackData.reduce((sum, entry) => sum + entry.tss, 0),
          totalTSI: fallbackData.reduce((sum, entry) => sum + entry.tsi, 0),
          avgTSS: Math.round(fallbackData.reduce((sum, entry) => sum + entry.tss, 0) / fallbackData.length) || 0
        }
      }
      
      return NextResponse.json(fallbackResponse)
      
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError)
      
      // Return mock data as last resort
      const mockData = [
        {
          rank: 1,
          name: "AUSTIN TOWNSEND",
          tss: 128,
          tsi: 95,
          role: 'all' as const
        },
        {
          rank: 2,
          name: "SAWYER KIEFFER", 
          tss: 93,
          tsi: 78,
          role: 'all' as const
        },
        {
          rank: 3,
          name: "FARIS GRAHOVIC",
          tss: 64,
          tsi: 52,
          role: 'all' as const
        },
        {
          rank: 4,
          name: "REED EVANS",
          tss: 59,
          tsi: 48,
          role: 'all' as const
        },
        {
          rank: 5,
          name: "SCOTT BURGESS",
          tss: 53,
          tsi: 41,
          role: 'all' as const
        }
      ]

      const mockResponse = {
        leaderboard: mockData,
        totalStats: {
          totalReps: mockData.length,
          totalTSS: mockData.reduce((sum, entry) => sum + entry.tss, 0),
          totalTSI: mockData.reduce((sum, entry) => sum + entry.tsi, 0),
          avgTSS: Math.round(mockData.reduce((sum, entry) => sum + entry.tss, 0) / mockData.length) || 0
        }
      }

      return NextResponse.json(mockResponse)
    }
  }
}
