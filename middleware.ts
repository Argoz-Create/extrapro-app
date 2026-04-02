import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAINTENANCE_PUBLIC_PATHS = ['/maintenance', '/api/unlock', '/favicon.ico']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- Maintenance lock (runs first, on all routes) ---
  const maintenancePassword = process.env.MAINTENANCE_PASSWORD
  if (maintenancePassword) {
    const isPublicPath =
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/static/') ||
      MAINTENANCE_PUBLIC_PATHS.some(p => pathname.startsWith(p))

    if (!isPublicPath) {
      const accessCookie = request.cookies.get('extrapro_access')
      if (accessCookie?.value !== maintenancePassword) {
        const url = request.nextUrl.clone()
        url.pathname = '/maintenance'
        return NextResponse.redirect(url)
      }
    }
  }

  // --- Supabase auth ---
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect logged-in users away from auth pages
  if (
    (pathname === "/login" || pathname === "/register") &&
    user
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
