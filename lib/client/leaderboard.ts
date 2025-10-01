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

function buildUrl(params: LeaderboardFilters) {
  const sp = new URLSearchParams()
  if (params.role) sp.set('role', params.role)
  if (params.time) sp.set('time', params.time)
  if (params.metric) sp.set('metric', params.metric)
  const qs = sp.toString()
  return `/api/leaderboard${qs ? `?${qs}` : ''}`
}

export async function fetchTopLeaders(params: LeaderboardFilters = {}): Promise<LeaderboardEntry[]> {
  const url = buildUrl(params)
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Leaderboard fetch failed (${res.status}): ${text}`)
  }
  const raw = await res.json()
  const data: LeaderboardEntry[] = Array.isArray(raw?.leaderboard) ? raw.leaderboard : []
  const limit = typeof params.limit === 'number' ? params.limit : 3
  return data.slice(0, limit)
}

export type LeaderboardStats = {
  totalReps: number
  totalTSS: number
  totalTSI: number
  avgTSS: number
}

export async function fetchLeaderboardFull(params: LeaderboardFilters = {}): Promise<{ leaderboard: LeaderboardEntry[]; totalStats: LeaderboardStats }>{
  const url = buildUrl(params)
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Leaderboard fetch failed (${res.status}): ${text}`)
  }
  const raw = await res.json()
  const leaderboard: LeaderboardEntry[] = Array.isArray(raw?.leaderboard) ? raw.leaderboard : Array.isArray(raw) ? raw : []
  const totalStats: LeaderboardStats = raw?.totalStats ?? {
    totalReps: leaderboard.length,
    totalTSS: leaderboard.reduce((s, e) => s + (e.tss || 0), 0),
    totalTSI: leaderboard.reduce((s, e) => s + (e.tsi || 0), 0),
    avgTSS: leaderboard.length ? Math.round(leaderboard.reduce((s, e) => s + (e.tss || 0), 0) / leaderboard.length) : 0,
  }
  return { leaderboard, totalStats }
}
