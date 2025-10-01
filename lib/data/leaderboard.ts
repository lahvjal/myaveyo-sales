import { googleSheetsService } from '@/lib/googleSheets'

export type LeaderboardFilters = {
  role?: 'all' | 'closer' | 'setter'
  time?: 'ytd' | 'mtd'
  metric?: 'tsi' | 'tss'
  limit?: number
}

export type LeaderboardEntry = {
  name: string
  tsi: number
  tss: number
  rank?: number
  role?: 'all' | 'closer' | 'setter'
}

export async function getLeaderboard(params: LeaderboardFilters = {}) {
  const role = params.role ?? 'all'
  const time = params.time ?? 'ytd'
  const metric = params.metric ?? 'tsi'
  const spreadsheetId = process.env.GOOGLE_SHEETS_LEADERBOARD_ID!
  // Always use 'SL' sheet by name (validated previously)
  const rows = await googleSheetsService.getLeaderboardData(
    spreadsheetId,
    'SL',
    role,
    time,
    metric
  )
  return rows as LeaderboardEntry[]
}

export async function getTopLeaders(params: LeaderboardFilters = {}) {
  const limit = typeof params.limit === 'number' ? params.limit : 50
  const data = await getLeaderboard(params)
  return data.slice(0, limit)
}
