import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- Domain consolidation (SEO) ---
  // The site was renamed Extra-Pro -> URJAYA. Both domains point at this
  // same deployment, which created duplicate content and let Google index
  // the old extra-pro.com. Permanently redirect any extra-pro.* host to the
  // canonical www.urjaya.fr, preserving the path + query.
  const host = request.headers.get("host") ?? "";
  if (host.includes("extra-pro")) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = "www.urjaya.fr";
    url.port = "";
    return NextResponse.redirect(url, 308);
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
