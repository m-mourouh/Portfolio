// Who may use /admin. Kept dependency-free so it also runs in middleware (edge runtime).
// Fails closed: if ADMIN_GITHUB_ID is not set, nobody is allowed.
export const isAllowedGithubId = (id: unknown): boolean => {
    const allowed = (process.env.ADMIN_GITHUB_ID || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    return id !== undefined && id !== null && allowed.includes(String(id))
}
