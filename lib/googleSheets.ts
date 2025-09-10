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
      this.auth = new GoogleAuth({
        credentials: {
          type: 'service_account',
          project_id: process.env.GOOGLE_PROJECT_ID,
          private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          client_id: process.env.GOOGLE_CLIENT_ID
        } as any,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
      })

      this.sheets = google.sheets({ version: 'v4', auth: this.auth })
    } catch (error) {
      console.error('Failed to initialize Google Sheets auth:', error)
      throw new Error('Google Sheets authentication failed')
    }
  }

  async getLeaderboardData(
    spreadsheetId: string, 
    gid?: string,
    roleFilter: 'all' | 'closer' | 'setter' = 'all',
    timeFilter: 'ytd' | 'mtd' = 'ytd'
  ): Promise<LeaderboardEntry[]> {
    if (!this.sheets) {
      await this.initializeAuth()
    }

    try {
      // Determine the range to fetch - ensure we get all columns up to X
      let range = 'A:X' // Fetch columns A through X to include all TSS/TSI data
      if (gid) {
        // First get sheet info to find the sheet name by GID
        const sheetInfo = await this.getSheetInfo(spreadsheetId)
        const sheet = sheetInfo.sheets?.find(s => s.sheetId?.toString() === gid)
        if (sheet?.title) {
          range = `${sheet.title}!A:X`
        }
      }

      const response = await this.sheets!.spreadsheets.values.get({
        spreadsheetId,
        range,
      })

      const rows = response.data.values
      if (!rows || rows.length === 0) {
        console.log('No rows found in spreadsheet')
        return []
      }

      console.log('Raw spreadsheet data:')
      console.log('Total rows:', rows.length)
      console.log('First row (headers):', rows[0])
      console.log('Second row (first data):', rows[1])
      console.log('Row length:', rows[1]?.length)

      // Expected columns: A=Rep Name, N=Total TSS, P=Closer TSS, R=Setter TSS, T=Total TSI, V=Closer TSI, X=Setter TSI
      const leaderboardData: LeaderboardEntry[] = rows.slice(1).map((row, index) => {
        const repName = row[0] || 'Unknown' // Column A
        
        // Choose columns based on time filter
        let totalTSS, closerTSS, setterTSS, totalTSI, closerTSI, setterTSI
        
        if (timeFilter === 'mtd') {
          // MTD columns - H, J, L (all TSS data)
          totalTSS = parseFloat(row[7]) || 0    // Column H (index 7) - Total TSS MTD
          closerTSS = parseFloat(row[9]) || 0   // Column J (index 9) - Closer TSS MTD
          setterTSS = parseFloat(row[11]) || 0  // Column L (index 11) - Setter TSS MTD
          // MTD only has TSS data, no TSI data available
          totalTSI = 0
          closerTSI = 0
          setterTSI = 0
        } else {
          // YTD columns (default) - N, P, R, T, V, X
          totalTSS = parseFloat(row[13]) || 0   // Column N (index 13)
          closerTSS = parseFloat(row[15]) || 0  // Column P (index 15)
          setterTSS = parseFloat(row[17]) || 0  // Column R (index 17)
          
          totalTSI = parseFloat(row[19]) || 0   // Column T (index 19)
          closerTSI = parseFloat(row[21]) || 0  // Column V (index 21)
          setterTSI = parseFloat(row[23]) || 0  // Column X (index 23)
        }

        // Debug logging for first few rows
        if (index < 3) {
          console.log(`Row ${index + 1} (${repName}) - ${timeFilter.toUpperCase()} filter:`)
          console.log('  Raw row data:', row)
          if (timeFilter === 'mtd') {
            console.log('  Column H (index 7):', row[7], '-> Total TSS MTD:', totalTSS)
            console.log('  Column J (index 9):', row[9], '-> Closer TSS MTD:', closerTSS)
            console.log('  Column L (index 11):', row[11], '-> Setter TSS MTD:', setterTSS)
            console.log('  TSI values (MTD has no TSI data):', totalTSI, closerTSI, setterTSI)
          } else {
            console.log('  Column N (index 13):', row[13], '-> Total TSS:', totalTSS)
            console.log('  Column T (index 19):', row[19], '-> Total TSI:', totalTSI)
            console.log('  Column P (index 15):', row[15], '-> Closer TSS:', closerTSS)
            console.log('  Column V (index 21):', row[21], '-> Closer TSI:', closerTSI)
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
          role: roleFilter
        }
      })

      // Sort by TSS (Total Solar Sold) descending, then by TSI as tiebreaker
      leaderboardData.sort((a, b) => {
        if (b.tss !== a.tss) return b.tss - a.tss
        return b.tsi - a.tsi
      })
      
      // Update ranks after sorting
      leaderboardData.forEach((entry, index) => {
        entry.rank = index + 1
      })

      return leaderboardData
    } catch (error) {
      console.error('Error fetching Google Sheets data:', error)
      throw new Error('Failed to fetch leaderboard data from Google Sheets')
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
