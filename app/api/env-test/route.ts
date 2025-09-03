import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    databaseUrl: process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV
  })
}
