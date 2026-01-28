import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  const publicPaths = ["/login"];
  const isPublicPath = publicPaths.includes(pathname);

  // Usuario logueado intentando ir a login → redirigir a dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Usuario NO logueado intentando ir a ruta protegida → redirigir a login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Todo OK, dejar pasar
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
