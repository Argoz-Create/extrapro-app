import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { password } = body

  const maintenancePassword = process.env.MAINTENANCE_PASSWORD

  if (!maintenancePassword || password !== maintenancePassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  // Set the access cookie — valid for 30 days
  const cookieStore = await cookies()
  cookieStore.set('extrapro_access', maintenancePassword, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })

  return NextResponse.json({ success: true })
}
