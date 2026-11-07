import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin/auth'
import AdminShell from '@/components/admin/AdminShell'

export const dynamic = 'force-dynamic'

// Server-side check on every admin page (in addition to the middleware)
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getAdminSession()
    if (!session) redirect('/admin/login')
    return (
        <AdminShell login={session.login || 'admin'} avatar={session.user?.image || ''}>
            {children}
        </AdminShell>
    )
}
