import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { isAllowedGithubId } from '@/lib/admin/allow'

// First line of defense for /admin and /api/admin (each API route checks again server-side).
export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    if (pathname === '/admin/login') return NextResponse.next()

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (token && isAllowedGithubId(token.githubId)) {
        const res = NextResponse.next()
        res.headers.set('X-Robots-Tag', 'noindex, nofollow')
        res.headers.set('Cache-Control', 'no-store')
        return res
    }

    if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin/login', req.url))
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
}
