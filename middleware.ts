import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const authOnlyPrefixes = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const { response, user } = await updateSession(request);

  if (authOnlyPrefixes.some((prefix) => pathname.startsWith(prefix)) && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
