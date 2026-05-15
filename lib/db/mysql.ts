import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

function getPool(): mysql.Pool {
  if (pool) return pool
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 25060,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  })
  return pool
}

export type RepRow = {
  rep_id: string
  rep_name: string
  status: string
}

/**
 * Look up a rep by their Podio Id (the numeric Id column, e.g. 2927336804)
 * from PodioTables.SalesReps — the canonical source of truth for all reps.
 * Returns the rep record if found, null otherwise.
 */
export async function getRepById(repId: string): Promise<RepRow | null> {
  const db = getPool()
  const [rows] = await db.execute<mysql.RowDataPacket[]>(
    'SELECT `Id` AS rep_id, `Sales_Rep_Full_Name` AS rep_name, `Status` AS status FROM `PodioTables`.`SalesReps` WHERE `Id` = ? LIMIT 1',
    [repId]
  )
  if (!rows.length) return null
  return {
    rep_id: String(rows[0].rep_id),
    rep_name: rows[0].rep_name as string,
    status: rows[0].status as string,
  }
}
