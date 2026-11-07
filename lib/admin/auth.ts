import 'server-only'
import type { NextAuthOptions } from 'next-auth'
import { getServerSession } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import { isAllowedGithubId } from './allow'

/**
 * Admin login: GitHub OAuth, restricted to the GitHub account id(s) in ADMIN_GITHUB_ID.
 * The OAuth scope is only `read:user` (identity). Writing to the repo uses a separate
 * server-side token (GITHUB_CONTENT_TOKEN), never the visitor's own GitHub token.
 */
export const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
            authorization: { params: { scope: 'read:user' } },
        }),
    ],
    session: { strategy: 'jwt', maxAge: 60 * 60 * 8 }, // 8 hours
    pages: { signIn: '/admin/login', error: '/admin/login' },
    callbacks: {
        signIn: ({ account, profile }) =>
            account?.provider === 'github' && isAllowedGithubId((profile as { id?: number } | undefined)?.id),
        jwt: ({ token, account, profile }) => {
            if (account && profile) {
                token.githubId = String((profile as { id: number }).id)
                token.login = (profile as { login?: string }).login
            }
            return token
        },
        session: ({ session, token }) => {
            ;(session as AdminSession).githubId = token.githubId as string | undefined
            ;(session as AdminSession).login = token.login as string | undefined
            return session
        },
    },
}

export type AdminSession = { githubId?: string; login?: string; user?: { name?: string | null; image?: string | null } }

/** Returns the session only if it belongs to an allowed admin. Use in every admin route. */
export async function getAdminSession(): Promise<AdminSession | null> {
    const session = (await getServerSession(authOptions)) as AdminSession | null
    return session && isAllowedGithubId(session.githubId) ? session : null
}
