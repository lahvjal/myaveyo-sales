import { NextRequest, NextResponse } from 'next/server'
import { getLeaderboard } from '@/lib/data/leaderboard'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '50')
  const role = (searchParams.get('role') as 'all' | 'closer' | 'setter') || 'all'
  const time = (searchParams.get('time') as 'ytd' | 'mtd') || 'ytd'
  const metric = (searchParams.get('metric') as 'tsi' | 'tss') || 'tsi'
  try {
    const data = await getLeaderboard({ role, time, metric, limit })
    const response = {
      leaderboard: data.slice(0, limit),
      totalStats: {
        totalReps: data.length,
        totalTSS: data.reduce((sum: number, e: any) => sum + (e.tss || 0), 0),
        totalTSI: data.reduce((sum: number, e: any) => sum + (e.tsi || 0), 0),
        avgTSS: (() => {
          const total = data.reduce((sum: number, e: any) => sum + (e.tss || 0), 0)
          return data.length ? Math.round(total / data.length) : 0
        })(),
      },
    }
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}
