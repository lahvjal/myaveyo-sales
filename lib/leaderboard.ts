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
  // Do NOT pass limit to API; slice on client to avoid API incompatibilities
  const qs = sp.toString()
  return `/api/leaderboard${qs ? `?${qs}` : ''}`
}

function normalizeArray(raw: any): any[] {
  if (Array.isArray(raw)) return raw
  if (Array.isArray(raw?.rows)) return raw.rows
  if (Array.isArray(raw?.data)) return raw.data
  if (Array.isArray(raw?.items)) return raw.items
  if (Array.isArray(raw?.leaderboard)) return raw.leaderboard
  if (Array.isArray(raw?.leaders)) return raw.leaders
  return []
}

function getName(r: any): string {
  const composed = `${r?.firstName ?? ''} ${r?.lastName ?? ''}`.trim()
  return r?.name ?? r?.salesRepName ?? r?.Rep ?? r?.['Sales Rep'] ?? composed
}

function getTSI(r: any): number {
  return Number(r?.tsi ?? r?.TSI ?? r?.TSI_YTD ?? 0)
}

function getTSS(r: any): number {
  return Number(r?.tss ?? r?.TSS ?? r?.TSS_YTD ?? 0)
}

export async function fetchLeaderboard(params: LeaderboardFilters = {}): Promise<LeaderboardEntry[]> {
  const url = buildUrl(params)
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Leaderboard fetch failed (${res.status}): ${text}`)
  }
  const raw = await res.json()
  const data = normalizeArray(raw)
  const metric = params.metric ?? 'tss'
  const sorted = [...data].sort((a, b) => (metric === 'tss' ? getTSS(b) - getTSS(a) : getTSI(b) - getTSI(a)))
  return sorted.map((r, idx) => ({
    name: getName(r),
    tsi: getTSI(r),
    tss: getTSS(r),
    rank: r?.rank ?? idx + 1,
  }))
}

export async function fetchTopLeaders(params: LeaderboardFilters = {}): Promise<LeaderboardEntry[]> {
  const merged: LeaderboardFilters = { role: 'all', time: 'ytd', metric: 'tss', ...params }
  const all = await fetchLeaderboard(merged)
  const limit = typeof params.limit === 'number' ? params.limit : 3
  return all.slice(0, limit)
}
