import { NextRequest, NextResponse } from 'next/server'

// Routes that bypass the maintenance lock
const PUBLIC_PATHS = [
  '/maintenance',
  '/api/unlock',
  '/favicon.ico',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow static assets and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    PUBLIC_PATHS.some(p => pathname.startsWith(p))
  ) {
    return NextResponse.next()
  }

  // Check maintenance mode env var — if not set, site is open
  const maintenancePassword = process.env.MAINTENANCE_PASSWORD
  if (!maintenancePassword) {
    return NextResponse.next()
  }

  // Check for valid access cookie
  const accessCookie = request.cookies.get('extrapro_access')
  if (accessCookie?.value === maintenancePassword) {
    return NextResponse.next()
  }

  // No valid cookie → redirect to maintenance page
  const url = request.nextUrl.clone()
  url.pathname = '/maintenance'
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
