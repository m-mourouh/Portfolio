import AdminOverview from '@/components/admin/AdminOverview'

export default function AdminHome() {
    return (
        <AdminOverview
            repo={process.env.GITHUB_REPO || '(not set)'}
            branch={process.env.GITHUB_BRANCH || 'main'}
            configured={Boolean(process.env.GITHUB_CONTENT_TOKEN && process.env.GITHUB_REPO)}
        />
    )
}
