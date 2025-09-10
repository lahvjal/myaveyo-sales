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

    console.log('Fetching leaderboard data from Google Sheets:', {
      spreadsheetId: SPREADSHEET_ID,
      sheetGid: SHEET_GID,
      roleFilter,
      timeFilter,
      limit
    })

    // Fetch data from Google Sheets using GID with filters
    const leaderboardData = await googleSheetsService.getLeaderboardData(
      SPREADSHEET_ID,
      SHEET_GID,
      roleFilter,
      timeFilter
    )

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
    console.error('API Error:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    
    // Return mock data as fallback with correct structure
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
