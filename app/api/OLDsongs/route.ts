import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const connection = await pool.getConnection()
    const [rows] = await connection.execute('SELECT * FROM songs ORDER BY date DESC')
    connection.release()

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

