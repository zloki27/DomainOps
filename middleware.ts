import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { REPORT_ACCESS_COOKIE, resolveReportAccess } from './lib/report-access';

export function middleware(request: NextRequest) {
  const decision = resolveReportAccess({
    secret: process.env.REPORT_ACCESS_TOKEN,
    pathname: request.nextUrl.pathname,
    cookieToken: request.cookies.get(REPORT_ACCESS_COOKIE)?.value ?? null,
    queryToken: request.nextUrl.searchParams.get('token'),
  });

  if (!decision.authorized) {
    return new NextResponse('Not found', { status: 404 });
  }

  if (decision.shouldSetCookie) {
    const response = request.nextUrl.pathname.startsWith('/api/')
      ? NextResponse.next()
      : NextResponse.redirect(new URL(decision.redirectPath ?? '/', request.url));

    response.cookies.set(REPORT_ACCESS_COOKIE, process.env.REPORT_ACCESS_TOKEN!, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/report/:path*', '/api/report/:path*'],
};
