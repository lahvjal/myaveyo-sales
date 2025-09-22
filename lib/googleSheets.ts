/**
 * Google Sheets API integration for private spreadsheets
 * Uses service account authentication for secure access
 */

import { GoogleAuth } from 'google-auth-library'
import { sheets_v4, google } from 'googleapis'

interface LeaderboardEntry {
  rank: number
  name: string
  tss: number // Total Solar Sold (points from sold projects)
  tsi: number // Total Solar Installed (points from installed projects)
  role?: 'all' | 'closer' | 'setter'
}

class GoogleSheetsService {
  private sheets: sheets_v4.Sheets | null = null
  private auth: GoogleAuth | null = null

  constructor() {
    this.initializeAuth()
  }

  private async initializeAuth() {
    try {
      // Initialize Google Auth with service account credentials
      let privateKey = process.env.GOOGLE_PRIVATE_KEY
      
      // Handle different private key formats from Vercel
      if (privateKey) {
        // Remove extra quotes if present
        privateKey = privateKey.replace(/^"(.*)"$/, '$1')
        // Replace escaped newlines with actual newlines
        privateKey = privateKey.replace(/\\n/g, '\n')
      }

      this.auth = new GoogleAuth({
        credentials: {
          type: 'service_account',
          project_id: process.env.GOOGLE_PROJECT_ID,
          private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
          private_key: privateKey,
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          client_id: process.env.GOOGLE_CLIENT_ID
        } as any,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
      })

      this.sheets = google.sheets({ version: 'v4', auth: this.auth })
    } catch (error) {
      console.error('Failed to initialize Google Sheets auth:', error)
      console.error('Auth error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        privateKeyPresent: !!process.env.GOOGLE_PRIVATE_KEY,
        privateKeyLength: process.env.GOOGLE_PRIVATE_KEY?.length || 0,
        clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
        projectId: process.env.GOOGLE_PROJECT_ID
      })
      throw new Error(`Google Sheets authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getLeaderboardData(
    spreadsheetId: string, 
    sheetName?: string,
    roleFilter: 'all' | 'closer' | 'setter' = 'all',
    timeFilter: 'ytd' | 'mtd' = 'ytd',
    sortBy: 'tsi' | 'tss' = 'tsi'
  ): Promise<LeaderboardEntry[]> {
    if (!this.sheets) {
      await this.initializeAuth()
    }

    try {
      // Determine the range to fetch - ensure we get all columns up to AD
      let range = 'A:AD' // Default range for first sheet
      if (sheetName) {
        range = `${sheetName}!A:AD` // Use specific sheet name
      }

      const response = await this.sheets!.spreadsheets.values.get({
        spreadsheetId,
        range,
      })

      const rows = response.data.values
      console.log('Raw spreadsheet data fetched:', {
        range,
        totalRows: rows?.length || 0,
        firstFiveRows: rows?.slice(0, 5) || [],
        headers: rows?.[0] || []
      })

      if (!rows || rows.length === 0) {
        console.log('No rows found in spreadsheet')
        return []
      }


      // Updated column mappings:
      // YTD: N=All TSS, P=Closer TSS, R=Setter TSS, Z=All TSI, AB=Closer TSI, AD=Setter TSI
      // MTD: H=All TSS, J=Closer TSS, L=Setter TSS, T=All TSI, V=Closer TSI, X=Setter TSI
      console.log('Processing rows into leaderboard data:', {
        totalDataRows: rows.length - 1,
        sampleRawRow: rows[1] || [],
        columnMappings: {
          'A (Name)': rows[1]?.[0],
          'N (YTD All TSS)': rows[1]?.[13],
          'Z (YTD All TSI)': rows[1]?.[25],
          'H (MTD All TSS)': rows[1]?.[7],
          'T (MTD All TSI)': rows[1]?.[19]
        },
        sortBy
      })

      const leaderboardData: LeaderboardEntry[] = rows.slice(1).map((row, index) => {
        const repName = row[0] || 'Unknown' // Column A
        
        // Choose columns based on time filter
        let totalTSS, closerTSS, setterTSS, totalTSI, closerTSI, setterTSI
        
        if (timeFilter === 'mtd') {
          // MTD columns: H=All TSS, J=Closer TSS, L=Setter TSS, T=All TSI, V=Closer TSI, X=Setter TSI
          totalTSS = parseFloat(row[7]) || 0    // Column H (index 7) - All MTD TSS
          closerTSS = parseFloat(row[9]) || 0   // Column J (index 9) - Closer MTD TSS
          setterTSS = parseFloat(row[11]) || 0  // Column L (index 11) - Setter MTD TSS
          
          totalTSI = parseFloat(row[19]) || 0   // Column T (index 19) - All MTD TSI
          closerTSI = parseFloat(row[21]) || 0  // Column V (index 21) - Closer MTD TSI
          setterTSI = parseFloat(row[23]) || 0  // Column X (index 23) - Setter MTD TSI
        } else {
          // YTD columns: N=All TSS, P=Closer TSS, R=Setter TSS, Z=All TSI, AB=Closer TSI, AD=Setter TSI
          totalTSS = parseFloat(row[13]) || 0   // Column N (index 13) - All YTD TSS
          closerTSS = parseFloat(row[15]) || 0  // Column P (index 15) - Closer YTD TSS
          setterTSS = parseFloat(row[17]) || 0  // Column R (index 17) - Setter YTD TSS
          
          totalTSI = parseFloat(row[25]) || 0   // Column Z (index 25) - All YTD TSI
          closerTSI = parseFloat(row[27]) || 0  // Column AB (index 27) - Closer YTD TSI
          setterTSI = parseFloat(row[29]) || 0  // Column AD (index 29) - Setter YTD TSI
        }

        // Debug logging for first few rows
        if (index < 3) {
          console.log(`Row ${index + 1} (${repName}) - ${timeFilter.toUpperCase()} filter:`)
          console.log('  Raw row data:', row)
          if (timeFilter === 'mtd') {
            console.log('  Column H (index 7):', row[7], '-> All TSS MTD:', totalTSS)
            console.log('  Column J (index 9):', row[9], '-> Closer TSS MTD:', closerTSS)
            console.log('  Column L (index 11):', row[11], '-> Setter TSS MTD:', setterTSS)
            console.log('  Column T (index 19):', row[19], '-> All TSI MTD:', totalTSI)
            console.log('  Column V (index 21):', row[21], '-> Closer TSI MTD:', closerTSI)
            console.log('  Column X (index 23):', row[23], '-> Setter TSI MTD:', setterTSI)
          } else {
            console.log('  Column N (index 13):', row[13], '-> All TSS YTD:', totalTSS)
            console.log('  Column P (index 15):', row[15], '-> Closer TSS YTD:', closerTSS)
            console.log('  Column R (index 17):', row[17], '-> Setter TSS YTD:', setterTSS)
            console.log('  Column Z (index 25):', row[25], '-> All TSI YTD:', totalTSI)
            console.log('  Column AB (index 27):', row[27], '-> Closer TSI YTD:', closerTSI)
            console.log('  Column AD (index 29):', row[29], '-> Setter TSI YTD:', setterTSI)
          }
        }

        // Calculate TSS and TSI based on role filter
        let tss = 0
        let tsi = 0
        
        switch (roleFilter) {
          case 'closer':
            tss = closerTSS
            tsi = closerTSI
            break
          case 'setter':
            tss = setterTSS
            tsi = setterTSI
            break
          case 'all':
          default:
            tss = totalTSS
            tsi = totalTSI
            break
        }

        return {
          rank: index + 1,
          name: repName,
          tss,
          tsi,
          role: 'all' // All entries are from the combined leaderboard, role filter affects TSS/TSI values only
        }
      })

      // Sort by selected metric descending, use the other metric as a tiebreaker
      leaderboardData.sort((a, b) => {
        if (sortBy === 'tss') {
          if (b.tss !== a.tss) return b.tss - a.tss
          return b.tsi - a.tsi
        }
        if (b.tsi !== a.tsi) return b.tsi - a.tsi
        return b.tss - a.tss
      })
      
      // Update ranks after sorting
      leaderboardData.forEach((entry, index) => {
        entry.rank = index + 1
      })

      console.log(`Final processed leaderboard data (${roleFilter}, ${timeFilter}, sortBy=${sortBy}):`, {
        totalEntries: leaderboardData.length,
        topThree: leaderboardData.slice(0, 3),
        sampleEntry: leaderboardData[0] ? {
          name: leaderboardData[0].name,
          tss: leaderboardData[0].tss,
          tsi: leaderboardData[0].tsi,
          rank: leaderboardData[0].rank
        } : null
      })

      return leaderboardData
    } catch (error) {
      console.error('Error fetching Google Sheets data:', error)
      console.error('Fetch error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        spreadsheetId,
        sheetName,
        code: (error as any)?.code,
        status: (error as any)?.status,
        statusText: (error as any)?.statusText
      })
      throw new Error(`Failed to fetch leaderboard data from Google Sheets: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getSheetInfo(spreadsheetId: string) {
    if (!this.sheets) {
      await this.initializeAuth()
    }

    try {
      const response = await this.sheets!.spreadsheets.get({
        spreadsheetId,
      })

      return {
        title: response.data.properties?.title,
        sheets: response.data.sheets?.map(sheet => ({
          title: sheet.properties?.title,
          sheetId: sheet.properties?.sheetId
        }))
      }
    } catch (error) {
      console.error('Error getting sheet info:', error)
      throw new Error('Failed to get spreadsheet information')
    }
  }

  async validateAccess(spreadsheetId: string): Promise<boolean> {
    try {
      await this.getSheetInfo(spreadsheetId)
      return true
    } catch (error) {
      return false
    }
  }
}

// Export singleton instance
export const googleSheetsService = new GoogleSheetsService()

// Helper function to format points
export function formatPoints(points: number): string {
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}K`
  }
  return points.toFixed(1)
}

// Helper function to get role display name
export function getRoleDisplayName(role: 'all' | 'closer' | 'setter'): string {
  switch (role) {
    case 'all': return 'All Roles'
    case 'closer': return 'Closers'
    case 'setter': return 'Setters'
    default: return 'All Roles'
  }
}

// Helper function to get time period display name
export function getTimePeriodDisplayName(period: 'ytd' | 'mtd'): string {
  switch (period) {
    case 'ytd': return 'Year to Date'
    case 'mtd': return 'Month to Date'
    default: return 'Year to Date'
  }
}
